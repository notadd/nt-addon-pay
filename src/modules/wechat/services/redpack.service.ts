import { Injectable } from '@nestjs/common';

import { WeChatRedpackReqParam, WeChatRedpackRes } from '../interfaces/redpack.interface';
import { WeChatPayBaseService } from './base.service';

/**
 * 微信支付-现金红包支付类
 */
@Injectable()
export class WeChatRedpackService extends WeChatPayBaseService {
    private readonly redpackApiBase = 'https://api.mch.weixin.qq.com' + (this.config.sandbox ? '/sandboxnew' : '') + '/mmpaymkttransfers';
    private readonly sendredpackUrl = `${this.redpackApiBase}/sendredpack`;
    private readonly sendgroupredpackUrl = `${this.redpackApiBase}/sendgroupredpack`;
    private readonly gethbinfoUrl = `${this.redpackApiBase}/gethbinfo`;

    /**
     * 发放普通红包
     *
     * @param params 发放普通红包请求参数
     */
    async sendRedpack(params: WeChatRedpackReqParam): Promise<WeChatRedpackRes> {
        return await this.requestUtil.post<WeChatRedpackRes>(this.sendredpackUrl, params, { httpsAgent: this.certificateAgent });
    }
}