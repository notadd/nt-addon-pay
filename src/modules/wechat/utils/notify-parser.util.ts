import { Inject, Injectable } from '@nestjs/common';

import { PayAddonConfig, PayAddonConfigProvider } from '../../../common';
import { XmlUtil } from '../../../shared/utils/xml.util';
import { WeChatPayBaseNotifyRes } from '../interfaces/pay-notify.interface';
import { WeChatSignUtil } from './sign.util';

@Injectable()
export class WeChatNotifyParserUtil {
    constructor(
        @Inject(PayAddonConfigProvider) protected readonly payAddonConfig: PayAddonConfig,
        @Inject(XmlUtil) private readonly xmlUtil: XmlUtil,
        @Inject(WeChatSignUtil) private readonly signUtil: WeChatSignUtil
    ) { }

    /**
     * 解析微信支付结果通知参数，会进行验签，验签失败时，返回 undefined
     *
     * @param params 支付结果通知参数
     */
    public async parsePayNotify(params: any): Promise<WeChatPayBaseNotifyRes> {
        const secretKey = this.payAddonConfig.wechatConfig.secretKey;
        const signType = this.payAddonConfig.wechatConfig.sign_type;
        const result = await this.xmlUtil.parseObjFromXml<WeChatPayBaseNotifyRes>(params);
        if (result.sign && result.sign !== this.signUtil.sign(result, secretKey, signType)) {
            // 支付结果通知验签失败时，返回 undefined
            return undefined;
        }
        return result;
    }
}