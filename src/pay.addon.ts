import { DynamicModule, HttpModule, Module } from '@nestjs/common';

import { PayAddonConfigProvider } from './constants/addon.constant';
import { PayAddonConfig } from './interfaces/addon.config.interface';
import { WechatPayOrderService } from './services/wechat.pay.order.service';
import { WechatPayService } from './services/wechat.pay.service';
import { RandomUtil } from './utils/random.util';
import { SignUtil } from './utils/sign.util';
import { XmlUtil } from './utils/xml.util';

@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [
        WechatPayService,
        WechatPayOrderService,
        XmlUtil,
        SignUtil,
        RandomUtil
    ],
    exports: []
})
export class PayAddon {
    static forRoot(options: PayAddonConfig): DynamicModule {
        return {
            module: PayAddon,
            providers: [{ provide: PayAddonConfigProvider, useValue: options }],
            exports: []
        };
    }
}