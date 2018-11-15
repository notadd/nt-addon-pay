import { Injectable } from '@nestjs/common';

import { WechatAppPayOrderReqParam, WechatAppPayOrderRes } from '../interfaces/order.interface';
import { WechatPayBaseService } from './base.service';

/**
 * 微信支付-APP支付类
 */
@Injectable()
export class WechatAppPayService extends WechatPayBaseService {
    /**
     * APP支付
     *
     * @param params APP支付请求参数
     */
    async pay(params: WechatAppPayOrderReqParam): Promise<WechatAppPayOrderRes> {
        return await this.requestUtil.post<WechatAppPayOrderRes>(this.unifiedOrderUrl, params);
    }
}