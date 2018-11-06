export interface PayAddonConfig {
    appid: string;
    /** 商户号 */
    mch_id: string;
    /** 秘钥 */
    secretKey: string;
    /** 沙箱环境，默认false */
    sandbox?: boolean;
}