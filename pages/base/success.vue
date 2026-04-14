<template>
	<view class="page-container has-bottom">
		<com-page-title :title="getLanguage('操作成功')" :showBack="false" />
		<image class="icon" src="/static/success-bg.png"></image>
		<view class="msg">{{info.msg}}</view>
		<view class="time bold">{{time}}</view>
		<view class="button" @click="goPath">{{getLanguage('我知道了')}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				time:3,
				info:{
					msg:this.getLanguage('操作成功'),
					path:''
				}
			}
		},
		async onLoad(options) {
			if(options.info) this.info = JSON.parse(decodeURIComponent(options.info));
			console.log(this.info);
			this.setTime();
		},
		onShow() {
			
		},
		methods: {
			// 倒计时
			setTime(){
				this.time = 3;
				this.timer = setInterval(() => {
					this.time--;
					if(this.time <= 0){
						clearInterval(this.timer);
						this.goPath();
					}
				},1000);
			},
			// 跳转
			goPath(){
				if(this.info.path) return this.goPage(this.info.path,'redirect');
				clearInterval(this.timer);
				this.goBack();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.icon{
		display:block;
		width:500rpx;
		height:420rpx;
		margin:100rpx auto 0;
	}
	.msg{
		position:relative;
		top:-20rpx;
		left:0;
		font-size:32rpx;
		padding:25rpx;
		text-align:center;
	}
	.time{
		text-align:center;
		padding:25rpx;
		font-size:120rpx;
		line-height:100%;
	}
	.button{
		background: #FBE82F;
		background: linear-gradient(to right bottom, #FBE82F 0%, #E5D31A 100%);
		color: #333333;
		margin:50rpx 150rpx;
		text-align:center;
		line-height:90rpx;
		border-radius:100rpx;
		font-size:32rpx;
	}
</style>