package com.cxist.mirror;

import android.app.Application;

import com.tencent.mmkv.MMKV;

/**
 * author : ParfoisMeng
 * time   : 2021-03-25
 * desc   : ...
 */
public class MainApplication extends Application {
    public void onCreate() {
        super.onCreate();

        // 初始化 MMKV
        MMKV.initialize(this);
    }
}
