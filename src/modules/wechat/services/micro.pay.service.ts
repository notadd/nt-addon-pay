import { Injectable } from '@nestjs/common';

import { WechatSwipePayOrderReqParam, WechatSwipePayOrderRes } from '../interfaces/order.interface';
import { WechatPayBaseService } from './base.service';

/**
 * 微信支付-付款码支付
 */
@Injectable()
export class WechatMicroPayService extends WechatPayBaseService {
    /**
     * 付款码支付
     */
    async pay(params: WechatSwipePayOrderReqParam) {
        const url = 'https://api.mch.weixin.qq.com/pay/micropay';
        return await this.requestUtil.post<WechatSwipePayOrderRes>(url, params);
    }
}