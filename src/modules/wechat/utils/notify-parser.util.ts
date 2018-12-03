import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { IncomingMessage } from 'http';

import { PayAddonConfig, PayAddonConfigProvider } from '../../../common';
import { XmlUtil } from '../../../shared/utils/xml.util';
import { WeChatPayNotifyRes, WeChatRefundNotifyRes } from '../interfaces/notify.interface';
import { WeChatSignUtil } from './sign.util';

@Injectable()
export class WeChatNotifyParserUtil {
    constructor(
        @Inject(PayAddonConfigProvider) protected readonly payAddonConfig: PayAddonConfig,
        @Inject(XmlUtil) private readonly xmlUtil: XmlUtil,
        @Inject(WeChatSignUtil) private readonly signUtil: WeChatSignUtil
    ) { }

    /**
     * 解析微信支付结果通知请求参数，会进行验签，验签失败时，返回 undefined
     *
     * @param req 支付结果通知请求
     */
    public async parsePayNotify(req: IncomingMessage): Promise<WeChatPayNotifyRes> {
        const data = await this.receiveReqData(req);
        if (data && (data as string).trim().length === 0) {
            return undefined;
        }

        const secretKey = this.payAddonConfig.wechatConfig.secretKey;
        const signType = this.payAddonConfig.wechatConfig.sign_type;
        const result = await this.xmlUtil.parseObjFromXml<WeChatPayNotifyRes>(data);

        if (result.return_code !== 'SUCCESS') {
            return result;
        }
        if (result.sign && result.sign !== this.signUtil.sign(result, secretKey, signType)) {
            return undefined;
        }

        return result;
    }

    /**
     * 解析微信支付退款结果通知请求参数，自动解密，解密失败时，返回 undefined
     *
     * @param req 退款结果通知请求
     */
    public async parseRefundNotify(req: IncomingMessage): Promise<WeChatRefundNotifyRes> {
        const data = await this.receiveReqData(req);
        if (data && (data as string).trim().length === 0) {
            return undefined;
        }
        const result = await this.xmlUtil.parseObjFromXml<WeChatRefundNotifyRes>(data);

        const secretKey = this.payAddonConfig.wechatConfig.secretKey;
        const cryptedBase64Str = Buffer.from(result.req_info).toString('base64');
        const secretKeyMD5 = crypto.createHash('md5').update(secretKey).digest('hex').toLocaleLowerCase();

        const decipher = crypto.createDecipheriv('aes-256-ecb', secretKeyMD5, '');
        const decryptedStr = Buffer.concat([decipher.update(cryptedBase64Str, 'base64'), decipher.final()]).toString();

        Object.assign(result, JSON.parse(decryptedStr));
        return result;
    }

    /**
     * 接收回调通知请求中的 xml 数据
     *
     * @param req 回调通知请求
     */
    private async receiveReqData(req: IncomingMessage) {
        return new Promise((resolve, reject) => {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                resolve(data);
            });
            req.on('error', error => {
                reject(error);
            });
        });
    }
}