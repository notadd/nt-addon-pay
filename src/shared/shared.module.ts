import { Module } from '@nestjs/common';

import { RandomUtil } from './utils/random.util';
import { XmlUtil } from './utils/xml.util';

@Module({
    imports: [],
    providers: [RandomUtil, XmlUtil],
    exports: [RandomUtil, XmlUtil]
})
export class SharedModule { }