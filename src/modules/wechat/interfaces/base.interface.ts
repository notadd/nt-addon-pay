/** 微信支付接口基础返回结果 */
export interface WechatBaseResponse {
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