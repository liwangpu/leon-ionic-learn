/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.cxist.mirror;

import android.content.Intent;
import android.os.Bundle;

import com.cxist.mirror.bean.Actions;
import com.cxist.mirror.bean.MessageData;
import com.cxist.mirror.message.UtilsKt;
import com.cxist.mirror.service.MirrorMESService;

import org.apache.cordova.CordovaActivity;

public class MainActivity extends CordovaActivity {

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        clickNotification(intent);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        clickNotification(getIntent());

        // enable Cordova apps to be started in the background
        Bundle extras = getIntent().getExtras();
        if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
            moveTaskToBack(true);
        }

        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);
    }

    /**
     * 点击通知
     */
    private void clickNotification(Intent intent) {
        if (intent != null) {
            if (intent.hasExtra(MessageData.LINK_KEY)) {
                MirrorMESService.actionOnService(this, Actions.START);
                String link = intent.getStringExtra(MessageData.LINK_KEY);
                if (link != null) {
                    UtilsKt.log("消息点击跳转链接 = " + link);
                    // TODO 账号登录处理与跳转指定页面
                }

            }
        }
    }
}
