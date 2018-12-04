import { Injectable } from '@nestjs/common';

import { WeChatOtherPayOrderReqParam, WeChatOtherPayOrderRes } from '../interfaces/order.interface';
import { WeChatPayBaseService } from './base.service';

/**
 * 微信支付-Native支付类
 */
@Injectable()
export class WeChatNativePayService extends WeChatPayBaseService {
    /**
     * 扫码支付
     *
     * @param params 扫码支付接口请求参数
     */
    async pay(params: WeChatOtherPayOrderReqParam): Promise<WeChatOtherPayOrderRes> {
        return await this.requestUtil.post<WeChatOtherPayOrderRes>(this.unifiedOrderUrl, params);
    }
}