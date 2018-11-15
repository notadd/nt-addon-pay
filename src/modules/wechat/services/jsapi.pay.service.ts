import { Injectable } from '@nestjs/common';

import { WechatOtherPayOrderReqParam, WechatOtherPayOrderRes } from '../interfaces/order.interface';
import { WechatPayBaseService } from './base.service';

/**
 * 微信支付-JSAPI支付类
 */
@Injectable()
export class WechatJSAPIPayService extends WechatPayBaseService {
    /**
     * JSAPI支付
     *
     * @param params JSAPI支付接口请求参数
     */
    async pay(params: WechatOtherPayOrderReqParam): Promise<WechatOtherPayOrderRes> {
        return await this.requestUtil.post<WechatOtherPayOrderRes>(this.unifiedOrderUrl, params);
    }
}