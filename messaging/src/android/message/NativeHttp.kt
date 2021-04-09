package com.cxist.mirror.message

import com.cxist.mirror.bean.TokenInfo
import okhttp3.OkHttpClient
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST

/**
 * author : ParfoisMeng
 * time   : 2021-03-25
 * desc   : ...
 */
object NativeHttp {
    var SERVICE_BASE_URL = "http://cxvpn.cxist.com:22504"
    const val SERVICE_MESSAGE = "/message/signalr"
    private const val SERVICE_TOKEN = "/ids/connect/token"

    private val api by lazy {
        val retrofit = Retrofit.Builder()
                .baseUrl(SERVICE_BASE_URL)
                .client(OkHttpClient.Builder().build())
                .addConverterFactory(GsonConverterFactory.create())
                .build()
        retrofit.create(Api::class.java)
    }

    /**
     * 获取班级列表
     */
    suspend fun refreshToken(refreshToken: String): Response<TokenInfo> {
        return api.refreshToken(Api.ReqBeanRefreshToken(refreshToken))
    }

    interface Api {
        /**
         * 获取班级列表接口
         */
        @POST(SERVICE_TOKEN)
        suspend fun refreshToken(@Body params: ReqBeanRefreshToken): Response<TokenInfo>
        data class ReqBeanRefreshToken(
                val refresh_token: String,
                val grant_type: String = "refresh_token",
                val client_id: String = "server"
        )
    }
}