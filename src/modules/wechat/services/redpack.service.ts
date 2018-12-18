import { Inject, Injectable } from '@nestjs/common';
import * as https from 'https';

import { WeChatPayConfig } from '../../../common';
import { WeChatPayCertificateAgentProvider, WeChatPayConfigProvider } from '../constants/wechat.constant';
import {
    WeChatQueryRedpackRecordReqParam,
    WeChatQueryRedpackRecordRes,
    WeChatRedpackReqParam,
    WeChatRedpackRes
} from '../interfaces/redpack.interface';
import { WeChatRequestUtil } from '../utils/request.util';

/**
 * 微信支付-现金红包支付类
 */
@Injectable()
export class WeChatRedpackService {
    /** API 接口域名 */
    private readonly redpackApiBase = 'https://api.mch.weixin.qq.com';
    /** 发放普通红包接口地址 */
    private readonly sendredpackUrl = `${this.redpackApiBase}/sendredpack`;
    /** 发放裂变红包接口地址 */
    private readonly sendgroupredpackUrl = `${this.redpackApiBase}/sendgroupredpack`;
    /** 查询红包记录接口地址 */
    private readonly gethbinfoUrl = `${this.redpackApiBase}/gethbinfo`;

    constructor(
        @Inject(WeChatPayConfigProvider) private readonly config: WeChatPayConfig,
        @Inject(WeChatPayCertificateAgentProvider) private readonly certificateAgent: https.Agent,
        @Inject(WeChatRequestUtil) private readonly requestUtil: WeChatRequestUtil
    ) { }

    /**
     * 发放普通红包
     *
     * @param params 发放普通红包请求参数
     */
    async sendRedpack(params: WeChatRedpackReqParam): Promise<WeChatRedpackRes> {
        (params as any).wxappid = this.config.appid;
        (params as any).sign_type = 'no_sign_type';
        return await this.requestUtil.post<WeChatRedpackRes>(this.sendredpackUrl, params, { httpsAgent: this.certificateAgent });
    }

    /**
     * 发放裂变红包
     *
     * @param params 发放裂变红包请求参数
     */
    async sendGroupRedpack(params: WeChatRedpackReqParam): Promise<WeChatRedpackRes> {
        (params as any).wxappid = this.config.appid;
        (params as any).amt_type = 'ALL_RAND';
        (params as any).sign_type = 'no_sign_type';
        return await this.requestUtil.post<WeChatRedpackRes>(this.sendgroupredpackUrl, params, { httpsAgent: this.certificateAgent });
    }

    /**
     * 查询红包记录
     *
     * @param params 查询红包记录请求参数
     */
    async queryRedpackRecord(params: WeChatQueryRedpackRecordReqParam): Promise<WeChatQueryRedpackRecordRes> {
        (params as any).bill_type = 'MCHT';
        (params as any).sign_type = 'no_sign_type';
        return await this.requestUtil.post<WeChatQueryRedpackRecordRes>(this.gethbinfoUrl, params, { httpsAgent: this.certificateAgent });
    }
}