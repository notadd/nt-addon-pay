import { WeChatBaseResponse } from './base.interface';

/** 微信支付申请退款接口基础请求参数 */
export interface WeChatBaseRefundReqParam {
    /** 微信订单号，优先级高于商户订单号 */
    transaction_id?: string;
    /** 商户订单号 */
    out_trade_no?: string;
    /** 商户退款单号 */
    out_refund_no: string;
    /** 订单金额 */
    total_fee: number;
    /** 退款金额 */
    refund_fee: number;
    /** 退款原因 */
    refund_desc?: string;
    /**
     * 退款资金来源
     *
     * 仅针对老资金流商户使用
     *
     * REFUND_SOURCE_UNSETTLED_FUNDS---未结算资金退款（默认使用未结算资金退款）
     *
     * REFUND_SOURCE_RECHARGE_FUNDS---可用余额退款
     */
    refund_account?: 'REFUND_SOURCE_UNSETTLED_FUNDS' | 'REFUND_SOURCE_RECHARGE_FUNDS';
    /** 退款结果通知url */
    notify_url?: string;
}

/** 微信支付申请退款接口基础返回结果 */
export interface WeChatBaseRefundRes extends WeChatBaseResponse {
    /** 微信订单号 */
    transaction_id: string;
    /** 商户订单号 */
    out_trade_no: string;
    /** 商户退款单号 */
    out_refund_no: string;
    /** 微信退款单号 */
    refund_id: string;
    /** 订单金额 */
    total_fee: number;
    /** 退款金额 */
    refund_fee: number;
    /** 应结退款金额 */
    settlement_refund_fee?: number;
    /** 应结订单金额 */
    settlement_total_fee?: number;
    /*** 货币类型，默认人民币：CNY */
    fee_type?: string;
    /** 现金支付金额，单位为分 */
    cash_fee: number;
    /** 现金支付币种 */
    cash_fee_type?: string;
    /** 现金退款金额，单位为分 */
    cash_refund_fee?: number;
    /** 代金券退款总金额 */
    coupon_refund_fee?: number;
    /** 退款代金券使用数量 */
    coupon_refund_count?: number;
}

/** 微信支付查询退款接口基础请求参数 */
export interface WeChatBaseQueryRefundReqParam {
    /** 微信退款单号，优先级1 */
    refund_id?: string;
    /** 商户退款单号，优先级2 */
    out_refund_no?: string;
    /** 微信订单号，优先级3 */
    transaction_id?: string;
    /** 商户订单号，优先级4 */
    out_trade_no?: string;
    /**
     * 偏移量
     *
     * 当部分退款次数超过10次时可使用，表示返回的查询结果从这个偏移量开始取记录
     */
    offset?: number;
}

/** 微信支付查询退款接口基础返回结果 */
export interface WeChatBaseQueryRefundRes extends WeChatBaseResponse {
    /** 微信订单号 */
    transaction_id: string;
    /** 商户订单号 */
    out_trade_no: string;
    /** 订单金额 */
    total_fee: number;
    /** 订单总退款次数 */
    total_refund_count?: number;
    /*** 货币类型，默认人民币：CNY */
    fee_type?: string;
    /** 现金支付金额，单位为分 */
    cash_fee: number;
    /** 现金支付币种 */
    cash_fee_type?: string;
    /** 应结订单金额 */
    settlement_total_fee?: number;
    /** 退款笔数 */
    refund_count: number;
}