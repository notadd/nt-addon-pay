import { Inject, Module, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { PayAddonConfig, PayAddonConfigProvider } from '../../common';
import { WechatSandboxResponse } from './interfaces/sandbox.interface';
import { WechatAppPayService } from './services/app.pay.service';
import { WechatAppletPayService } from './services/applet.pay.service';
import { WechatPayBaseService } from './services/base.service';
import { WechatJSAPIPayService } from './services/jsapi.pay.service';
import { WechatMicroPayService } from './services/micro.pay.service';
import { WechatNativePayService } from './services/native.pay.service';
import { WechatWapPayService } from './services/wap.pay.service';
import { WechatRequestUtil } from './utils/request.util';
import { WechatSignUtil } from './utils/sign.util';

@Module({
    imports: [],
    providers: [
        WechatPayBaseService,
        WechatAppPayService,
        WechatAppletPayService,
        WechatJSAPIPayService,
        WechatMicroPayService,
        WechatNativePayService,
        WechatWapPayService,
        WechatSignUtil,
        WechatRequestUtil
    ],
    exports: [WechatAppPayService, WechatAppletPayService, WechatJSAPIPayService, WechatMicroPayService, WechatNativePayService, WechatWapPayService]
})
export class WechatPayModule implements OnModuleInit {
    /** 沙箱环境获取验签秘钥接口地址 */
    private readonly sandboxGetSignKeyUrl = 'https://api.mch.weixin.qq.com/sandboxnew/pay/getsignkey';

    constructor(
        @Inject(WechatRequestUtil) private readonly wechatRequestUtil: WechatRequestUtil,
        @Inject(PayAddonConfigProvider) private readonly payAddonConfig: PayAddonConfig
    ) { }

    async onModuleInit() {
        if (fs.existsSync(path.join(__dirname, '.sandbox_signkey.txt'))) {
            this.payAddonConfig.wechatConfig.secretKey = fs.readFileSync(path.join(__dirname, '.sandbox_signkey.txt')).toString();
        } else {
            const data = await this.getSandboxSignKey();
            if (data.return_code === 'FAIL') {
                const errmsg = data.retmsg ? data.retmsg : data.return_msg;
                throw new Error('微信支付获取沙箱环境秘钥时出现异常：' + errmsg);
            }
            fs.writeFileSync(path.join(__dirname, '.sandbox_signkey.txt'), data.sandbox_signkey);
            this.payAddonConfig.wechatConfig.secretKey = data.sandbox_signkey;
        }
    }

    /**
     * 获取微信支付沙箱环境秘钥
     */
    private async getSandboxSignKey() {
        return await this.wechatRequestUtil.post<WechatSandboxResponse>(this.sandboxGetSignKeyUrl, {});
    }
}