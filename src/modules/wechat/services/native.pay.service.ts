import { Injectable } from '@nestjs/common';

import { WechatOtherPayOrderReqParam, WechatOtherPayOrderRes } from '../interfaces/order.interface';
import { WechatPayBaseService } from './base.service';

/**
 * 微信支付-Native支付
 */
@Injectable()
export class WechatNativePayService extends WechatPayBaseService {
    /**
     * 扫码支付
     *
     * @param params 扫码支付接口请求参数
     */
    async pay(params: WechatOtherPayOrderReqParam): Promise<WechatOtherPayOrderRes> {
        return await this.requestUtil.post<WechatOtherPayOrderRes>(this.unifiedOrderUrl, params);
    }
}