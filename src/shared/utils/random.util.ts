import { Injectable } from '@nestjs/common';
import * as chance from 'chance';

/**
 * 随机数工具
 */
@Injectable()
export class RandomUtil {
    /**
     * 生成32位随机字符串
     */
    genRandomStr() {
        return chance().string({ length: 32, pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' });
    }
}