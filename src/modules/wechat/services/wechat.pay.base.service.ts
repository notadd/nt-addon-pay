import { Inject, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { Agent } from 'https';
import { join } from 'path';

import { PayAddonConfig, PayAddonConfigProvider } from '../../../common';
import {
    WechatBaseCloseOrderReqParam,
    WechatBaseCloseOrderRes,
    WechatBaseQueryOrderReqParam,
    WechatBaseQueryOrderRes,
} from '../interfaces/order.interface';
import {
    WechatBaseQueryRefundReqParam,
    WechatBaseQueryRefundRes,
    WechatBaseRefundReqParam,
    WechatBaseRefundRes,
} from '../interfaces/refund.interface';
import { WechatRequestUtil } from '../utils/request.util';

@Injectable()
export class WechatPayBaseService {
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
        @Inject(WechatRequestUtil) protected readonly requestUtil: WechatRequestUtil
    ) { }

    /**
     * 查询订单
     *
     * @param params 查询订单请求参数
     */
    public async queryOrder(params: WechatBaseQueryOrderReqParam): Promise<WechatBaseQueryOrderRes> {
        if (!params.out_trade_no && !params.transaction_id) throw new Error('参数有误，out_trade_no 和 transaction_id 二选一');
        this.checkOverrideDefaultSignType(params);
        return await this.requestUtil.post<WechatBaseQueryOrderRes>(this.queryOrderUrl, params);
    }

    /**
     * 关闭订单
     *
     * @param params 关闭订单请求参数
     */
    public async closeOrder(params: WechatBaseCloseOrderReqParam): Promise<WechatBaseCloseOrderRes> {
        this.checkOverrideDefaultSignType(params);
        return await this.requestUtil.post<WechatBaseCloseOrderRes>(this.closeOrderUrl, params);
    }

    /**
     * 申请退款
     *
     * @param params 申请退款请求参数
     */
    public async refund(params: WechatBaseRefundReqParam): Promise<WechatBaseRefundRes> {
        if (!params.out_trade_no && !params.transaction_id) throw new Error('参数有误，out_trade_no 和 transaction_id 二选一');
        this.checkOverrideDefaultSignType(params);
        const httpsAgent = this.createCertificateAgent();
        return await this.requestUtil.post<WechatBaseRefundRes>(this.refundUrl, params, { httpsAgent });
    }

    /**
     * 查询退款
     *
     * @param params 查询退款请求参数
     */
    public async queryRefund(params: WechatBaseQueryRefundReqParam): Promise<WechatBaseQueryRefundRes> {
        if (!params.out_trade_no && !params.transaction_id && !params.out_refund_no && !params.refund_id) {
            throw new Error('参数有误，out_trade_no、transaction_id、out_refund_no 和 refund_id 四选一');
        }
        return await this.requestUtil.post<WechatBaseQueryRefundRes>(this.queryOrderUrl, params);
    }

    /**
     * 创建请求证书代理
     *
     * 此 agent 仅用于申请退款、撤销订单和下载资金账单接口
     */
    protected createCertificateAgent(): Agent {
        return new Agent({
            pfx: readFileSync(join(__dirname, '../../../../certificate/keep_me_security.p12')),
            passphrase: this.payAddonConfig.wechatConfig.mch_id
        });
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