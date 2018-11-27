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