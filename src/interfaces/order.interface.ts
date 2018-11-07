/** 微信支付下单接口基础输入参数 */
interface BaseOrderRequestParam {
    /** 设备号 */
    device_info?: string;
    /** 商户订单号 */
    out_trade_no: string;
    /** 商品描述 */
    body: string;
    /** 商品详情 */
    detail?: string;
    /** 附加数据 */
    attach?: string;
    /** 订单金额，单位为分，只能为整数 */
    total_fee: number;
    /** 货币类型，默认人民币：CNY */
    fee_type?: string;
    /** 指定支付方式 */
    limit_pay?: string;
    /** 终端IP */
    spbill_create_ip: string;
    /** 订单优惠标记 */
    goods_tag?: string;
    /** 交易起始时间 */
    time_start?: string;
    /** 交易结束时间 */
    time_expire?: string;
    /** 场景信息 */
    scene_info?: string;
}

/** 交易类型 */
export enum TradeType {
    /** 公众号、小程序支付 */
    JSAPI = 'JSAPI',
    /** 扫码支付 */
    NATIVE = 'NATIVE',
    /** APP支付 */
    APP = 'APP',
    /** H5支付 */
    MWEB = 'MWEB',
}

/** 刷卡支付下单接口输入参数 */
export interface SwipePayOrderReqParam extends BaseOrderRequestParam {
    /** 授权码 */
    auth_code: string;
}

/** APP支付下单接口输入参数 */
export interface AppPayOrderReqParam extends BaseOrderRequestParam {
    /** 交易类型 */
    trade_type: TradeType;
    /** 通知地址 */
    notify_url: string;
}

/** 扫码支付、公众号支付、H5支付、小程序支付下单接口输入参数 */
export interface OtherPayOrderReqParam extends AppPayOrderReqParam {
    /** 商品ID，交易类型为NATIVE(扫码支付)时必传 */
    product_id?: string;
    /** 用户标识 */
    openid?: string;
}

/** 微信支付下单接口基础返回结果 */
interface BaseOrderResponse {
    /** 返回状态码 */
    return_code: string;
    /** 返回信息 */
    return_msg: string;
    /** 公众账号APPID或应用APPID */
    appid: string;
    /** 商户号 */
    mch_id: string;
    /** 设备号 */
    device_info?: string;
    /** 随机字符串 */
    nonce_str: string;
    /** 签名 */
    sign: string;
    /** 业务结果 */
    result_code: string;
    /** 错误代码 */
    err_code?: string;
    /** 错误代码描述 */
    err_code_des?: string;
}

/** 刷卡支付下单接口返回结果 */
export interface SwipePayOrderRes extends BaseOrderResponse {
    /** 用户标识 */
    openid: string;
    /** 是否关注公众账号 */
    is_subscribe: string;
    /** 交易类型 */
    trade_type: string;
    /** 付款银行 */
    bank_typ: string;
    /** 货币类型，默认人民币：CNY */
    fee_type?: string;
    /** 订单金额，单位为分 */
    total_fee: number;
    /** 应结订单金额 */
    settlement_total_fee?: number;
    /** 代金券金额 */
    coupon_fee?: number;
    /** 现金支付货币类型，默认人民币：CNY */
    cash_fee_type?: number;
    /** 现金支付金额 */
    cash_fee: number;
    /** 微信支付订单号 */
    transaction_id: string;
    /** 商户订单号 */
    out_trade_no: string;
    /** 商家数据包(请求时的附加数据) */
    attach?: string;
    /** 支付完成时间 */
    time_end: string;
    /** 营销详情 */
    promotion_detail?: string;
}

/** APP支付下单接口返回结果 */
export interface AppPayOrderRes extends BaseOrderResponse {
    /** 交易类型 */
    trade_type: string;
    /** 预支付交易会话标识 */
    prepay_id: string;
}

/** H5支付下单接口返回结果 */
export interface H5PayOrderRs extends AppPayOrderRes {
    /** 支付跳转链接，有效期为5分钟 */
    mweb_url: string;
}

/** 扫码支付、公众号支付、小程序支付下单接口返回结果 */
export interface OtherPayOrderRes extends AppPayOrderRes {
    /** 二维码连接 */
    code_url?: string;
}