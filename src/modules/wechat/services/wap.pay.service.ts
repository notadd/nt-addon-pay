import { Injectable } from '@nestjs/common';

import { WeChatOtherPayOrderReqParam, WeChatOtherPayOrderRes } from '../interfaces/order.interface';
import { WeChatPayBaseService } from './base.service';

/**
 * 微信支付-H5支付类
 */
@Injectable()
export class WeChatWapPayService extends WeChatPayBaseService {
    /**
     * H5支付
     *
     * @param params H5支付接口请求参数
     */
    async pay(params: WeChatOtherPayOrderReqParam): Promise<WeChatOtherPayOrderRes> {
        return await this.requestUtil.post<WeChatOtherPayOrderRes>(this.unifiedOrderUrl, params);
    }
}