package com.cxist.mirror.message

import android.util.Log
import com.cxist.mirror.bean.ServiceState
import com.cxist.mirror.bean.TokenInfo
import com.google.gson.Gson
import com.tencent.mmkv.MMKV

fun log(msg: String) {
    Log.d("Mirror MES", msg)
}

val gson by lazy { Gson() }

private val mmkv by lazy { MMKV.defaultMMKV() }

private const val key_service_state = "MIRROR_MES_SERVICE_STATE"

fun setServiceState(state: ServiceState) {
    mmkv?.encode(key_service_state, state.name)
}

fun getServiceState(): ServiceState {
    val value = mmkv?.decodeString(key_service_state) ?: ServiceState.STOPPED.name
    return ServiceState.valueOf(value)
}

private const val key_token_info = "MIRROR_MES_TOKEN_INFO"

fun setTokenInfo(infoStr: String?) {
    if (infoStr.isNullOrEmpty()) {
        mmkv?.removeValueForKey(key_token_info)
    } else {
        mmkv?.encode(key_token_info, infoStr)
    }
}

fun setTokenInfo(info: TokenInfo?) {
    val infoStr = info?.let { gson.toJson(info) }
    setTokenInfo(infoStr)
}

fun getTokenInfo(): TokenInfo? {
    return mmkv?.decodeString(key_token_info)?.let {
        gson.fromJson(it, TokenInfo::class.java)
    }
}

private const val key_alias = "MIRROR_MES_ALIAS"

fun setAlias(alias: String) {
    mmkv?.encode(key_alias, alias)
}

fun getAlias(): String {
    return mmkv?.decodeString(key_alias) ?: ""
}
