import { HttpService, Inject, Injectable } from '@nestjs/common';

import { PayAddonConfigProvider } from '../constants/addon.constant';
import { PayAddonConfig } from '../interfaces/addon.config.interface';
import { RandomUtil } from '../utils/random.util';
import { SignUtil } from '../utils/sign.util';
import { XmlUtil } from '../utils/xml.util';

@Injectable()
export class WechatPayService {
    /** API 接口域名 */
    private apiBase = 'https://api.mch.weixin.qq.com';
    /** 统一下单接口地址 */
    private readonly unifiedOrderUrl = `${this.apiBase}/pay/unifiedorder`;
    /** 查询订单接口地址 */
    private readonly orderQueryUrl = `${this.apiBase}/pay/orderquery`;
    /** 关闭订单接口地址 */
    private readonly closeOrderUrl = `${this.apiBase}/pay/closeorder`;
    /** 申请退款接口地址 */
    private readonly refundUrl = `${this.apiBase}/secapi/pay/refund`;
    /** 查询退款接口地址 */
    private readonly refundQueryUrl = `${this.apiBase}/pay/refundquery`;
    /** 下载对账单接口地址 */
    private readonly downloadBillUrl = `${this.apiBase}/pay/downloadbill`;
    /** 下载资金账单接口地址 */
    private readonly downloadFundFlowUrl = `${this.apiBase}/pay/downloadfundflow`;
    /** 沙箱环境获取验签秘钥接口地址 */
    private readonly sandboxGetSignKeyUrl = 'https://api.mch.weixin.qq.com/sandboxnew/pay/getsignkey';

    constructor(
        @Inject(HttpService) private readonly httpService: HttpService,
        @Inject(PayAddonConfigProvider) private readonly payAddonConfig: PayAddonConfig,
        @Inject(XmlUtil) private readonly xmlUtil: XmlUtil,
        @Inject(SignUtil) private readonly signUtil: SignUtil,
        @Inject(RandomUtil) private readonly randomUtil: RandomUtil
    ) {
        this.payAddonConfig.sandbox && (this.apiBase += '/sandbox');
        // 缓存沙箱秘钥 sandbox_signkey
        this.getSandboxSignKey();
    }

    /**
     * 获取沙箱秘钥
     */
    private async getSandboxSignKey() {
        const params: any = {
            mch_id: this.payAddonConfig.mch_id,
            nonce_str: this.randomUtil.genRandomStr(),
            sign: ''
        };
        params.sign = await this.signUtil.wechatSign(params, this.payAddonConfig.secretKey);
        const { data } = await this.httpService.post(this.sandboxGetSignKeyUrl, this.xmlUtil.convertObjToXml(params)).toPromise();
        return await this.xmlUtil.parseObjFromXml(data);
    }
}