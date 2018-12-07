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
        const wechatConfig = this.config;
        params.appid = wechatConfig.appid;
        params.mch_id = wechatConfig.mch_id;
        params.nonce_str = this.randomUtil.genRandomStr();
        params.sign = this.signUtil.sign(params, wechatConfig.secretKey, wechatConfig.sign_type);
        try {
            const { data } = await this.httpService.post<T>(url, this.xmlUtil.convertObjToXml(params), config).toPromise();
            if ((data as any).return_code === 'SUCCESS') {
                if (params.sign !== (data as any).sign) throw new Error('微信支付接口返回签名有误');
            }
            return this.xmlUtil.parseObjFromXml<T>(data);
        } catch (error) {
            throw new Error('微信支付请求接口时出现网络异常：' + error.toString());
        }
    }
}