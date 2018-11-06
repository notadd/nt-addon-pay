import { HttpService, Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { PayAddonConfigProvider } from '../constants/addon.constant';
import { PayAddonConfig } from '../interfaces/addon.config.interface';
import { SandboxResponse } from '../interfaces/sandbox.interface';
import { RandomUtil } from '../utils/random.util';
import { SignUtil } from '../utils/sign.util';
import { XmlUtil } from '../utils/xml.util';

@Injectable()
export class WechatPayService implements OnModuleInit {
    /** API 接口域名 */
    private apiBase = 'https://api.mch.weixin.qq.com';
    /** 统一下单接口地址 */
    protected readonly unifiedOrderUrl = `${this.apiBase}/pay/unifiedorder`;
    /** 查询订单接口地址 */
    protected readonly orderQueryUrl = `${this.apiBase}/pay/orderquery`;
    /** 关闭订单接口地址 */
    protected readonly closeOrderUrl = `${this.apiBase}/pay/closeorder`;
    /** 申请退款接口地址 */
    protected readonly refundUrl = `${this.apiBase}/secapi/pay/refund`;
    /** 查询退款接口地址 */
    protected readonly refundQueryUrl = `${this.apiBase}/pay/refundquery`;
    /** 下载对账单接口地址 */
    protected readonly downloadBillUrl = `${this.apiBase}/pay/downloadbill`;
    /** 下载资金账单接口地址 */
    protected readonly downloadFundFlowUrl = `${this.apiBase}/pay/downloadfundflow`;
    /** 沙箱环境获取验签秘钥接口地址 */
    protected readonly sandboxGetSignKeyUrl = 'https://api.mch.weixin.qq.com/sandboxnew/pay/getsignkey';

    constructor(
        @Inject(HttpService) protected readonly httpService: HttpService,
        @Inject(PayAddonConfigProvider) protected readonly payAddonConfig: PayAddonConfig,
        @Inject(XmlUtil) protected readonly xmlUtil: XmlUtil,
        @Inject(SignUtil) protected readonly signUtil: SignUtil,
        @Inject(RandomUtil) protected readonly randomUtil: RandomUtil
    ) {
        this.payAddonConfig.sandbox && (this.apiBase += '/sandbox');
    }

    async onModuleInit() {
        const data = await this.getSandboxSignKey();
        if (data.return_code === 'FAIL') {
            throw new Error(data.retmsg);
        }
        this.payAddonConfig.secretKey = data.sandbox_signkey;
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
        const { data } = await this.httpService.post<SandboxResponse>(this.sandboxGetSignKeyUrl, this.xmlUtil.convertObjToXml(params)).toPromise();
        return await this.xmlUtil.parseObjFromXml<SandboxResponse>(data);
    }
}