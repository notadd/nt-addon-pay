import { Injectable } from '@nestjs/common';

import { WeChatOtherPayOrderReqParam, WeChatOtherPayOrderRes } from '../interfaces/order.interface';
import { WeChatPayBaseService } from './base.service';

/**
 * 微信支付-小程序支付类
 */
@Injectable()
export class WeChatAppletPayService extends WeChatPayBaseService {
    /**
     * 小程序支付
     *
     * @param params 小程序支付接口请求参数
     */
    async pay(params: WeChatOtherPayOrderReqParam): Promise<WeChatOtherPayOrderRes> {
        return await this.requestUtil.post<WeChatOtherPayOrderRes>(this.unifiedOrderUrl, params);
    }
}