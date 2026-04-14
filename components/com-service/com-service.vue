<template>
	<view>
		
		<com-service-notice></com-service-notice>
		<view class="com-service-panel">
			<view class="title">- {{getLanguage('服务中心')}} -</view>
			<view class="info">{{info || getLanguage('点击下面图标联系客服')}}</view>
			<view class="icons">
				<image class="scale" src="/static/telegram.png"></image>
				<image class="scale" src="/static/whatsapp.png"></image>
			</view>
			<view class="time text-green">{{getLanguage('工作服务时间')}}：08:00 ~ 22:00</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'com-service',
		props: {
			info:{
				type:String,
				default:''
			},
		},
		data() {
			return {
				
			};
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.com-service-panel{
		margin:25rpx;
		text-align:center;
		padding:25rpx;
		background:url('/static/service-content-bg.png') center center no-repeat;
		background-size:100% 100%;
		.title{
			font-size:30rpx;
			font-weight:600;
			display: inline-block;
			background-image: linear-gradient(to right bottom, #F7E3C1, #EDAD4D);
			-webkit-background-clip: text;
			color: transparent;
		}
		.info{
			font-size:24rpx;
			margin-top:15rpx;
		}
		.icons{
			display:flex;
			justify-content: center;
			align-items: center;
			gap:50rpx;
			margin-top:20rpx;
			image{
				width:68rpx;
				height:68rpx;
				
			}
		}
		.time{
			font-size:24rpx;
			margin-top:15rpx;
		}
	}
</style>
