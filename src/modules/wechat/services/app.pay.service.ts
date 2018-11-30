import { Injectable } from '@nestjs/common';

import { WeChatAppPayOrderReqParam, WeChatAppPayOrderRes } from '../interfaces/order.interface';
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
}