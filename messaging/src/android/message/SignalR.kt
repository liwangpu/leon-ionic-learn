package com.cxist.mirror.message

import com.microsoft.signalr.HubConnection
import com.microsoft.signalr.HubConnectionBuilder
import org.json.JSONObject

/**
 * author : ParfoisMeng
 * time   : 2021-03-12
 * desc   : SignalR使用类
 */
object SignalR {
    private var hubConnection: HubConnection? = null

    fun create() {
        hubConnection = HubConnectionBuilder.create("http://122.51.54.26:9882/chathub").build()
        hubConnection?.start()?.blockingAwait()
    }

    fun listener(callback: (data: MessageData) -> Unit) {
        hubConnection?.on("ReceiveMessage", { param: String ->
            try {
                val jo = JSONObject(param)
                val message = jo.optString("message")
                val link = jo.optString("link")
                callback(MessageData(message, link))
            } catch (e: Exception) {
                callback(MessageData(param))
            }
        }, String::class.java)
    }

    fun send(message: String) {
        hubConnection?.send("Send", message)
    }

    fun destroy() {
        hubConnection?.stop()
    }
}