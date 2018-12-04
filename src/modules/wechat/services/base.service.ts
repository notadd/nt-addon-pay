import { Inject, Injectable } from '@nestjs/common';
import * as https from 'https';

import { PayAddonConfig, PayAddonConfigProvider } from '../../../common';
import { WeChatCertificateAgentProvider } from '../constants/wechat.constant';
import {
    WeChatBaseCloseOrderReqParam,
    WeChatBaseCloseOrderRes,
    WeChatBaseQueryOrderReqParam,
    WeChatBaseQueryOrderRes
} from '../interfaces/order.interface';
import {
    WeChatBaseQueryRefundReqParam,
    WeChatBaseQueryRefundRes,
    WeChatBaseRefundReqParam,
    WeChatBaseRefundRes
} from '../interfaces/refund.interface';
import { WeChatRequestUtil } from '../utils/request.util';

/**
 * 微信支付
 */
@Injectable()
export class WeChatPayBaseService {
    /** API 接口域名 */
    protected apiBase = 'https://api.mch.weixin.qq.com' + (this.payAddonConfig.wechatConfig.sandbox ? '/sandboxnew' : '');
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
        @Inject(PayAddonConfigProvider) protected readonly payAddonConfig: PayAddonConfig,
        @Inject(WeChatCertificateAgentProvider) protected readonly certificateAgent: https.Agent,
        @Inject(WeChatRequestUtil) protected readonly requestUtil: WeChatRequestUtil
    ) { }

    /**
     * 查询订单
     *
     * @param params 查询订单请求参数
     */
    public async queryOrder(params: WeChatBaseQueryOrderReqParam): Promise<WeChatBaseQueryOrderRes> {
        if (!params.out_trade_no && !params.transaction_id) throw new Error('参数有误，out_trade_no 和 transaction_id 二选一');
        this.checkOverrideDefaultSignType(params);
        return await this.requestUtil.post<WeChatBaseQueryOrderRes>(this.queryOrderUrl, params);
    }

    /**
     * 关闭订单
     *
     * @param params 关闭订单请求参数
     */
    public async closeOrder(params: WeChatBaseCloseOrderReqParam): Promise<WeChatBaseCloseOrderRes> {
        this.checkOverrideDefaultSignType(params);
        return await this.requestUtil.post<WeChatBaseCloseOrderRes>(this.closeOrderUrl, params);
    }

    /**
     * 申请退款
     *
     * @param params 申请退款请求参数
     */
    public async refund(params: WeChatBaseRefundReqParam): Promise<WeChatBaseRefundRes> {
        if (!params.out_trade_no && !params.transaction_id) throw new Error('参数有误，out_trade_no 和 transaction_id 二选一');
        this.checkOverrideDefaultSignType(params);
        return await this.requestUtil.post<WeChatBaseRefundRes>(this.refundUrl, params, { httpsAgent: this.certificateAgent });
    }

    /**
     * 查询退款
     *
     * @param params 查询退款请求参数
     */
    public async queryRefund(params: WeChatBaseQueryRefundReqParam): Promise<WeChatBaseQueryRefundRes> {
        if (!params.out_trade_no && !params.transaction_id && !params.out_refund_no && !params.refund_id) {
            throw new Error('参数有误，out_trade_no、transaction_id、out_refund_no 和 refund_id 四选一');
        }
        return await this.requestUtil.post<WeChatBaseQueryRefundRes>(this.refundQueryUrl, params);
    }

    /**
     * 检查是否覆盖默认的签名类型
     */
    protected checkOverrideDefaultSignType(params: any) {
        const signType = this.payAddonConfig.wechatConfig.sign_type;
        if (signType) {
            (params as any).sign_type = signType;
        }
    }
}