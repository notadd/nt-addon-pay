import { Injectable } from '@nestjs/common';

import { WechatSwipePayOrderReqParam, WechatSwipePayOrderRes } from '../interfaces/order.interface';
import { WechatPayBaseService } from './base.service';

@Injectable()
export class WechatSwipePayService extends WechatPayBaseService {
    /**
     * 刷卡支付
     */
    async swipePay(params: WechatSwipePayOrderReqParam) {
        const url = 'https://api.mch.weixin.qq.com/pay/micropay';
        return await this.requestUtil.post<WechatSwipePayOrderRes>(url, params);
    }
}