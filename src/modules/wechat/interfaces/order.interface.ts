import { WechatBaseResponse } from './base.interface';

/** 微信支付下单接口基础请求参数 */
interface WechatBaseOrderRequestParam {
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
    /** 指定支付方式 */
    limit_pay?: string;
    /** 终端IP */
    spbill_create_ip: string;
    /** 订单优惠标记 */
    goods_tag?: string;
    /** 交易起始时间 */
    time_start?: string;
    /** 交易结束时间，建议：最短失效时间间隔大于1分钟 */
    time_expire?: string;
    /** 场景信息 */
    scene_info?: string;
}

/** 微信支付交易类型 */
export enum WechatTradeType {
    /** JSAPI、小程序支付 */
    JSAPI = 'JSAPI',
    /** 扫码支付 */
    NATIVE = 'NATIVE',
    /** APP支付 */
    APP = 'APP',
    /** H5支付 */
    MWEB = 'MWEB',
}

/** 微信刷卡支付下单接口请求参数 */
export interface WechatSwipePayOrderReqParam extends WechatBaseOrderRequestParam {
    /** 授权码 */
    auth_code: string;
}

/** 微信APP支付下单接口请求参数 */
export interface WechatAppPayOrderReqParam extends WechatBaseOrderRequestParam {
    /** 交易类型 */
    trade_type: WechatTradeType;
    /** 通知地址 */
    notify_url: string;
}

/** 微信扫码支付、JSAPI支付、H5支付、小程序支付下单接口请求参数 */
export interface WechatOtherPayOrderReqParam extends WechatAppPayOrderReqParam {
    /** 商品ID，交易类型为NATIVE(扫码支付)时必传 */
    product_id?: string;
    /** 用户标识 */
    openid?: string;
}

/** 微信刷卡支付下单接口返回结果 */
export interface WechatSwipePayOrderRes extends WechatBaseResponse {
    /** 用户标识 */
    openid: string;
    /** 是否关注公众账号，Y-关注，N-未关注 */
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
    /** 现金支付金额，单位为分 */
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

/** 微信APP支付下单接口返回结果 */
export interface WechatAppPayOrderRes extends WechatBaseResponse {
    /** 交易类型 */
    trade_type: string;
    /** 预支付交易会话标识 */
    prepay_id: string;
}

/** 微信H5支付下单接口返回结果 */
export interface WechatWapPayOrderRes extends WechatAppPayOrderRes {
    /** 支付跳转链接，有效期为5分钟 */
    mweb_url: string;
}

/** 微信扫码支付、JSAPI支付、小程序支付下单接口返回结果 */
export interface WechatOtherPayOrderRes extends WechatAppPayOrderRes {
    /** 二维码连接 */
    code_url?: string;
}

/** 微信支付查询订单接口基础请求参数 */
export interface WechatBaseQueryOrderReqParam {
    /** 微信订单号，优先使用 */
    transaction_id?: string;
    /** 商户订单号 */
    out_trade_no?: string;
}

/** 微信支付查询订单接口基础返回结果 */
export interface WechatBaseQueryOrderRes extends WechatBaseResponse {
    /** 设备号 */
    device_info?: string;
    /** 用户标识 */
    openid: string;
    /** 是否关注公众账号，Y-关注，N-未关注 */
    is_subscribe: string;
    /** 交易类型 */
    trade_type: string;
    /** 交易状态 */
    trade_state: string;
    /** 付款银行 */
    bank_type: string;
    /** 总金额 */
    total_fee: string;
    /** 应结订单金额 */
    settlement_total_fee?: string;
    /** 标价币种，默认人民币：CNY */
    fee_type?: string;
    /** 现金支付金额，单位为分 */
    cash_fee: string;
    /** 现金支付币种 */
    cash_fee_type?: string;
    /** 代金券金额 */
    coupon_fee?: string;
    /** 代金券使用数量 */
    coupon_count?: string;
    /** 微信支付订单号 */
    transaction_id: string;
    /** 商户订单号 */
    out_trade_no: string;
    /** 附加数据 */
    attach?: string;
    /** 支付完成时间 */
    time_end: string;
    /** 交易状态描述 */
    trade_state_desc: string;
}

/** 微信支付关闭订单接口基础请求参数 */
export interface WechatBaseCloseOrderReqParam {
    /** 商户订单号 */
    out_trade_no: string;
}

/** 微信支付关闭订单接口基础返回结果 */
export interface WechatBaseCloseOrderRes extends WechatBaseResponse { }