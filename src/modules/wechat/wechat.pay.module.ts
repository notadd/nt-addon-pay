import { Inject, Module, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { PayAddonConfig, PayAddonConfigProvider } from '../../common';
import { WeChatSandboxResponse } from './interfaces/sandbox.interface';
import { WeChatAppPayService } from './services/app.pay.service';
import { WeChatAppletPayService } from './services/applet.pay.service';
import { WeChatPayBaseService } from './services/base.service';
import { WeChatJSAPIPayService } from './services/jsapi.pay.service';
import { WeChatMicroPayService } from './services/micro.pay.service';
import { WeChatNativePayService } from './services/native.pay.service';
import { WeChatWapPayService } from './services/wap.pay.service';
import { WeChatNotifyParserUtil } from './utils/notify-parser.util';
import { WeChatRequestUtil } from './utils/request.util';
import { WeChatSignUtil } from './utils/sign.util';

@Module({
    imports: [],
    providers: [
        WeChatPayBaseService,
        WeChatAppPayService,
        WeChatAppletPayService,
        WeChatJSAPIPayService,
        WeChatMicroPayService,
        WeChatNativePayService,
        WeChatWapPayService,
        WeChatSignUtil,
        WeChatRequestUtil,
        WeChatNotifyParserUtil
    ],
    exports: [
        WeChatAppPayService,
        WeChatAppletPayService,
        WeChatJSAPIPayService,
        WeChatMicroPayService,
        WeChatNativePayService,
        WeChatWapPayService,
        WeChatNotifyParserUtil
    ]
})
export class WeChatPayModule implements OnModuleInit {
    /** 沙箱环境获取验签秘钥接口地址 */
    private readonly sandboxGetSignKeyUrl = 'https://api.mch.weixin.qq.com/sandboxnew/pay/getsignkey';
    private readonly sandboxSignKeyFileName = '.sandbox_signkey.txt';

    constructor(
        @Inject(WeChatRequestUtil) private readonly wechatRequestUtil: WeChatRequestUtil,
        @Inject(PayAddonConfigProvider) private readonly payAddonConfig: PayAddonConfig
    ) { }

    async onModuleInit() {
        if (!this.payAddonConfig.wechatConfig.sandbox) return;

        const sandboxSignKeyExipre = this.checkSandboxSignKeyExpire();
        if (!sandboxSignKeyExipre) {
            const fileContent = fs.readFileSync(path.join(__dirname, this.sandboxSignKeyFileName)).toString();
            this.payAddonConfig.wechatConfig.secretKey = JSON.parse(fileContent).key;
        } else {
            const data = await this.getSandboxSignKey();
            if (data.return_code === 'FAIL') {
                const errmsg = data.retmsg ? data.retmsg : data.return_msg;
                throw new Error('微信支付获取沙箱环境秘钥时出现异常：' + errmsg);
            }
            const fileContent = JSON.stringify({ key: data.sandbox_signkey, createdAt: +new Date() });
            fs.writeFileSync(path.join(__dirname, this.sandboxSignKeyFileName), fileContent);
            this.payAddonConfig.wechatConfig.secretKey = data.sandbox_signkey;
        }
    }

    /**
     * 获取微信支付沙箱环境秘钥
     */
    private async getSandboxSignKey() {
        return await this.wechatRequestUtil.post<WeChatSandboxResponse>(this.sandboxGetSignKeyUrl, {});
    }

    /**
     * 检查沙箱秘钥是否过期
     */
    private checkSandboxSignKeyExpire(): boolean {
        const exist = fs.existsSync(path.join(__dirname, this.sandboxSignKeyFileName));
        if (!exist) return true;
        const fileContent = fs.readFileSync(path.join(__dirname, this.sandboxSignKeyFileName)).toString();
        return (+new Date()) - JSON.parse(fileContent).createdAt > (3600 * 48 * 1000);
    }
}