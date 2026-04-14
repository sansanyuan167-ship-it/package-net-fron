<!-- 标签导航栏 -->

### Props
|参数			|类型			|说明										|默认值			|
|tabs			|Array<String>	|标签页列表数据								|[ ]			|
|current		|Number			|当前选项卡									|0				|
|scroll			|Boolean		|是否可以滚动								|false			|
|height			|Number,String	|tab高度，单位rpx							|80				|
|leftGap V1.7.0	|Number,String	|组件左侧距离屏幕的间隙 单位rpx				|0				|
|backgroundColor|String			|tab栏背景色								|#fff			|
|size			|Number			|字体大小									|28				|
|color			|String			|字体颜色									|#666			|
|selectedColor	|String			|选中后字体颜色								|#5677fc		|
|bold			|Boolean		|选中后 字体是否加粗						|false			|
|sliderHeight	|String			|滑块高度									|2px			|
|sliderBgColor	|String			|滑块背景色									|#5677fc		|
|sliderRadius	|String			|滑块圆角 radius							|2px			|
|bottom			|String			|滑块bottom值								|0				|
|isFixed		|Boolean		|是否固定									|false			|
|isSticky V1.6.1|Boolean		|吸顶效果，为true时isFixed失效				|false			|
|top			|Number			|isFixed 或 isSticky为true时top值，单位px	|非H5：0，H5：44|
|zIndex			|Number			|z-index值									|996			|

### Events
|事件名	|说明					|回调参数					|
|change	|切换标签页时触发事件		|{ index : 标签页索引值 }	|


### 示例
```html
<tui-tab :tabs="tabs" @change="change"></tui-tab>
```
```js
tabs:[
	{status:0,name:'全 部'},
	{status:1,name:'待付款'},
	{status:2,name:'待发货'},
	{status:3,name:'待收货'},
	{status:4,name:'待评价'}
]
```
















