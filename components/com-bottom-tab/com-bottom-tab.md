
##  页面com-bottom-tab组件说明

|  属性				|	说明								|	类型				|	默认值				|
|-------------------|-----------------------------------|-------------------|-----------------------|
list				|	选项列表							|	Array			|	[]					|
type				|	图标类型							|	String			|	image				|
current				|	默认激活下标						|	String Number	|	0					|
color				|	默认颜色							|	String			|	#8A9099				|
selectedColor		|	选中激活字体颜色					|	String			|	#336BFF				|
bgColor				|	背景颜色							|	String			|	#FFFFFF				|
borderRadius		|	顶部圆角大小						|	String Number	|	0					|

|  事件				|	说明								|	类型				|	默认值				|
|-------------------|-----------------------------------|-------------------|-----------------------|
onClick				|	点击触发事件(回传index)			|	Function		|	---					|


## 示例

```html
用法：
<com-bottom-tab :current="current" :list="tabList" type="image" color="#B7B9B9" selectColor="#336BFF" borderRadius="30" @onClick="onClick" />
```

```js
//list结构
tabList: [{
	name: '首页',
	icon: '/static/icon.png',
	selectedIcon: '/static/avatar.png'
}, {
	name: '数据',
	icon: '/static/icon.png',
	selectedIcon: '/static/avatar.png'
}, {
	name: '消息',
	icon: '/static/icon.png',
	selectedIcon: '/static/avatar.png',
	nums: 1
}, {
	name: '我的',
	icon: '/static/icon.png',
	selectedIcon: '/static/avatar.png'
}]
```