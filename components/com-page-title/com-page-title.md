
##  页面com-page-title组件说明

|  属性				|	说明								|	类型			|	默认值				|
|-------------------|-----------------------------------|---------------|-----------------------|
title				|	标题								|	String		|	""					|
color				|	导航栏文字颜色					|	String		|	#333333				|
bgColor				|	导航栏背景色						|	String		|	#ffffff				|
showShadow			|	是否显示底部阴影					|	Boolean		|	true				|
showBack			|	是否显示返回按键					|	Boolean		|	true				|
showHome			|	是否显示首页按键					|	Boolean		|	false				|
showCircle			|	是否显示圆圈按键(商品详情页)		|	Boolean		|	false				|
isSearch			|	是否为搜索框						|	Boolean		|	false				|
value				|	搜索框默认值						|	String		|	""					|
placeholder			|	搜索框placeholder				|	String		|	输入关键字搜索		|
showSearchButton	|	是否显示搜索按键					|	Boolean		|	false				|
searchUrl			|	点击搜索跳转页面url				|	String		|	""					|


|  事件				|	说明								|	类型		|	默认值					|
|-------------------|-----------------------------------|---------------|-----------------------|
onSearch			|	搜索触发事件						|	Function	|	---					|


## 示例

```html
普通用法：
<com-page-title title="我的订单" />
输入框用法：
<com-page-title :showSearchButton="true" :isSearch="true" v-model="keyworod" @onSearch="onSearch" />
```


```js
//获取页面头部高度
async onLoad() {
	this.pageTitleHeight = await this.getPageTitleHeight();
}
```
