import { DynamicModule, Module } from '@nestjs/common';

import { PayAddonConfig } from './common';
import { AliPayModule } from './modules/ali/ali.pay.module';
import { WeChatPayModule } from './modules/wechat/wechat.pay.module';
import { SharedModule } from './shared/shared.module';

@Module({})
export class PayAddon {
    static forRoot(config: PayAddonConfig): DynamicModule {
        this.checkConfig(config);
        return {
            module: PayAddon,
            imports: [SharedModule, WeChatPayModule.forRoot(config.wechatConfig), AliPayModule],
            exports: [WeChatPayModule, AliPayModule, SharedModule]
        };
    }

    private static checkConfig(config: PayAddonConfig) {
        const wechatConfig = config.wechatConfig;
        const aliConfig = config.aliConfig;
        if (!wechatConfig && !aliConfig) {
            throw Error('请至少指定一种支付方式的配置');
        }
    }
}
