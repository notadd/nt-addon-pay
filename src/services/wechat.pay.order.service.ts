import { Injectable } from '@nestjs/common';

import { SwipePayOrderReqParam, SwipePayOrderRes } from '../interfaces/order.interface';
import { WechatPayBaseService } from './wechat.pay.base.service';

@Injectable()
export class WechatPayOrderService extends WechatPayBaseService {
    /**
     * 刷卡支付
     */
    async swipePay(params: SwipePayOrderReqParam) {
        const url = 'https://api.mch.weixin.qq.com/pay/micropay';
        return await this.requestUtil.post<SwipePayOrderRes>(url, params);
    }
}