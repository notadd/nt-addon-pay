import { HttpService, Inject, Injectable } from '@nestjs/common';
import * as axios from 'axios';

import { WeChatPayConfig } from '../../../common';
import { RandomUtil } from '../../../shared/utils/random.util';
import { XmlUtil } from '../../../shared/utils/xml.util';
import { WeChatPayConfigProvider } from '../constants/wechat.constant';
import { WeChatSignUtil } from './sign.util';

/**
 * 微信支付接口请求工具
 */
@Injectable()
export class WeChatRequestUtil {
    constructor(
        @Inject(HttpService) private readonly httpService: HttpService,
        @Inject(WeChatPayConfigProvider) private readonly config: WeChatPayConfig,
        @Inject(XmlUtil) private readonly xmlUtil: XmlUtil,
        @Inject(WeChatSignUtil) private readonly signUtil: WeChatSignUtil,
        @Inject(RandomUtil) private readonly randomUtil: RandomUtil
    ) { }

    /**
     * 微信支付POST请求
     *
     * @param url 请求地址
     * @param params 请求参数
     * @param config AxiosRequestConfig
     */
    async post<T>(url: string, params: any, config?: axios.AxiosRequestConfig): Promise<T> {
        // 用于处理现金红包、企业付款、获取RSA公钥接口请求参数(属性不一致或不存在)
        if (params.wxappid) {
        } else if (params.mch_appid) {
        } else {
            params.appid = this.config.appid;
        }

        // 用于处理企业付款接口请求参数(属性不一致或不存在)
        if (!params.mchid) {
            params.mch_id = this.config.mch_id;
        }

        params.nonce_str = this.randomUtil.genRandomStr();

        let signType: 'MD5' | 'HMAC-SHA256';
        if (params.sign_type && params.sign_type === 'no_sign_type') {
            signType = 'MD5';
            delete params.sign_type;
        } else {
            signType = this.config.sign_type;
            params.sign_type = this.config.sign_type ? this.config.sign_type : 'MD5';
        }

        params.sign = this.signUtil.sign(params, signType);
        try {
            const { data } = await this.httpService.post<T>(url, this.xmlUtil.convertObjToXml(params), config).toPromise();
            if ((data as any).return_code === 'SUCCESS') {
                if (params.sign && params.sign !== (data as any).sign) throw new Error('微信支付接口返回签名有误');
            }
            return this.xmlUtil.parseObjFromXml<T>(data);
        } catch (error) {
            throw new Error('微信支付请求接口时出现网络异常：' + error.toString());
        }
    }

    /**
     * 检查请求参数单号正确性
     *
     * @param params 请求参数
     */
    checkParamNo(params: any) {
        for (const no of ['out_trade_no', 'out_refund_no', 'mch_billno', 'partner_trade_no']) {
            if (Object.keys(params).includes(no)) {
                switch (no) {
                    case 'out_trade_no':
                        this.regexpTest(params, 'out_trade_no', 32, 'special');
                        break;
                    case 'out_refund_no':
                        this.regexpTest(params, 'out_refund_no', 64, 'special');
                        break;
                    case 'mch_billno':
                        this.regexpTest(params, 'mch_billno', 28, 'normal');
                        break;
                    case 'partner_trade_no':
                        this.regexpTest(params, 'partner_trade_no', 32, 'normal');
                        break;
                }
            }
        }
    }

    /**
     * 参数正则匹配校验
     *
     * @param params 参数对象
     * @param propertyName 参数属性名
     * @param maxLength 参数值最大长度
     * @param regexpType 匹配类型
     */
    regexpTest(params: any, propertyName: string, maxLength: number, regexpType: 'normal' | 'special') {
        if (params[propertyName].length > maxLength) {
            throw new Error(`参数 ${propertyName} 长度不能大于 ${maxLength} 个字符`);
        }

        const normalRegexp = new RegExp(/^[A-Za-z0-9]+$/, 'g');
        const specialRegexp = new RegExp(/^[A-Za-z0-9_\-|\*@]+$/, 'g');
        if (regexpType === 'normal') {
            if (!normalRegexp.test(params[propertyName])) {
                throw new Error(`参数 ${propertyName} 只能是字母或者数字`);
            }
        }

        if (regexpType === 'special') {
            if (!specialRegexp.test(params[propertyName])) {
                throw new Error(`参数 ${propertyName} 只能是数字、大小写字母或_-|*@`);
            }
        }
    }
}