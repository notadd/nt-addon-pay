import { Inject, Injectable } from '@nestjs/common';
import * as https from 'https';

import { PayAddonConfig, PayAddonConfigProvider } from '../../../common';
import { XmlUtil } from '../../../shared/utils/xml.util';
import { WechatCertificateAgentProvider } from '../constants/wechat.constant';
import {
    WechatBaseCloseOrderReqParam,
    WechatBaseCloseOrderRes,
    WechatBaseQueryOrderReqParam,
    WechatBaseQueryOrderRes,
} from '../interfaces/order.interface';
import { WechatPayBaseNotifyRes } from '../interfaces/pay-notify.interface';
import {
    WechatBaseQueryRefundReqParam,
    WechatBaseQueryRefundRes,
    WechatBaseRefundReqParam,
    WechatBaseRefundRes,
} from '../interfaces/refund.interface';
import { WechatRequestUtil } from '../utils/request.util';
import { WechatSignUtil } from '../utils/sign.util';

/**
 * 微信支付
 */
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
        @Inject(WechatCertificateAgentProvider) protected readonly certificateAgent: https.Agent,
        @Inject(WechatRequestUtil) protected readonly requestUtil: WechatRequestUtil,
        @Inject(XmlUtil) private readonly xmlUtil: XmlUtil,
        @Inject(WechatSignUtil) private readonly signUtil: WechatSignUtil
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
        return await this.requestUtil.post<WechatBaseRefundRes>(this.refundUrl, params, { httpsAgent: this.certificateAgent });
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
     * 解析支付结果通知的请求体
     *
     * 支付结果通知验签失败时，返回 undefined
     *
     * @param body 请求体
     */
    public async parseWechatPayNotify(body: any): Promise<WechatPayBaseNotifyRes> {
        const secretKey = this.payAddonConfig.wechatConfig.secretKey;
        const signType = this.payAddonConfig.wechatConfig.sign_type;
        const result = await this.xmlUtil.parseObjFromXml<WechatPayBaseNotifyRes>(body);
        if (result.sign && result.sign !== this.signUtil.sign(result, secretKey, signType)) {
            // 支付结果通知验签失败时，返回 undefined
            return undefined;
        }
        return result;
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