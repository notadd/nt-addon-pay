/** 微信支付结果通知返回值 */
export interface WechatPayBaseNotifyRes {
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