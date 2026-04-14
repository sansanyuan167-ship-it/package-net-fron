
##  页面hs-login-popup组件说明

|  属性				|	说明								|	类型		|	默认值				|
|-------------------|-----------------------------------|-----------|-----------------------|
title				|	标题								|	String	|	温馨提示				|
content				|	内容								|	String	|	确认执行该操作吗？		|
leftButtonText		|	左边按钮文字						|	String	|	取消					|
rightButtonText		|	右边按钮文字						|	String	|	去登录		  		|
maskClosable		|	点击遮罩层是否关闭					|	Boolean	|	true				|


## 示例

```html
用法：
<com-login-popup ref="loginPopup" @onCancel="$refs['loginPopup'].hide()" @onConfirm="confirm" />
this.$refs['loginPopup'].show();
```


```js
//用法：
this.$refs['loginPopup'].show();
```