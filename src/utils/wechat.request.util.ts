import { HttpService, Inject, Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';

import { PayAddonConfigProvider } from '../constants/addon.constant';
import { PayAddonConfig } from '../interfaces/addon.config.interface';
import { RandomUtil } from './random.util';
import { SignUtil } from './sign.util';
import { XmlUtil } from './xml.util';

/**
 * 微信支付接口请求工具
 */
@Injectable()
export class WechatRequestUtil {
    constructor(
        @Inject(HttpService) private readonly httpService: HttpService,
        @Inject(PayAddonConfigProvider) protected readonly payAddonConfig: PayAddonConfig,
        @Inject(XmlUtil) protected readonly xmlUtil: XmlUtil,
        @Inject(SignUtil) protected readonly signUtil: SignUtil,
        @Inject(RandomUtil) protected readonly randomUtil: RandomUtil
    ) { }

    /**
     * 微信支付POST请求
     *
     * @param url 请求地址
     * @param params 请求参数
     * @param config AxiosRequestConfig
     */
    async post<T>(url: string, params: any, config?: AxiosRequestConfig): Promise<T> {
        const wechatConfig = this.payAddonConfig.wechatConfig;
        params.appid = wechatConfig.appid;
        params.mch_id = wechatConfig.mch_id;
        params.nonce_str = this.randomUtil.genRandomStr();
        params.sign = this.signUtil.wechatSign(params, wechatConfig.secretKey, wechatConfig.sign_type);
        try {
            const { data } = await this.httpService.post<T>(url, this.xmlUtil.convertObjToXml(params), config).toPromise();
            return this.xmlUtil.parseObjFromXml<T>(data);
        } catch (error) {
            throw new Error('微信支付请求接口时出现网络异常:' + error.toString());
        }
    }
}