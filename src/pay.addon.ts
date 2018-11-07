import { DynamicModule, Inject, Module, OnModuleInit } from '@nestjs/common';

import { PayAddonConfig, PayAddonConfigProvider } from './common';
import { AliPayModule } from './modules/ali/ali.pay.module';
import { WechatPayModule } from './modules/wechat/wechat.pay.module';
import { SharedModule } from './shared/shared.module';

@Module({})
export class PayAddon implements OnModuleInit {
    constructor(
        @Inject(PayAddonConfigProvider) private readonly payAddonConfig: PayAddonConfig
    ) { }

    static forRoot(config: PayAddonConfig): DynamicModule {
        return {
            module: PayAddon,
            imports: [SharedModule.forFeature(config), WechatPayModule, AliPayModule]
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