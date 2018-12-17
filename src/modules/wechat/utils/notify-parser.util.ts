import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { IncomingMessage } from 'http';

import { WeChatPayConfig } from '../../../common';
import { XmlUtil } from '../../../shared/utils/xml.util';
import { WeChatPayConfigProvider } from '../constants/wechat.constant';
import { WeChatPayNotifyRes, WeChatRefundNotifyRes } from '../interfaces/notify.interface';
import { WeChatSignUtil } from './sign.util';

/**
 * 微信支付通知解析工具
 */
@Injectable()
export class WeChatNotifyParserUtil {
    constructor(
        @Inject(WeChatPayConfigProvider) protected readonly config: WeChatPayConfig,
        @Inject(XmlUtil) private readonly xmlUtil: XmlUtil,
        @Inject(WeChatSignUtil) private readonly signUtil: WeChatSignUtil
    ) { }

    /**
     * 解析微信支付结果通知请求参数，会进行验签，验签失败时，返回 undefined
     *
     * @param req 支付结果通知请求
     */
    public async parsePayNotify(req: IncomingMessage): Promise<WeChatPayNotifyRes> {
        const data = await this.receiveReqData(req, 'pay');

        const secretKey = this.config.secretKey;
        const signType = this.config.sign_type;
        const result = await this.xmlUtil.parseObjFromXml<WeChatPayNotifyRes>(data);

        if (result.return_code === 'FAIL') {
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
        const data = await this.receiveReqData(req, 'refund');
        const result = await this.xmlUtil.parseObjFromXml<WeChatRefundNotifyRes>(data);

        if (result.return_code === 'FAIL') {
            return result;
        }
        if (!(result as any).req_info) {
            return undefined;
        }
        try {
            const secretKey = this.config.secretKey;
            const cryptedBase64Str = Buffer.from((result as any).req_info).toString('base64');
            const secretKeyMD5 = crypto.createHash('md5').update(secretKey).digest('hex').toLocaleLowerCase();

            const decipher = crypto.createDecipheriv('aes-256-ecb', secretKeyMD5, '');
            const decryptedStr = Buffer.concat([decipher.update(cryptedBase64Str, 'base64'), decipher.final()]).toString();

            Object.assign(result, JSON.parse(decryptedStr));
        } catch (error) {
            return undefined;
        }
        return result;
    }

    /**
     * 生成通知成功返回值
     */
    public generateSuccessMessage() {
        return this.xmlUtil.convertObjToXml({
            return_code: 'SUCCESS',
            return_msg: 'OK'
        });
    }

    /**
     * 生成通知失败返回值
     *
     * @param errMsg 失败原因
     */
    public generateFailMessage(errMsg: string) {
        return this.xmlUtil.convertObjToXml({
            return_code: 'FAIL',
            return_msg: errMsg
        });
    }

    /**
     * 接收回调通知请求中的 xml 数据
     *
     * @param req 回调通知请求
     */
    private async receiveReqData(req: IncomingMessage, type: 'pay' | 'refund') {
        const errType = type === 'pay' ? '支付' : '退款';
        let xmlStr: string;
        try {
            xmlStr = await new Promise<string>((resolve, reject) => {
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
        } catch (error) {
            throw new Error(`解析微信${errType}结果通知发生网络异常: ${error.toString()}`);
        }
        if (xmlStr.trim().length === 0) {
            throw new Error(`解析微信${errType}结果通知异常: 数据为空`);
        }
        return xmlStr;
    }
}