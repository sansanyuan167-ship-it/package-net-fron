<template>
	<text :class="['price-box',{bold:bold}]" :style="{
		fontSize:`${minSize}rpx`,
		color:color
	}">
		<text class="yen">&yen;</text>
		<text class="int" :style="{
			fontSize:`${maxSize}rpx`
		}">{{int}}</text>
		<text class="dot">.</text>
		<text class="float">{{float}}</text>
	</text>
</template>

<script>
	/*
	使用：<com-show-price price="56.00" minSize="24" maxSize="36" bold />
	*/
	export default {
		name:'com-show-price',
		props:{
			//价格
			price:{
				type:[String,Number],
				default:'0.00'
			},
			//字体颜色
			color:{
				type:[String,Number],
				default:'#FF3858'
			},
			//是否粗体 null为任意类型
			bold:{
				type:null,
				default:false
			},
			//小字体大小（rpx）
			minSize:{
				type:[String,Number],
				default:'26'
			},
			//大字体大小（rpx）
			maxSize:{
				type:[String,Number],
				default:'34'
			},
		},
		data() {
			return {
				int:'0',
				float:'00'
			};
		},
		watch: {
			price: {
				handler(e) {
					this.splitPrice(e);
				}
			}
		},
		mounted(){
			this.splitPrice(this.price);
		},
		methods:{
			//处理价格
			splitPrice(price){
				price = parseFloat(price).toFixed(2);
				let arr = price.split('.');
				this.int = arr[0];
				this.float = arr[1];
			}
		}
	}
</script>

<style lang="scss">
	.price-box{
		font-size:36rpx;
		font-size:26rpx;
		color:#E54D42;
		.yen{
			padding-right:6rpx;
		}
		.int{
			font-size:34rpx;
		}
	}
</style>
