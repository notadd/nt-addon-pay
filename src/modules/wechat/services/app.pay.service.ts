import { Injectable } from '@nestjs/common';

import {
    WeChatAppPayOrderReqParam,
    WeChatAppPayOrderRes,
    WeChatBaseCloseOrderReqParam,
    WeChatBaseCloseOrderRes,
    WeChatBaseQueryOrderReqParam,
    WeChatBaseQueryOrderRes
} from '../interfaces/order.interface';
import { WeChatBaseQueryRefundReqParam, WeChatBaseQueryRefundRes } from '../interfaces/refund.interface';
import { WeChatPayBaseService } from './base.service';

/**
 * 微信支付-APP支付类
 */
@Injectable()
export class WeChatAppPayService extends WeChatPayBaseService {
    /**
     * APP支付
     *
     * @param params APP支付请求参数
     */
    async pay(params: WeChatAppPayOrderReqParam): Promise<WeChatAppPayOrderRes> {
        return await this.requestUtil.post<WeChatAppPayOrderRes>(this.unifiedOrderUrl, params);
    }

    /**
     * APP查询订单
     *
     * @param params APP查询订单请求参数
     */
    async queryOrder(params: WeChatBaseQueryOrderReqParam): Promise<WeChatBaseQueryOrderRes> {
        (params as any).sign_type = 'no_sign_type';
        return await super.queryOrder(params);
    }

    /**
     * APP关闭订单
     *
     * @param params APP关闭订单请求参数
     */
    async closeOrder(params: WeChatBaseCloseOrderReqParam): Promise<WeChatBaseCloseOrderRes> {
        (params as any).sign_type = 'no_sign_type';
        return await super.closeOrder(params);
    }

    /**
     * APP查询退款
     *
     * @param params APP查询退款请求参数
     */
    async queryRefund(params: WeChatBaseQueryRefundReqParam): Promise<WeChatBaseQueryRefundRes> {
        (params as any).sign_type = 'no_sign_type';
        return await super.queryRefund(params);
    }
}