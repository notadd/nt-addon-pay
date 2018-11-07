import { DynamicModule, HttpModule, Inject, Module, OnModuleInit } from '@nestjs/common';

import { PayAddonConfig, PayAddonConfigProvider } from './common';
import { AliPayModule } from './modules/ali/ali.pay.module';
import { WechatPayModule } from './modules/wechat/wechat.pay.module';

@Module({
    imports: [HttpModule, WechatPayModule, AliPayModule],
    providers: [],
    exports: []
})
export class PayAddon implements OnModuleInit {
    constructor(
        @Inject(PayAddonConfigProvider) private readonly payAddonConfig: PayAddonConfig
    ) { }

    static forRoot(config: PayAddonConfig): DynamicModule {
        return {
            module: PayAddon,
            providers: [{ provide: PayAddonConfigProvider, useValue: config }],
            exports: []
        };
    }

    async onModuleInit() {
        const wechatConfig = this.payAddonConfig.wechatConfig;
        const aliConfig = this.payAddonConfig.aliConfig;
        if (!wechatConfig && !aliConfig) {
            throw Error('请至少指定一种支付方式的配置');
        }
    }
}