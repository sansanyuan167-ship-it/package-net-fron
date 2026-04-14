
##  页面com-popup组件说明

|  属性				|	说明								|	类型			|	默认值				|
|-------------------|-----------------------------------|---------------|-----------------------|
model				|	弹窗位置类型						|	String		|	middle				|
showModal			|	是否显示							|	Boolean		|	false				|
maskClosable		|	是否显示返回按键					|	Boolean		|	true				|

model说明
middle => 中部
bottom => 底部
left   => 左边
right  => 右边

## 示例
```html
用法：
<com-popup ref="popup" model="bottom">
	<view class="add-pic-box">
		<view class="items panel-bg">
			<view class="item border-bottom" @click=""><text class="cuIcon-cameraadd"></text>手机拍照</view>
			<view class="item border-bottom" @click=""><text class="cuIcon-album"></text>相册选择</view>
		</view>
		<view class="cancel text-red" @click="$refs['popup'].hide();">取消</view>
	</view>
</com-popup>
```


```js
//用法：（属性showModal和组件方法选取一种）
this.$refs['popup'].show();
```