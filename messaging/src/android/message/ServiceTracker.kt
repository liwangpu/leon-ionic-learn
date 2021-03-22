package com.cxist.mirror.message

import android.content.Context
import android.content.SharedPreferences

enum class ServiceState {
    STARTED,
    STOPPED,
}

private const val name = "MIRROR_MES_SP_NAME"
private const val key = "MIRROR_MES_SP_SERVICE_STATE"

fun setServiceState(context: Context, state: ServiceState) {
    val sharedPrefs = getPreferences(context)
    sharedPrefs.edit().let {
        it.putString(key, state.name)
        it.apply()
    }
}

fun getServiceState(context: Context): ServiceState {
    val sharedPrefs = getPreferences(context)
    val value = sharedPrefs.getString(key, ServiceState.STOPPED.name) ?: ServiceState.STOPPED.name
    return ServiceState.valueOf(value)
}

private fun getPreferences(context: Context): SharedPreferences {
    return context.getSharedPreferences(name, 0)
}
