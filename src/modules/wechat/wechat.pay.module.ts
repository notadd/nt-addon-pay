import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { PayAddonConfig, PayAddonConfigProvider } from '../../common';
import { WechatSandboxResponse } from './interfaces/sandbox.interface';
import { WechatPayBaseService } from './services/wechat.pay.base.service';
import { WechatPayOrderService } from './services/wechat.pay.order.service';
import { WechatRequestUtil } from './utils/request.util';
import { WechatSignUtil } from './utils/sign.util';

@Module({
    imports: [],
    providers: [
        WechatPayBaseService,
        WechatPayOrderService,
        WechatSignUtil,
        WechatRequestUtil
    ],
    exports: []
})
export class WechatPayModule implements OnModuleInit {
    /** 沙箱环境获取验签秘钥接口地址 */
    private readonly sandboxGetSignKeyUrl = 'https://api.mch.weixin.qq.com/sandboxnew/pay/getsignkey';

    constructor(
        @Inject(WechatRequestUtil) private readonly wechatRequestUtil: WechatRequestUtil,
        @Inject(PayAddonConfigProvider) private readonly payAddonConfig: PayAddonConfig
    ) { }

    async onModuleInit() {
        if (existsSync(join(__dirname, '../../../.sandbox_signkey.txt'))) {
            this.payAddonConfig.wechatConfig.secretKey = readFileSync(join(__dirname, '../../../.sandbox_signkey.txt')).toString();
        } else {
            const data = await this.getSandboxSignKey();
            if (data.return_code === 'FAIL') {
                throw new Error('微信支付获取沙箱环境秘钥时出现异常：' + data.retmsg);
            }
            writeFileSync(join(__dirname, '../../../.sandbox_signkey.txt'), data.sandbox_signkey);
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