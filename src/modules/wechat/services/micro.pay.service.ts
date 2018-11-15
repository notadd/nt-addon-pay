import { Injectable } from '@nestjs/common';

import {
    WechatMicroPayOrderReqParam,
    WechatMicroPayOrderRes,
    WechatMicroPayReverseOrderReqParam,
    WechatMicroPayReverseOrderRes,
} from '../interfaces/order.interface';
import { WechatPayBaseService } from './base.service';

/**
 * 微信支付-付款码支付类
 */
@Injectable()
export class WechatMicroPayService extends WechatPayBaseService {
    /**
     * 付款码支付
     */
    async pay(params: WechatMicroPayOrderReqParam) {
        const url = `${this.apiBase}/pay/micropay`;
        return await this.requestUtil.post<WechatMicroPayOrderRes>(url, params);
    }

    /**
     * 撤销订单
     *
     * @param params 撤销订单接口请求参数
     */
    async closeOrder(params: WechatMicroPayReverseOrderReqParam): Promise<WechatMicroPayReverseOrderRes> {
        const url = `${this.apiBase}/pay/reverse`;
        this.checkOverrideDefaultSignType(params);
        return await this.requestUtil.post<WechatMicroPayReverseOrderRes>(url, params, { httpsAgent: this.certificateAgent });
    }
}