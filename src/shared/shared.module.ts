import { DynamicModule, Global, HttpModule, Module } from '@nestjs/common';

import { PayAddonConfig, PayAddonConfigProvider } from '../common';
import { RandomUtil } from './utils/random.util';
import { XmlUtil } from './utils/xml.util';

@Global()
@Module({})
export class SharedModule {
    static forFeature(config: PayAddonConfig): DynamicModule {
        return {
            module: SharedModule,
            imports: [HttpModule],
            providers: [XmlUtil, RandomUtil, { provide: PayAddonConfigProvider, useValue: config }],
            exports: [HttpModule, RandomUtil, XmlUtil, PayAddonConfigProvider]
        };
    }
}