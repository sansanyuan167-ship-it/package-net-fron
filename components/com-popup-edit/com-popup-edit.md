
##  页面com-popup-edit组件说明

|  属性				|	说明								|	类型			|	默认值				|
|-------------------|-----------------------------------|---------------|-----------------------|
model				|	弹窗位置类型						|	String		|	middle				|
title				|	标题								|	String		|						|
placeholder			|	输入框placeholder				|	String		|	请输入内容			|
leftButtonText		|	左边按钮文字						|	String		|	取消					|
rightButtonText		|	右边按钮文字						|	String		|	确认					|
maskClosable		|	是否显示返回按键					|	Boolean		|	true				|

model说明
middle => 中部
bottom => 底部

## 示例
```html
用法：
<com-popup-edit model="bottom" ref="popupEdit" title="请输入标题" v-model="content" @onCancel="$refs['popupEdit'].hide()" @onConfirm="confirm" />
```


```js
//用法：
this.$refs['popupEdit'].show(params); //params为参数，点击确认后会回传
```