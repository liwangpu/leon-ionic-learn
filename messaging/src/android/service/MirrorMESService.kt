package com.cxist.mirror.service

import android.app.*
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import android.os.SystemClock
import androidx.core.app.NotificationCompat
import com.cxist.mirror.MainActivity
import com.cxist.mirror.R
import com.cxist.mirror.bean.Actions
import com.cxist.mirror.bean.MessageData
import com.cxist.mirror.bean.ServiceState
import com.cxist.mirror.message.SignalR
import com.cxist.mirror.message.getServiceState
import com.cxist.mirror.message.log
import com.cxist.mirror.message.setServiceState

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
        if (isServiceStarted) {
            val notification = createNotification()
            startForeground(1, notification)
            return
        }

        log("Starting the foreground service task")
        isServiceStarted = true
        setServiceState(ServiceState.STARTED)

        // 避免睡眠模式服务被杀死
        wakeLock = (getSystemService(Context.POWER_SERVICE) as PowerManager).run {
            newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "MirrorMESService::lock").apply { acquire() }
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
        setServiceState(ServiceState.STOPPED)
    }

    private fun createNotification(data: MessageData = MessageData(content = null)): Notification {
        val notificationChannelId = if (data.content.isNullOrEmpty()) "Mirror MES Low" else "Mirror MES High"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val importance = if (data.content.isNullOrEmpty()) NotificationManager.IMPORTANCE_LOW else NotificationManager.IMPORTANCE_HIGH
            val channel = NotificationChannel(notificationChannelId, "Mirror MES", importance).let {
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
            notificationIntent.putExtra(MessageData.LINK_KEY, data.link)
            PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT)
        }

        val builder: Notification.Builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, notificationChannelId)
        } else {
            Notification.Builder(this)
        }

        return builder
                .setContentTitle(data.title)
                .setContentText(data.content)
                .setContentIntent(pendingIntent)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setTicker("Mirror MES")
                .setPriority(Notification.PRIORITY_HIGH) // for under android 26 compatibility
                .apply {
                    if (data.content.isNullOrEmpty()) {
                        setDefaults(NotificationCompat.FLAG_ONLY_ALERT_ONCE)
                    }
                }
                .build()
    }

    override fun onBind(intent: Intent): IBinder? {
        return null
    }

    companion object {
        @JvmStatic
        fun actionOnService(context: Context, action: Actions) {
            if ((getServiceState() == ServiceState.STOPPED || !isServiceRunning(context)) && action == Actions.STOP) return
            Intent(context, MirrorMESService::class.java).also {
                it.action = action.name
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    log("Android O 以上需要用 startForegroundService 启动前台服务")
                    context.startForegroundService(it)
                    return
                }
                log("Android O 以下可以直接启动服务")
                context.startService(it)
            }
        }

        /**
         * 判断服务是否正在运行
         */
        private fun isServiceRunning(context: Context): Boolean {
            val am = context.getSystemService(ACTIVITY_SERVICE) as ActivityManager
            val runningServices: List<ActivityManager.RunningServiceInfo> =
                am.getRunningServices(100)
            for (runningServiceInfo in runningServices) {
                val className: String = runningServiceInfo.service.className
                if (className == "com.cxist.mirror.service.MirrorMESService") {
                    return true //判断服务是否运行
                }
            }
            return false
        }
    }
}
