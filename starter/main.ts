import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';

import { PayAddon } from '../src/pay.addon';

async function bootstrap() {
    const app = await NestFactory.create(PayAddon.forRoot({
        wechatConfig: {
            appid: 'appid',
            mch_id: 'mch_id',
            secretKey: 'secretKey',
            pfx: fs.readFileSync('path_to_p12_file'),
            sandbox: true
        }
    }));
    await app.listen(3000);
}

bootstrap();