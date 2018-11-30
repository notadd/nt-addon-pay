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
            pfx: fs.readFileSync('path_to_p12_file'),   // p12文件
            sandbox: true   // 是否启用沙箱环境，默认不启用
        }
    })
  ]
})
export class ApplicationModule {}
```

### 使用 WeChat`XXX`PayService

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
            spbill_create_ip: '127.0.0.1',
            notify_url: 'your.domain.com/wechat-pay/notify',
            trade_type: WeChatTradeType.JSAPI
        });
    }
}
```

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
- [ ] **0.4.0** 支付宝-APP支付
- [ ] **0.5.0** 支付宝-当面付
- [ ] **0.6.0** 支付宝-手机网站支付
- [ ] **0.7.0** 支付宝-电脑网站支付
- [ ] **1.0.0** 完善使用说明、发布正式版v1.0.0