import { Inject, Injectable } from '@nestjs/common';

import { PayAddonConfigProvider } from '../constants/addon.constant';
import { PayAddonConfig } from '../interfaces/addon.config.interface';
import { WechatRequestUtil } from '../utils/wechat.request.util';

@Injectable()
export class WechatPayBaseService {
    /** API 接口域名 */
    private apiBase = 'https://api.mch.weixin.qq.com' + (this.payAddonConfig.wechatConfig.sandbox ? '/sandboxnew' : '');
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

    constructor(
        @Inject(PayAddonConfigProvider) private readonly payAddonConfig: PayAddonConfig,
        @Inject(WechatRequestUtil) protected readonly requestUtil: WechatRequestUtil
    ) { }
}