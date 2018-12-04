import { Injectable } from '@nestjs/common';

import { WeChatOtherPayOrderReqParam, WeChatOtherPayOrderRes } from '../interfaces/order.interface';
import { WeChatPayBaseService } from './base.service';

/**
 * 微信支付-JSAPI支付类
 */
@Injectable()
export class WeChatJSAPIPayService extends WeChatPayBaseService {
    /**
     * JSAPI支付
     *
     * @param params JSAPI支付接口请求参数
     */
    async pay(params: WeChatOtherPayOrderReqParam): Promise<WeChatOtherPayOrderRes> {
        return await this.requestUtil.post<WeChatOtherPayOrderRes>(this.unifiedOrderUrl, params);
    }
}