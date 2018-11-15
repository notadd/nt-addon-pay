import { Injectable } from '@nestjs/common';

import { WechatAppPayOrderReqParam, WechatAppPayOrderRes } from '../interfaces/order.interface';
import { WechatPayBaseService } from './base.service';

@Injectable()
export class WechatAppPayService extends WechatPayBaseService {
    /**
     * APP支付
     *
     * @param params APP支付请求参数
     */
    async appPay(params: WechatAppPayOrderReqParam): Promise<WechatAppPayOrderRes> {
        return await this.requestUtil.post<WechatAppPayOrderRes>(this.unifiedOrderUrl, params);
    }
}