import { HttpModule, Module } from '@nestjs/common';

import { RandomUtil } from './utils/random.util';
import { XmlUtil } from './utils/xml.util';

@Module({
    imports: [HttpModule],
    providers: [XmlUtil, RandomUtil],
    exports: [HttpModule, RandomUtil, XmlUtil]
})
export class SharedModule { }