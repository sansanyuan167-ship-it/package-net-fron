<template>
	<view class="page-container">
		<com-page-title :title="getLanguage('联系客服')" />
		<view class="header">
			<image class="image" mode="widthFix" src="/static/service-image.png"></image>
			<view class="content">
				<view class="title">- {{getLanguage('服务中心')}} -</view>
				<view class="info">{{getLanguage('点击下面图标联系客服')}}</view>
				<view class="icons">
					<image class="scale" src="/static/telegram.png"></image>
					<image class="scale" src="/static/whatsapp.png"></image>
				</view>
				<view class="time text-green">{{getLanguage('工作服务时间')}}：08:00 ~ 22:00</view>
			</view>
		</view>
		<view class="btn-block" @click="showMsg(getLanguage('敬请期待'))">
			<text class="icon cuIcon-service"></text>
			<view>{{getLanguage('在线客服')}}</view>
		</view>
		<com-service-notice></com-service-notice>

	</view>
</template>

<script>
export default {
	data() {
		return {
			info:{}
		};
	},
	async onLoad(options) {
		
	},
	onShow(){
		
	},
	methods: {
		
	}
};
</script>

<style lang="scss" scoped>
	.header{
		padding:25rpx 25rpx 0 25rpx;
		background:url('/static/service-bg.png') center center no-repeat;
		background-size:100% 100%;
		.image{
			display:block;
			width:100%;
			height:auto;
		}
		.content{
			text-align:center;
			padding:25rpx;
			background:url('/static/service-content-bg.png') center center no-repeat;
			background-size:100% 100%;
			.title{
				font-size:32rpx;
				font-weight:600;
				display: inline-block;
				background-image: linear-gradient(to right bottom, #F7E3C1, #EDAD4D);
				-webkit-background-clip: text;
				color: transparent;
			}
			.info{
				font-size:24rpx;
				margin-top:20rpx;
			}
			.icons{
				display:flex;
				justify-content: center;
				align-items: center;
				gap:50rpx;
				margin-top:20rpx;
				image{
					width:80rpx;
					height:80rpx;
					
				}
			}
			.time{
				font-size:24rpx;
				margin-top:20rpx;
			}
		}
	}
</style>
