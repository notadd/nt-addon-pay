import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';

import { WeChatPayConfig } from '../../../common';
import { WeChatPayCertificateAgentProvider, WeChatPayConfigProvider } from '../constants/wechat.constant';
import {
    WeChatGetPublicKeyRes,
    WeChatQueryTransferBankReqParam,
    WeChatQueryTransferBankRes,
    WeChatQueryTransferReqParam,
    WeChatQueryTransferRes,
    WeChatTransferBankReqParam,
    WeChatTransferBankRes,
    WeChatTransferReqParam,
    WeChatTransferRes
} from '../interfaces/transfer.interface';
import { WeChatRequestUtil } from '../utils/request.util';

/**
 * 微信支付-企业付款
 */
@Injectable()
export class WeChatTransferService {
    /** API 接口域名 */
    private readonly redpackApiBase = 'https://api.mch.weixin.qq.com' + (this.config.sandbox ? '/sandboxnew' : '');
    /** 企业付款到零钱接口地址 */
    private readonly transferUrl = `${this.redpackApiBase}/mmpaymkttransfers/promotion/transfers`;
    /** 查询企业付款到零钱接口地址 */
    private readonly queryTransferUrl = `${this.redpackApiBase}/mmpaymkttransfers/gettransferinfo`;
    /** 企业付款到银行卡接口地址 */
    private readonly transferBankUrl = `${this.redpackApiBase}/mmpaysptrans/pay_bank`;
    /** 查询企业付款到银行卡接口地址 */
    private readonly queryTransferBankUrl = `${this.redpackApiBase}/mmpaysptrans/query_bank`;
    /** 获取RSA加密公钥接口地址 */
    private readonly getRsaPublicKeyUrl = 'https://fraud.mch.weixin.qq.com/risk/getpublickey';
    /** RSA公钥文件名 */
    private readonly rsaPublicKeyFileName = '.rsa_pub.pem';

    constructor(
        @Inject(WeChatPayConfigProvider) private readonly config: WeChatPayConfig,
        @Inject(WeChatPayCertificateAgentProvider) private readonly certificateAgent: https.Agent,
        @Inject(WeChatRequestUtil) private readonly requestUtil: WeChatRequestUtil
    ) { }

    /**
     * 企业付款到零钱
     *
     * @param params 企业付款到零钱接口请求参数
     */
    async transfer(params: WeChatTransferReqParam): Promise<WeChatTransferRes> {
        (params as any).mchid = this.config.mch_id;
        (params as any).mch_appid = this.config.appid;
        return await this.requestUtil.post<WeChatTransferRes>(this.transferUrl, params, { httpsAgent: this.certificateAgent });
    }

    /**
     * 查询企业付款到零钱
     *
     * @param params 查询企业付款到零钱接口请求参数
     */
    async queryTransfer(params: WeChatQueryTransferReqParam): Promise<WeChatQueryTransferRes> {
        return await this.requestUtil.post<WeChatQueryTransferRes>(this.queryTransferUrl, params, { httpsAgent: this.certificateAgent });
    }

    /**
     * 企业付款到银行卡
     *
     * @param params 企业付款到银行卡接口请求参数
     */
    async transferBank(params: WeChatTransferBankReqParam): Promise<WeChatTransferBankRes> {
        params.enc_bank_no = await this.encryptStr(params.enc_bank_no);
        params.enc_true_name = await this.encryptStr(params.enc_true_name);
        return await this.requestUtil.post<WeChatTransferBankRes>(this.transferBankUrl, params, { httpsAgent: this.certificateAgent });
    }

    /**
     * 查询企业付款到银行卡
     *
     * @param params 查询企业付款到银行卡接口请求参数
     */
    async queryTransferBank(params: WeChatQueryTransferBankReqParam): Promise<WeChatQueryTransferBankRes> {
        return await this.requestUtil.post<WeChatQueryTransferBankRes>(this.queryTransferBankUrl, params, { httpsAgent: this.certificateAgent });
    }

    /**
     * RSA算法加密明文字符串
     *
     * @param str 明文
     */
    private async encryptStr(str: string) {
        const pubKey = await this.getPublicKey();
        return crypto.publicEncrypt(pubKey, Buffer.from(str)).toString('base64');
    }

    /**
     * 获取RSA公钥e
     */
    private async getPublicKey(): Promise<string> {
        const pubKeyFilePath = path.join(__dirname, `../${this.rsaPublicKeyFileName}`);
        if (fs.existsSync(pubKeyFilePath)) {
            return fs.readFileSync(pubKeyFilePath).toString();
        }

        const res = await this.requestUtil.post<WeChatGetPublicKeyRes>(this.getRsaPublicKeyUrl, {}, { httpsAgent: this.certificateAgent });
        if (res.return_code === 'SUCCESS' && res.result_code === 'SUCCESS') {
            if (res.mch_id === this.config.mch_id) {
                fs.writeFileSync(pubKeyFilePath, res.pub_key);
                return res.pub_key;
            } else {
                throw new Error('获取RSA公钥时返回的商户号与配置的商户号不一致');
            }
        } else {
            throw new Error(res.return_code === 'FAIL' ? res.return_msg : res.err_code_des);
        }
    }
}