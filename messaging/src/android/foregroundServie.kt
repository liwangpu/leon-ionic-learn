package com.cxist.messaging

import android.content.Intent
import android.os.Build
import android.os.Bundle
import androidx.core.content.ContextCompat.startForegroundService
import org.apache.cordova.*
import com.cxist.mirror.message.*

/**
 * This class echoes a string called from JavaScript.
 */
class foregroundServie : CordovaPlugin() {

    override fun execute(
        action: String,
        args: CordovaArgs,
        callbackContext: CallbackContext
    ): Boolean {
        var result = true
        try {
            actionOnService(Actions.START)
        } catch (e: Exception) {
            callbackContext.error(e.message)
            result = false
        }

        return result
    }

    private fun actionOnService(action: Actions) {

        if (getServiceState(this.cordova.context) == ServiceState.STOPPED && action == Actions.STOP) return

        Intent(this.cordova.context, MirrorMESService::class.java).also {
            it.action = action.name
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                log("Android O 以上需要用 startForegroundService 启动前台服务")
                startForegroundService(this.cordova.context, it)
                return
            }
            // log("Android O 以下可以直接启动服务")
        //    startService(it)
        }
    }
}
