export interface WechatSandboxResponse {
    /** 返回状态码 */
    return_code: string;
    /** 返回信息 */
    return_msg?: string;
    /** 返回信息 */
    retmsg?: string;
    /** 沙箱秘钥 */
    sandbox_signkey: string;
}