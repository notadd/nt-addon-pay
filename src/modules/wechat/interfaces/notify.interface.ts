/** 微信支付结果通知返回值 */
export interface WeChatPayNotifyRes {
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
    /** 公众账号ID/小程序ID/应用ID */
    appid: string;
    /** 商户号 */
    mch_id: string;
    /** 微信支付订单号 */
    transaction_id: string;
    /** 商户订单号 */
    out_trade_no: string;
    /** 设备号 */
    device_info?: string;
    /** 随机字符串 */
    nonce_str: string;
    /** 签名 */
    sign: string;
    /** 签名类型 */
    sign_type?: string;
    /** 用户标识 */
    openid: string;
    /** 是否关注公众账号 */
    is_subscribe: string;
    /** 交易类型 */
    trade_type: string;
    /** 付款银行 */
    bank_type: string;
    /** 订单金额 */
    total_fee: number;
    /** 应结订单金额 */
    settlement_total_fee?: number;
    /** 货币种类 */
    fee_type?: string;
    /** 现金支付金额 */
    cash_fee: number;
    /** 现金支付货币类型 */
    cash_fee_type?: string;
    /** 总代金券金额 */
    coupon_fee?: number;
    /** 代金券使用数量 */
    coupon_count?: number;
    /** 商家数据包 */
    attach?: string;
    /** 支付完成时间 */
    time_end: string;
}

/** 微信退款结果通知返回值 */
export interface WeChatRefundNotifyRes {
    /** 返回状态码 */
    return_code: string;
    /** 返回信息 */
    return_msg: string;
    /** 公众账号ID */
    appid: string;
    /** 退款的商户号 */
    mdc_id: string;
    /** 随机字符串 */
    nonce_str: string;
    /** 加密信息 */
    req_info: string;
    /** 微信订单号 */
    transaction_id: string;
    /** 商户订单号 */
    out_trade_no: string;
    /** 微信退款单号 */
    refund_id: string;
    /** 商户退款单号 */
    out_refund_no: string;
    /** 订单金额 */
    total_fee: number;
    /** 应结订单金额 */
    settlement_total_fee?: number;
    /** 申请退款金额 */
    refund_fee: number;
    /** 退款金额 */
    settlement_refund_fee: number;
    /** 退款状态 */
    refund_status: string;
    /** 退款成功时间 */
    success_time?: string;
    /** 退款入账账户 */
    refund_recv_account: string;
    /** 退款资金来源 */
    refund_account: string;
    /** 退款发起来源 */
    refund_request_source: string;
}