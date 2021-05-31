package com.cxist.mirror.message

import com.cxist.mirror.bean.MessageData
import com.microsoft.signalr.HubConnection
import com.microsoft.signalr.HubConnectionBuilder
import com.microsoft.signalr.TransportEnum
import io.reactivex.Single
import io.reactivex.SingleObserver
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.json.JSONObject

/**
 * author : ParfoisMeng
 * time   : 2021-03-12
 * desc   : SignalR使用类
 */
object SignalR {
    private var hubConnection: HubConnection? = null
    private var messageReceived: MessageReceivedCall? = null

    fun create() {
        log("SignalR create")
        hubConnection = HubConnectionBuilder
            .create(NativeHttp.SERVICE_BASE_URL + NativeHttp.SERVICE_MESSAGE)
            .setHttpClientBuilderCallback {
                try {
                    val ssl = HttpsUtils.getSslSocketFactory()
                    it.sslSocketFactory(ssl.sSLSocketFactory, ssl.trustManager)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
            .withAccessTokenProvider(object : Single<String>() {
                override fun subscribeActual(observer: SingleObserver<in String>) {
                    log("SignalR withAccessTokenProvider")
                    getTokenInfo()?.let {
                        val nowTimeSecond = System.currentTimeMillis() / 1000
                        if (nowTimeSecond - it.createTimeSecond >= it.expiresIn) {
                            // 当前时间不在有效期内，启动协程异步刷新 token
                            GlobalScope.launch {
                                log("SignalR withAccessTokenProvider - refreshToken")
                                try {
                                    val result = NativeHttp.refreshToken(it.refreshToken).body()
                                    setTokenInfo(result)
                                    result?.token?.let { token ->
                                        observer.onSuccess(token)
                                    } ?: run {
                                        // 网络请求没错但返回结果失败
                                        messageReceived?.invoke(MessageData(content = "已掉线，请重新登录"))
                                        destroy()
                                        observer.onSuccess("TokenInfo is null")
                                    }
                                } catch (e: Exception) {
                                    // 网络请求过程中抛出异常
                                    messageReceived?.invoke(MessageData(content = "已掉线，请重新登录"))
                                    destroy()
                                    observer.onSuccess("TokenInfo is null")
                                }
                            }
                        } else {
                            // 当前时间还在有效期内，直接返回当前 token
                            observer.onSuccess(it.token)
                        }
                    } ?: run {
                        // 本地没有token信息，直接掉线
                        messageReceived?.invoke(MessageData(content = "已掉线，请重新登录"))
                        destroy()
                        observer.onSuccess("TokenInfo is null")
                    }
                }
            })
            .withTransport(TransportEnum.LONG_POLLING)
            .build()
        hubConnection?.start()?.blockingAwait()
        log("SignalR create start blockingAwait")

        hubConnection?.on("messageReceived", { _: String?, msg: String ->
            log("SignalR messageReceived listener")
            try {
                // 取出原数据中的 Message Info
                val jo = JSONObject(msg)
                val msgObj = jo.optJSONObject("message")
                val msgInfo = msgObj?.optString("info") ?: ""

                // 构造通知消息体
                val message = gson.fromJson(msgInfo, MessageData::class.java)
                messageReceived?.invoke(message)
            } catch (e: Exception) {
                messageReceived?.invoke(MessageData(content = "消息解析异常"))
            }
        }, String::class.java, String::class.java)
        log("SignalR create on messageReceived")

        hubConnection?.send("BindAlias", getAlias(), "mobile")
        log("SignalR create BindAlias")
    }

    fun listener(callback: MessageReceivedCall) {
        messageReceived = callback
    }

    fun destroy() {
        hubConnection?.stop()
        hubConnection = null
        messageReceived = null
    }
}

typealias MessageReceivedCall = (data: MessageData) -> Unit