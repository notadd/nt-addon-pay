import { Test } from '@nestjs/testing';
import * as fs from 'fs';

import { PayAddon, WechatAppletPayService, WechatTradeType } from '../../src';

describe('WechatPayAppletService', () => {
    let wechatAppletPayService: WechatAppletPayService;

    beforeEach(async () => {
        const testModule = await Test.createTestingModule({
            imports: [PayAddon.forRoot({
                wechatConfig: {
                    appid: 'appid',
                    mch_id: 'mch_id',
                    secretKey: 'secretKey',
                    pfx: fs.readFileSync('path_to_p12_file'),
                    sandbox: true
                }
            })]
        }).compile();
        await testModule.init();
        wechatAppletPayService = testModule.get<WechatAppletPayService>(WechatAppletPayService);
    });

    describe('pay', () => {
        it('should return success', async () => {
            const res = await wechatAppletPayService.pay({
                body: '测试小程序支付',
                out_trade_no: '20181115181535',
                total_fee: 301,
                spbill_create_ip: '127.0.0.1',
                notify_url: '127.0.0.1',
                trade_type: WechatTradeType.JSAPI
            });
            expect(res.result_code).toBe('SUCCESS');
        });

        it('should return fail', async () => {
            const res = await wechatAppletPayService.pay({
                body: '测试小程序支付',
                out_trade_no: '20181115181535',
                total_fee: 0.1,
                spbill_create_ip: '127.0.0.1',
                notify_url: '127.0.0.1',
                trade_type: WechatTradeType.JSAPI
            });
            expect(res.return_code).toBe('FAIL');
        });
    });

    describe('queryOrder', () => {
        it('should return success', async () => {
            const res = await wechatAppletPayService.queryOrder({
                out_trade_no: '20181115181535'
            });
            expect(res.result_code).toBe('SUCCESS');
        });

        it('should return fail', async () => {
            const res = await wechatAppletPayService.queryOrder({
                out_trade_no: '20181115181536'
            });
            expect(res.result_code).toBe('FAIL');
        });
    });

    describe('closeOrder', () => {
        it('should return success', async () => {
            const res = await wechatAppletPayService.closeOrder({
                out_trade_no: '20181115181535'
            });
            expect(res.return_code).toBe('SUCCESS');
        });
    });

    describe('refund', () => {
        it('should return success', async () => {
            const res = await wechatAppletPayService.refund({
                out_trade_no: '20181115181535',
                out_refund_no: '20181115181535refund',
                total_fee: 301,
                refund_fee: 1
            });
            expect(res.result_code).toBe('SUCCESS');
        });
    });

    describe('queryRefund', () => {
        it('should return success', async () => {
            const res = await wechatAppletPayService.queryRefund({
                out_trade_no: '20181115181535',
                out_refund_no: '20181115181535refund'
            });
            expect(res.result_code).toBe('SUCCESS');
        });
    });
});