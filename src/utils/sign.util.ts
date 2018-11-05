import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class SignUtil {
    /**
     * 计算微信支付签名
     *
     * @param params 参数
     * @param secretKey 秘钥
     * @param hashType 签名方式(选填)，默认md5
     */
    async wechatSign(params: {}, secretKey: string, hashType?: 'md5' | 'sha256') {
        let temp = '';
        const sortedKeys = Object.keys(params).sort();
        for (const key of sortedKeys) {
            params[key] && (temp += `${key}&${params[key]}`);
        }
        if (hashType && hashType === 'sha256') {
            return crypto.createHmac('sha256', secretKey).update(temp).digest('hex').toUpperCase();
        }
        return crypto.createHash('md5').update(temp += `&key=${secretKey}`).digest('hex').toUpperCase();
    }
}