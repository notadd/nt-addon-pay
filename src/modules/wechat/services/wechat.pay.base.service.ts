import { Inject, Injectable } from '@nestjs/common';

import { PayAddonConfig, PayAddonConfigProvider } from '../../../common';
import {
    WechatBaseCloseOrderReqParam,
    WechatBaseCloseOrderRes,
    WechatBaseQueryOrderReqParam,
    WechatBaseQueryOrderRes,
} from '../interfaces/order.interface';
import { WechatRequestUtil } from '../utils/request.util';


@Injectable()
export class WechatPayBaseService {
    /** API 接口域名 */
    private apiBase = 'https://api.mch.weixin.qq.com' + (this.payAddonConfig.wechatConfig.sandbox ? '/sandboxnew' : '');
    /** 统一下单接口地址 */
    protected readonly unifiedOrderUrl = `${this.apiBase}/pay/unifiedorder`;
    /** 查询订单接口地址 */
    protected readonly queryOrderUrl = `${this.apiBase}/pay/orderquery`;
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

    /**
     * 查询订单
     *
     * @param params 查询订单请求参数
     */
    protected async queryOrder(params: WechatBaseQueryOrderReqParam): Promise<WechatBaseQueryOrderRes> {
        this.checkOverrideDefaultSignType(params);
        return await this.requestUtil.post<WechatBaseQueryOrderRes>(this.queryOrderUrl, params);
    }

    /**
     * 关闭订单
     *
     * @param params 关闭订单请求参数
     */
    protected async closeOrder(params: WechatBaseCloseOrderReqParam): Promise<WechatBaseCloseOrderRes> {
        this.checkOverrideDefaultSignType(params);
        return await this.requestUtil.post<WechatBaseCloseOrderRes>(this.closeOrderUrl, params);
    }

    /**
     * 检查是否覆盖默认的签名类型
     */
    private checkOverrideDefaultSignType(params: any) {
        const signType = this.payAddonConfig.wechatConfig.sign_type;
        if (signType) {
            (params as any).sign_type = signType;
        }
    }
}