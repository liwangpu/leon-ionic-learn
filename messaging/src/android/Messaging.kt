package com.cxist.mirror

import com.cxist.mirror.bean.ActionStartupInfo
import com.cxist.mirror.bean.Actions
import com.cxist.mirror.bean.TokenInfo
import com.cxist.mirror.message.*
import com.cxist.mirror.service.MirrorMESService
import org.apache.cordova.CallbackContext
import org.apache.cordova.CordovaArgs
import org.apache.cordova.CordovaPlugin

/**
 * This class echoes a string called from JavaScript.
 */
class Messaging : CordovaPlugin() {

    override fun execute(action: String, args: CordovaArgs, callbackContext: CallbackContext): Boolean {
        try {
            when (action) {
                STARTUP -> {
                    // 所有配置项 json格式的字符串
                    val info = gson.fromJson(args.optString(0), ActionStartupInfo::class.java)
                    log("info = $info")
                    // token
                    setTokenInfo(TokenInfo(info.token, info.refreshToken, info.expiresIn))
                    // alias 别名
                    setAlias(info.alias)
                    // 服务器地址
                    if (info.baseUrl != NativeHttp.SERVICE_BASE_URL) {
                        // 如果SignalR地址变更，需要将原服务停止后再设置新地址，然后启动服务
                        NativeHttp.SERVICE_BASE_URL = info.baseUrl
                        MirrorMESService.actionOnService(cordova.context, Actions.STOP)
                    }
                    MirrorMESService.actionOnService(cordova.context, Actions.START)
                }
                SHUTDOWN -> {
                    setTokenInfo(infoStr = null)
                    MirrorMESService.actionOnService(cordova.context, Actions.STOP)
                }
                SET_TOKEN -> {
                    val tokenStr = args.optString(0)
                    setTokenInfo(tokenStr)
                }
                GET_TOKEN -> {
                    val tokenStr = getTokenInfo()?.let { gson.toJson(it) }
                    callbackContext.success(tokenStr)
                    return true
                }
            }
            callbackContext.success("$action execute successful")
            return true
        } catch (e: Exception) {
            callbackContext.error(e.message)
            return false
        }
    }

    companion object {
        /**
         * 开启服务
         */
        const val STARTUP = "startup"

        /**
         * 停止服务
         */
        const val SHUTDOWN = "shutdown"

        /**
         * 存Token
         */
        const val SET_TOKEN = "setToken"

        /**
         * 取Token
         */
        const val GET_TOKEN = "getToken"
    }
}

