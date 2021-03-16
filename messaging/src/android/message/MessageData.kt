package com.cxist.mirror.message

/**
 * author : ParfoisMeng
 * time   : 2021-03-12
 * desc   : 消息实体
 */
data class MessageData(
        val message: String,
        val link: String? = null
) {
    companion object {
        const val LINK_KEY = "message_data_link_key"
    }
}
