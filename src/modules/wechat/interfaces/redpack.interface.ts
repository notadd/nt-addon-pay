/** 微信支付发放普通红包接口请求参数 */
export interface WeChatRedpackReqParam {
    /** 商户订单号 */
    mch_billno: string;
    /** 商户名称 */
    send_name: string;
    /** 用户openid */
    re_openid: string;
    /** 付款金额 */
    total_amount: number;
    /** 红包发放总人数 */
    total_num: number;
    /** 红包祝福语 */
    wishing: string;
    /** ip地址 */
    client_ip: string;
    /** 活动名称 */
    act_name: string;
    /** 备注 */
    remark: string;
    /**
     * 场景id
     *
     * 发放红包使用场景，红包金额大于200或者小于1元时必传
     *
     * PRODUCT_1:商品促销
     *
     * PRODUCT_2:抽奖
     *
     * PRODUCT_3:虚拟物品兑奖
     *
     * PRODUCT_4:企业内部福利
     *
     * PRODUCT_5:渠道分润
     *
     * PRODUCT_6:保险回馈
     *
     * PRODUCT_7:彩票派奖
     *
     * PRODUCT_8:税务刮奖
     */
    scene_id?: string;
    /** 活动信息 */
    rish_info?: string;
    /** 资金授权商户号 */
    consume_mch_id?: string;
}

/** 微信支付发放普通红包接口返回结果 */
export interface WeChatRedpackRes {
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
    /** 商户订单号 */
    mch_billno: string;
    /** 商户号 */
    mch_id: string;
    /** 公众账号APPID */
    wxappid: string;
    /** 用户openid */
    re_openid: string;
    /** 付款金额 */
    total_amount: string;
    /** 微信单号 */
    send_listid: string;
}