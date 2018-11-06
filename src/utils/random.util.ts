import { Injectable } from '@nestjs/common';
import * as chance from 'chance';

@Injectable()
export class RandomUtil {
    /**
     * 生成32位随机字符串
     */
    genRandomStr() {
        return chance().string({ length: 32 });
    }
}