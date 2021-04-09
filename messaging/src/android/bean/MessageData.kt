package com.cxist.mirror.bean

/**
 * author : ParfoisMeng
 * time   : 2021-03-12
 * desc   : 消息实体
 */
data class MessageData(
        val title: String = "Mirror MES",
        val content: String?,
        val link: String? = null
) {
    companion object {
        const val LINK_KEY = "message_data_link_key"
    }
}
