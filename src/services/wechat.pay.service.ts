import { Injectable } from '@nestjs/common';

@Injectable()
export class WechatPayService {
    /** API 接口域名 */
    private readonly apiBase = 'https://api.mch.weixin.qq.com';
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

    constructor() { }
}