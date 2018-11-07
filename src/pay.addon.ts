import { DynamicModule, HttpModule, Inject, Module, OnModuleInit } from '@nestjs/common';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { PayAddonConfigProvider } from './constants/addon.constant';
import { PayAddonConfig } from './interfaces/addon.config.interface';
import { SandboxResponse } from './interfaces/sandbox.interface';
import { WechatPayBaseService } from './services/wechat.pay.base.service';
import { WechatPayOrderService } from './services/wechat.pay.order.service';
import { RandomUtil } from './utils/random.util';
import { SignUtil } from './utils/sign.util';
import { WechatRequestUtil } from './utils/wechat.request.util';
import { XmlUtil } from './utils/xml.util';

@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [
        WechatPayBaseService,
        WechatPayOrderService,
        WechatRequestUtil,
        XmlUtil,
        SignUtil,
        RandomUtil
    ],
    exports: []
})
export class PayAddon implements OnModuleInit {
    /** 沙箱环境获取验签秘钥接口地址 */
    private readonly sandboxGetSignKeyUrl = 'https://api.mch.weixin.qq.com/sandboxnew/pay/getsignkey';

    constructor(
        @Inject(WechatRequestUtil) private readonly wechatRequestUtil: WechatRequestUtil,
        @Inject(PayAddonConfigProvider) private readonly payAddonConfig: PayAddonConfig
    ) { }

    static forRoot(config: PayAddonConfig): DynamicModule {
        return {
            module: PayAddon,
            providers: [{ provide: PayAddonConfigProvider, useValue: config }],
            exports: []
        };
    }

    async onModuleInit() {
        const wechatConfig = this.payAddonConfig.wechatConfig;
        const aliConfig = this.payAddonConfig.aliConfig;
        if (!wechatConfig && !aliConfig) {
            throw Error('请至少指定一种支付方式的配置');
        }
        if (wechatConfig) {
            const data = await this.getWechatSandboxSignKey();
            if (data.return_code === 'FAIL') {
                throw new Error('微信支付获取沙箱环境秘钥时出现异常：' + data.retmsg);
            }
            if (existsSync(join(__dirname, '../.sandbox_signkey.txt'))) {
                wechatConfig.secretKey = readFileSync(join(__dirname, '../.sandbox_signkey.txt')).toString();
            } else {
                writeFileSync(join(__dirname, '../.sandbox_signkey.txt'), data.sandbox_signkey);
                wechatConfig.secretKey = data.sandbox_signkey;
            }
        }
        if (aliConfig) {
            // TODO: 支付宝沙箱配置
        }
    }

    /**
     * 获取微信支付沙箱环境秘钥
     */
    private async getWechatSandboxSignKey() {
        return await this.wechatRequestUtil.post<SandboxResponse>(this.sandboxGetSignKeyUrl, {});
    }
}