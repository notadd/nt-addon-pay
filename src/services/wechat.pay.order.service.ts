import { Injectable, OnModuleInit } from '@nestjs/common';

import { SwipePayOrderReqParam } from '../interfaces/order.interface';
import { WechatPayService } from './wechat.pay.service';

@Injectable()
export class WechatPayOrderService extends WechatPayService implements OnModuleInit {
    /**
     * 刷卡支付
     */
    async swipePay(params: SwipePayOrderReqParam) {
        // 待测试
        const url = 'https://api.mch.weixin.qq.com/pay/micropay';
        params.sign = this.signUtil.wechatSign(params, this.payAddonConfig.secretKey);
        params.nonce_str = this.randomUtil.genRandomStr();
        const { data } = await this.httpService.post(url, this.xmlUtil.convertObjToXml(params)).toPromise();
    }
}