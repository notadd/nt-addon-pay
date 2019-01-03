import { Injectable } from '@nestjs/common';
import nanoid from 'nanoid/async/generate';

/**
 * 随机数工具
 */
@Injectable()
export class RandomUtil {
    /**
     * 生成32位随机字符串
     *
     * @param pool 随机字符池，默认：ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789
     *
     * @param length 随机字符长度，默认：32
     */
    async genRandomStr(pool?: string, length?: number): Promise<string> {
        if (pool && !length) {
            return await nanoid(pool, 32);
        }
        if (!pool && length) {
            return await nanoid('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', length);
        }
        if (pool && length) {
            return await nanoid(pool, length);
        }
        return await nanoid('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 32);
    }
}