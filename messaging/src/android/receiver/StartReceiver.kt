package com.cxist.mirror.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import com.cxist.mirror.bean.Actions
import com.cxist.mirror.bean.ServiceState
import com.cxist.mirror.message.getServiceState
import com.cxist.mirror.message.log
import com.cxist.mirror.service.MirrorMESService

class StartReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED && getServiceState() == ServiceState.STARTED) {
            // 开机自启的广播接收器 - 需要在手机设置中允许自启才可以接收
            Intent(context, MirrorMESService::class.java).also {
                it.action = Actions.START.name
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    log("开机自启，Android O 以上需要用 startForegroundService 启动前台服务")
                    context.startForegroundService(it)
                    return
                }
                log("开机自启，Android O 以下可以直接启动服务")
                context.startService(it)
            }
        }
    }
}
