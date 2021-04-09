package com.cxist.mirror.bean

import com.google.gson.annotations.SerializedName

data class TokenInfo(
        @SerializedName("access_token")
        val token: String,
        @SerializedName("refresh_token")
        val refreshToken: String,
        @SerializedName("expires_in")
        val expiresIn: Long
) {
    // 本地字段，当前类的创建时间，用于计算过期时间
    val createTimeSecond: Long = System.currentTimeMillis() / 1000
}