package com.cxist.mirror.message

import android.app.*
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import android.os.SystemClock
import com.cxist.mirror.MainActivity
import com.cxist.mirror.R
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class MirrorMESService : Service() {

    private var wakeLock: PowerManager.WakeLock? = null
    private var isServiceStarted = false

    override fun onCreate() {
        super.onCreate()
        log("The service has been created")

        val notification = createNotification()
        startForeground(1, notification)

        SignalR.create()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        log("onStartCommand executed with startId: $startId")
        if (intent != null) {
            val action = intent.action
            log("using an intent with action $action")
            when (action) {
                Actions.START.name -> startService()
                Actions.STOP.name -> stopService()
                else -> log("This should never happen. No action in the received intent")
            }
        } else {
            log("with a null intent. It has been probably restarted by the system.")
        }
        // 被系统杀死时重启服务（部分机型）
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        log("The service has been destroyed")

        SignalR.destroy()
    }

    override fun onTaskRemoved(rootIntent: Intent) {
        // 服务被手动杀掉时触发，定时 1s 后重启服务（部分机型）
        val restartServiceIntent = Intent(applicationContext, MirrorMESService::class.java).also { it.setPackage(packageName) }
        val restartServicePendingIntent: PendingIntent = PendingIntent.getService(this, 1, restartServiceIntent, PendingIntent.FLAG_ONE_SHOT);
        applicationContext.getSystemService(Context.ALARM_SERVICE);
        val alarmService: AlarmManager = applicationContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager;
        alarmService.set(AlarmManager.ELAPSED_REALTIME, SystemClock.elapsedRealtime() + 1000, restartServicePendingIntent)
    }

    private fun startService() {
        if (isServiceStarted) return

        log("Starting the foreground service task")
        isServiceStarted = true
        setServiceState(this, ServiceState.STARTED)

        // 避免睡眠模式服务被杀死
        wakeLock = (getSystemService(Context.POWER_SERVICE) as PowerManager).run {
            newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "MirrorMESService::lock").apply { acquire() }
        }

        // 协程，每30秒发一次消息保持活跃
        GlobalScope.launch {
            while (isServiceStarted) {
                launch {
                    log("每30秒发一次消息保持活跃")
                    SignalR.send("ping every 30s")
                }
                delay(30 * 1000)
            }
            log("End of the loop for the service")
        }

        // 接收消息的监听
        SignalR.listener {
            log("SignalR Test ReceiveMessage: message = $it")

            val notification = createNotification(it)
            startForeground(1, notification)
        }
    }

    private fun stopService() {
        log("Stopping the foreground service")
        try {
            wakeLock?.let { if (it.isHeld) it.release() }
            stopForeground(true)
            stopSelf()
        } catch (e: Exception) {
            log("Service stopped without being started: ${e.message}")
        }
        isServiceStarted = false
        setServiceState(this, ServiceState.STOPPED)
    }

    private fun createNotification(data: MessageData? = null): Notification {
        val notificationChannelId = "Mirror MES"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val channel = NotificationChannel(notificationChannelId, "Mirror MES", NotificationManager.IMPORTANCE_HIGH).let {
                it.description = "Mirror MES"
                it.enableLights(true)
                it.lightColor = Color.GREEN
                it.enableVibration(true)
                it.vibrationPattern = longArrayOf(100, 200, 300, 400, 500, 400, 300, 200, 400)
                it
            }
            notificationManager.createNotificationChannel(channel)
        }

        val pendingIntent: PendingIntent = Intent(this, MainActivity::class.java).let { notificationIntent ->
            notificationIntent.putExtra(MessageData.LINK_KEY, data?.link)
            PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT)
        }

        val builder: Notification.Builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, notificationChannelId)
        } else {
            Notification.Builder(this)
        }

        return builder
                .setContentTitle("Mirror MES")
                .setContentText(data?.message)
                .setContentIntent(pendingIntent)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setTicker("Mirror MES")
                .setPriority(Notification.PRIORITY_HIGH) // for under android 26 compatibility
                .build()
    }

    override fun onBind(intent: Intent): IBinder? {
        return null
    }
}
