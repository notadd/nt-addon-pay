import { DynamicModule, Inject, Module, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';

import { WeChatPayConfig } from '../../common';
import { SharedModule } from '../../shared/shared.module';
import { WeChatPayCertificateAgentProvider, WeChatPayConfigProvider } from './constants/wechat.constant';
import { WeChatSandboxResponse } from './interfaces/sandbox.interface';
import { WeChatAppPayService } from './services/app.pay.service';
import { WeChatAppletPayService } from './services/applet.pay.service';
import { WeChatPayBaseService } from './services/base.service';
import { WeChatJSAPIPayService } from './services/jsapi.pay.service';
import { WeChatMicroPayService } from './services/micro.pay.service';
import { WeChatNativePayService } from './services/native.pay.service';
import { WeChatRedpackService } from './services/redpack.service';
import { WeChatTransferService } from './services/transfer.service';
import { WeChatWapPayService } from './services/wap.pay.service';
import { WeChatNotifyParserUtil } from './utils/notify-parser.util';
import { WeChatRequestUtil } from './utils/request.util';
import { WeChatSignUtil } from './utils/sign.util';

@Module({})
export class WeChatPayModule implements OnModuleInit {
    /** 沙箱环境获取验签秘钥接口地址 */
    private readonly sandboxGetSignKeyUrl = 'https://api.mch.weixin.qq.com/sandboxnew/pay/getsignkey';
    /** 沙箱密钥文件名 */
    private readonly sandboxSignKeyFileName = '.sandbox_signkey.txt';

    constructor(
        @Inject(WeChatRequestUtil) private readonly wechatRequestUtil: WeChatRequestUtil,
        @Inject(WeChatPayConfigProvider) private readonly config: WeChatPayConfig
    ) { }

    static forRoot(config: WeChatPayConfig): DynamicModule {
        const certificateAgent = this.createCertificateAgent(config.pfx, config.mch_id);
        return {
            module: WeChatPayModule,
            imports: [SharedModule],
            providers: [
                WeChatPayBaseService,
                WeChatAppPayService,
                WeChatAppletPayService,
                WeChatJSAPIPayService,
                WeChatMicroPayService,
                WeChatNativePayService,
                WeChatWapPayService,
                WeChatRedpackService,
                WeChatTransferService,
                WeChatSignUtil,
                WeChatRequestUtil,
                WeChatNotifyParserUtil,
                { provide: WeChatPayCertificateAgentProvider, useValue: certificateAgent },
                { provide: WeChatPayConfigProvider, useValue: config },
            ],
            exports: [
                WeChatAppPayService,
                WeChatAppletPayService,
                WeChatJSAPIPayService,
                WeChatMicroPayService,
                WeChatNativePayService,
                WeChatWapPayService,
                WeChatRedpackService,
                WeChatTransferService,
                WeChatNotifyParserUtil
            ]
        };
    }

    async onModuleInit() {
        if (!this.config.sandbox) return;

        // 如果启用了沙箱环境，sign_type(签名类型)只能为MD5，必须强制改写签名类型以防止初始化时传入错误的签名类型
        this.config.sign_type = 'MD5';
        const sandboxSignKeyExipre = this.checkSandboxSignKeyExpire();
        if (!sandboxSignKeyExipre) {
            const fileContent = fs.readFileSync(path.join(__dirname, this.sandboxSignKeyFileName)).toString();
            this.config.secretKey = JSON.parse(fileContent).key;
        } else {
            const data = await this.getSandboxSignKey();
            if (data.return_code === 'FAIL') {
                const errmsg = data.retmsg ? data.retmsg : data.return_msg;
                throw new Error('微信支付获取沙箱环境秘钥时出现异常：' + errmsg);
            }
            const fileContent = JSON.stringify({ key: data.sandbox_signkey, createdAt: +new Date() });
            fs.writeFileSync(path.join(__dirname, this.sandboxSignKeyFileName), fileContent);
            this.config.secretKey = data.sandbox_signkey;
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
        return (+new Date()) - JSON.parse(fileContent).createdAt > (3600 * 24 * 1000);
    }

    /**
     * 创建请求证书代理
     *
     * 此 agent 仅用于微信支付的申请退款、撤销订单和下载资金账单接口
     */
    private static createCertificateAgent(pfx: Buffer, mchId: string): https.Agent {
        if (!pfx) throw Error('读取商户证书失败');
        return new https.Agent({
            pfx,
            passphrase: mchId
        });
    }
}