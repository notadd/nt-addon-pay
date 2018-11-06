/** 微信支付下单接口基础输入参数 */
interface BaseOrderRequestParam {
    /** 公众号ID */
    appid: string;
    /** 商户号 */
    mch_id: string;
    /** 设备号 */
    device_info?: string;
    /** 商户订单号 */
    out_trade_no: string;
    /** 随机字符串 */
    nonce_str?: string;
    /** 签名 */
    sign?: string;
    /** 签名类型 */
    sign_type?: string;
    /** 商品描述 */
    body: string;
    /** 商品详情 */
    detail?: string;
    /** 附加数据 */
    attach?: string;
    /** 订单金额 */
    total_fee: number;
    /** 货币类型 */
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