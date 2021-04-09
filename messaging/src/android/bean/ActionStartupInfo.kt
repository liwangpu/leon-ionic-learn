package com.cxist.mirror.bean

import com.google.gson.annotations.SerializedName

/**
 * author : ParfoisMeng
 * time   : 2021-03-29
 * desc   : ...
 */
data class ActionStartupInfo(
        @SerializedName("gateway")
        val baseUrl: String = "",
        val refreshToken: String,
        val token: String,
        val expiresIn: Long,
        @SerializedName("aliase")
        val alias: String = ""
)