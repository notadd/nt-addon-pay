import { Test } from '@nestjs/testing';

import { WechatTradeType } from '../../src/modules/wechat/interfaces/order.interface';
import { WechatPayAppService } from '../../src/modules/wechat/services/wechat.pay.app.service';
import { PayAddon } from '../../src/pay.addon';

describe('WechatPayAppService', () => {
    let wechatPayAppService: WechatPayAppService;

    beforeEach(async () => {
        const testModule = await Test.createTestingModule({
            imports: [PayAddon.forRoot({
                wechatConfig: {
                    appid: 'appid',
                    mch_id: 'mch_id',
                    secretKey: 'secretKey',
                    sandbox: true
                }
            })]
        }).compile();
        await testModule.init();
        wechatPayAppService = testModule.get<WechatPayAppService>(WechatPayAppService);
    });

    describe('appPay', () => {
        it('should return success', async () => {
            const res = await wechatPayAppService.appPay({
                body: '测试APP支付',
                out_trade_no: '201811011926123',
                total_fee: 301,
                spbill_create_ip: '127.0.0.1',
                notify_url: '127.0.0.1',
                trade_type: WechatTradeType.APP
            });
            expect(res.return_code).toBe('SUCCESS');
        });

        it('should return fail', async () => {
            const res = await wechatPayAppService.appPay({
                body: '测试APP支付',
                out_trade_no: '201811011926123',
                total_fee: 0.1,
                spbill_create_ip: '127.0.0.1',
                notify_url: '127.0.0.1',
                trade_type: WechatTradeType.APP
            });
            expect(res.return_code).toBe('FAIL');
        });
    });
});