import { DynamicModule, Global, HttpModule, Module } from '@nestjs/common';
import { existsSync, PathLike, readFileSync } from 'fs';
import { Agent } from 'https';

import { PayAddonConfig, PayAddonConfigProvider } from '../common';
import { WechatCertificateAgentProvider } from '../modules/wechat/constants/wechat.constant';
import { RandomUtil } from './utils/random.util';
import { XmlUtil } from './utils/xml.util';

@Global()
@Module({})
export class SharedModule {
    static forFeature(config: PayAddonConfig): DynamicModule {
        const certificate = this.createCertificateAgent(config.wechatConfig.certificatePath, config.wechatConfig.mch_id);
        return {
            module: SharedModule,
            imports: [HttpModule],
            providers: [
                XmlUtil,
                RandomUtil,
                { provide: PayAddonConfigProvider, useValue: config },
                { provide: WechatCertificateAgentProvider, useValue: certificate }
            ],
            exports: [HttpModule, RandomUtil, XmlUtil, PayAddonConfigProvider, WechatCertificateAgentProvider]
        };
    }

    /**
     * 创建请求证书代理
     *
     * 此 agent 仅用于微信支付的申请退款、撤销订单和下载资金账单接口
     */
    private static createCertificateAgent(certificatePath: PathLike, mchId: string): Agent {
        if (!existsSync(certificatePath)) throw Error('读取商户证书失败，请检查商户证书路径是否正确');
        return new Agent({
            pfx: readFileSync(certificatePath),
            passphrase: mchId
        });
    }
}