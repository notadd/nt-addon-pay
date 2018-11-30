import { DynamicModule, Global, HttpModule, Module } from '@nestjs/common';
import * as https from 'https';

import { PayAddonConfig, PayAddonConfigProvider } from '../common';
import { WeChatCertificateAgentProvider } from '../modules/wechat/constants/wechat.constant';
import { RandomUtil } from './utils/random.util';
import { XmlUtil } from './utils/xml.util';

@Global()
@Module({})
export class SharedModule {
    static forFeature(config: PayAddonConfig): DynamicModule {
        const pfx = this.createCertificateAgent(config.wechatConfig.pfx, config.wechatConfig.mch_id);
        return {
            module: SharedModule,
            imports: [HttpModule],
            providers: [
                XmlUtil,
                RandomUtil,
                { provide: PayAddonConfigProvider, useValue: config },
                { provide: WeChatCertificateAgentProvider, useValue: pfx }
            ],
            exports: [HttpModule, RandomUtil, XmlUtil, PayAddonConfigProvider, WeChatCertificateAgentProvider]
        };
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