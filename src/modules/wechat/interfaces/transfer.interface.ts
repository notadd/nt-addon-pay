/** 微信支付企业付款到零钱接口请求参数 */
export interface WeChatTransferReqParam {
    /** 设备号 */
    device_info?: string;
    /** 商户订单号 */
    partner_trade_no: string;
    /** 用户openid */
    openid: string;
    /**
     * 校验用户名选项
     *
     * NO_CHECK：不校验真实姓名
     *
     * FORCE_CHECK：强校验真实姓名
     */
    check_name: 'NO_CHECK' | 'FORCE_CHECK';
    /**
     * 收款用户姓名
     *
     * 如果 check_name 设置为 FORCE_CHECK，则必填用户真实姓名
     */
    re_user_name?: string;
    /** 金额 */
    amount: number;
    /** 企业付款备注 */
    desc: string;
    /** ip地址 */
    spbill_create_ip: string;
}

/** 微信支付企业付款到零钱接口返回结果 */
export interface WeChatTransferRes {
    /** 返回状态码 */
    return_code: string;
    /** 返回信息 */
    return_msg: string;
    /** 业务结果 */
    result_code: string;
    /** 错误代码 */
    err_code?: string;
    /** 错误代码描述 */
    err_code_des?: string;
    /** 商户号 */
    mchid: string;
    /** 公众账号APPID */
    mch_appid: string;
    /** 设备号 */
    device_info?: string;
    /** 随机字符串 */
    nonce_str: string;
    /** 商户订单号 */
    partner_trade_no: string;
    /** 微信付款单号 */
    payment_no: string;
    /** 付款成功时间 */
    payment_time: string;
}

/** 微信支付查询企业付款到零钱接口请求参数 */
export interface WeChatQueryTransferReqParam {
    /** 商户订单号 */
    partner_trade_no: string;
}

/** 微信支付查询企业付款到零钱接口返回结果 */
export interface WeChatQueryTransferRes {
    /** 返回状态码 */
    return_code: string;
    /** 返回信息 */
    return_msg: string;
    /** 业务结果 */
    result_code: string;
    /** 错误代码 */
    err_code?: string;
    /** 错误代码描述 */
    err_code_des?: string;
    /** 商户订单号 */
    partner_trade_no: string;
    /** 公众账号APPID */
    appid: string;
    /** 商户号 */
    mch_id: string;
    /** 付款单号 */
    detail_id: string;
    /** 转账状态 */
    status: string;
    /** 失败原因 */
    reason?: string;
    /** 收款用户openid */
    openid: string;
    /** 收款用户姓名 */
    transfer_name: string;
    /** 转账时间 */
    transfer_time: string;
    /** 付款成功时间 */
    payment_time: string;
    /** 企业付款备注 */
    desc: string;
}

/** 微信支付企业付款到银行卡接口请求参数 */
export interface WeChatTransferBankReqParam {
    /** 商户企业付款单号 */
    partner_trade_no: string;
    /** 收款方银行卡号 */
    enc_bank_no: string;
    /** 收款方用户名 */
    enc_true_name: string;
    /** 收款方开户行，银行卡所在开户行编号,详见银行编号列表（https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=24_4） */
    bank_code: string;
    /** 付款金额 */
    amount: number;
    /** 付款说明 */
    desc?: string;
}

/** 微信支付企业付款到银行卡接口返回结果 */
export interface WeChatTransferBankRes {
    /** 返回状态码 */
    return_code: string;
    /** 返回信息 */
    return_msg: string;
    /** 业务结果 */
    result_code: string;
    /** 错误代码 */
    err_code?: string;
    /** 错误代码描述 */
    err_code_des?: string;
    /** 商户号 */
    mch_id: string;
    /** 商户企业付款单号 */
    partner_trade_no: string;
    /** 代付金额 */
    amount: number;
    /** 随机字符串 */
    nonce_str: string;
    /** 签名 */
    sign: string;
    /** 微信企业付款单号 */
    payment_no: string;
    /** 手续费金额 */
    cmms_amt: number;
}

/** 微信支付查询企业付款到银行卡接口请求参数 */
export interface WeChatQueryTransferBankReqParam {
    /** 商户企业付款单号 */
    partner_trade_no: string;
}

/** 微信支付查询企业付款到银行卡接口返回结果 */
export interface WeChatQueryTransferBankRes {
    /** 返回状态码 */
    return_code: string;
    /** 返回信息 */
    return_msg: string;
    /** 业务结果 */
    result_code: string;
    /** 错误代码 */
    err_code?: string;
    /** 错误代码描述 */
    err_code_des?: string;
    /** 商户号 */
    mch_id: string;
    /** 商户企业付款单号 */
    partner_trade_no: string;
    /** 微信企业付款单号 */
    payment_no: string;
    /** 银行卡号(md5加密) */
    bank_no_md5: string;
    /** 用户真实姓名(md5加密) */
    true_name_md5: string;
    /** 代付金额 */
    amount: number;
    /** 代付单状态 */
    status: string;
    /** 手续费金额 */
    cmms_amt: number;
    /** 商户下单时间 */
    create_time: string;
    /** 成功付款时间 */
    pay_succ_time?: string;
    /** 失败原因 */
    reason?: string;
}

/** 微信支付获取RSA加密公钥接口返回结果 */
export interface WeChatGetPublicKeyRes {
    /** 返回状态码 */
    return_code: string;
    /** 返回信息 */
    return_msg: string;
    /** 业务结果 */
    result_code: string;
    /** 错误代码 */
    err_code?: string;
    /** 错误代码描述 */
    err_code_des?: string;
    /** 商户号 */
    mch_id: string;
    /** RSA公钥 */
    pub_key: string;
}