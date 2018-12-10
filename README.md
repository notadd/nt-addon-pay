# Notadd 支付插件

整合微信支付API、支付宝支付API，基于 Nest.js 框架构建的一个支付插件。

## 使用说明

### 安装

`npm install @notadd/addon-pay`

### 配置 PayAddon

```typescript
import { Module } from '@nestjs/common';
import { PayAddon } from '@notadd/addon-pay';

@Module({
  imports: [
    PayAddon.forRoot({
        wechatConfig: {
            appid: 'appid',     // 公众号appi/应用appid/小程序appid
            mch_id: 'mch_id',   // 商户号
            secretKey: 'secretKey', // 商户交易秘钥
            sign_type: 'MD5',       // 微信支付签名类型('MD5' | 'HMAC-SHA256')，默认MD5，配置后，所有接口参数均会使用这个签名类型
            pfx: fs.readFileSync('path_to_p12_file'),   // p12文件
            sandbox: true   // 是否启用沙箱环境，默认不启用，用于商户支付验收测试
        }
    })
  ]
})
export class ApplicationModule {}
```

### 微信支付

接口使用前的必要声明：

1. 所有的接口请求参数和接口返回结果中的属性名全部使用的是 **`snake_case`**，其中属性名结尾带 **`?`** 的代表这个属性是可选的(非必填)。
2. 所有与金额相关的数据全部是 **`number`** 类型且单位为 **`分`**，需自行转换。
3. 所有接口参数中的 `mch_id`、`appid/wxappid`、`nonce_str`、`sign_type`、`sign` 数据均由插件自动填入，无需手动传入。
4. 所有请求的返回结果若有 `sign`，插件会自动验签。
5. 支付通知结果插件会自动验签，退款通知结果插件会自动解密 `req_info` 数据。

#### 使用 WeChat`XXX`PayService 调用 API

WeChat`XXX`PayService 类包含当前支付方式的支付、订单、退款相关 API，各支付类说明：

- WeChatAppPayService —— APP支付
- WeChatAppletPayService —— 小程序支付
- WeChatJSAPIPayService —— JSAPI支付（用户通过微信扫码、关注公众号等方式进入商家H5页面，并在微信内调用JSSDK完成支付）
- WeChatMicroPayService —— 付款码支付（用户打开微信钱包-付款码的界面，商户扫码后提交完成支付）
- WeChatNativePayService —— Native支付（扫码支付）
- WeChatWapPayService —— H5支付（用户在微信以外的手机浏览器请求微信支付的场景唤起微信支付）
- WeChatRedpackService —— 现金红包

例子：Native支付（扫码支付）调用方式如下

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { WeChatNativePayService, WeChatTradeType } from '@notadd/addon-pay';

@Injectable()
export class TestPay {
    constructor(@Inject(WeChatNativePayService) private readonly weChatNativePayService: WeChatNativePayService) { }

    async nativePay() {
        const ressult = await this.weChatNativePayService.pay({
            body: '支付一下',
            out_trade_no: '201811271512000001',
            total_fee: 301,
            spbill_create_ip: '127.0.0.1',  // 支付请求方IP
            notify_url: 'your.domain.com/payment/wechat_order_notify',  // 服务端支付通知地址
            trade_type: WeChatTradeType.JSAPI
        });
    }
}
```

#### 使用 WeChatNotifyParserUtil 解析支付/退款通知

```typescript
import { Controller, Inject, Post, Req } from '@nestjs/common';

import { WeChatNotifyParserUtil } from '@notadd/addon-pay';

@Controller('payment')
export class PaymentNotifyController {
    constructor(
        @Inject(WeChatNotifyParserUtil) private readonly weChatNotifyParserUtil: WeChatNotifyParserUtil
    ) { }

    /**
     * 微信支付统一下单通知路由
     *
     * @param req 通知请求
     */
    @Post('wechat_order_notify')
    async weChatOrderNotify(@Req() req) {
        // 当 data 为 undefined 时，表示通知请求中的 sign 验签失败
        const data = await this.weChatNotifyParserUtil.parsePayNotify(req);

        // 失败时返回
        if (!data) {
            const errMsg = '验签失败';  // 可根据业务自定定义错误信息
            return this.weChatNotifyParserUtil.generateFailMessage(errMsg);
        }

        // 成功时返回
        return this.weChatNotifyParserUtil.generateSuccessMessage();
    }

    /**
     * 微信支付退款通知路由
     *
     * @param req 通知请求
     */
    @Post('wechat_refund_notify')
    async weChatRefundNotify(@Req() req) {
        // 当 data 为 undefined 时，表示通知请求中的 req_info 解密失败
        const data = await this.weChatNotifyParserUtil.parseRefundNotify(req);

        // 失败时返回
        if (!data) {
            const errMsg = '解密失败';  // 可根据业务自定定义错误信息
            return this.weChatNotifyParserUtil.generateFailMessage(errMsg);
        }

        // 成功时返回
        return this.weChatNotifyParserUtil.generateSuccessMessage();
    }
}
```

#### 如何使用支付验收 case ？

两种方式，如下：

1. 关注微信公众号：微信支付商户接入验收助手，并查阅相应支付验收 case 示例。
2. 下载支付验收case示例 pdf 文档。地址：[免充值产品测试验收用例](https://pay.weixin.qq.com/wiki/doc/api/download/mczyscsyl.pdf) 。

## 贡献说明

我们欢迎 Nest.js 使用者来参与这个插件的开发，作为一个贡献者，请您遵循以下原则：

- 代码提交规范，参考 [Git Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#)
- 始终从 develop checkout 一个新分支，命名规范为 feature/xxx，xxx 必须具有可读性，如：微信-普通商户版-扫码支付 => feature/wechat-native-pay
- 在 checkout 新分支前，先在本地 develop 分支拉取远程 develop 分支的最新代码
- 文件命名规则请参考项目目前的命名规则，如：微信支付中，order.interface.ts 代表所有订单相关的请求参数和返回结果的定义，swipe.pay.service.ts 代表付款码支付的业务逻辑

## 功能开发

请先查阅 Roadmap，确保你想贡献的功能没有正在被实现。然后在 **issue** 里提交一个贡献请求，注明想要贡献的功能。

## 发现 Bug ？

如果你在源码中发现bug，请你先在本仓库的 **issue** 提交一个bug问题。在你提交完bug问题后，我们很乐意接受你提交一个 **PR** 来帮助我们修复这个bug。

## QQ 交流群

322247106，请注明加群目的！

## Roadmap

- [x] **0.0.1** 贡献说明
- [x] **0.1.0** 微信-普通商户版-APP支付
- [x] **0.2.0** 微信-普通商户版-JSAPI支付、微信-普通商户版-Native支付、微信-普通商户版-H5支付、微信-普通商户版-小程序支付
- [x] **0.3.0** 微信-普通商户版-付款码支付
- [x] **0.4.0** 微信-普通商户版-现金红包
- [ ] **0.5.0** 微信-普通商户版-企业付款
- [ ] **0.6.0** 支付宝-APP支付
- [ ] **0.7.0** 支付宝-当面付
- [ ] **0.8.0** 支付宝-手机网站支付
- [ ] **0.9.0** 支付宝-电脑网站支付
- [ ] **1.0.0** 完善使用说明、发布正式版v1.0.0