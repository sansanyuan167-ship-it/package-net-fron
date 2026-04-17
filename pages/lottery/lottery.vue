<template>
	<view class="page-container">
		<com-page-title :title="getLanguage('抽奖转盘')" />
		<view class="item panel-item" @click="goPage('/pages/lottery/lotteryRegister')">
			<image src="/static/activity/lottery-register.png"></image>
			<view class="info">
				<view class="title">{{getLanguage('新人注册抽奖转盘')}}</view>
				<view class="msg">{{getLanguage('新人注册免费赠送抽奖，100%中奖。')}}</view>
			</view>
			<text class="open cuIcon-right"></text>
		</view>
		<view class="item panel-item" @click="goPage('/pages/lottery/lotteryInvite')">
			<image src="/static/activity/lottery-invite.png"></image>
			<view class="info">
				<view class="title">{{getLanguage('邀请好友转盘')}}</view>
				<view class="msg">{{getLanguage('邀请可获得抽奖机会，100%中奖。')}}</view>
			</view>
			<text class="open cuIcon-right"></text>
		</view>
		<view class="item panel-item" @click="goPage('/pages/lottery/lotteryRecharge')">
			<image src="/static/activity/lottery-recharge.png"></image>
			<view class="info">
				<view class="title">{{getLanguage('充值赠送转盘')}}</view>
				<view class="msg">{{getLanguage('充值可获得抽奖机会，100%中奖。')}}</view>
			</view>
			<text class="open cuIcon-right"></text>
		</view>
		<view class="records">
			<text class="cuIcon-list"></text>
			<view @click="goPage('/pages/lottery/records')">{{getLanguage('我的抽奖记录')}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {
			
		},
		data() {
			return {
				
			};
		},
		async onLoad(options) {
			
		},
		onShow() {
			
		},
		methods: {
			
		}
	};
</script>

<style lang="scss" scoped>
	.item{
		padding:30rpx 20rpx;
		display:flex;
		justify-content: flex-start;
		align-items: center;
		image{
			width:130rpx;
			height:130rpx;
			margin-right:10rpx;
		}
		.info{
			flex:1;
			.title{
				font-size:32rpx;
				font-weight:600;
				color:#FDF13C;
			}
			.msg{
				font-size:28rpx;
				margin-top:15rpx;
				color:#C9C9CE;
			}
		}
		.open{
			margin-left:10rpx;
			color:#C9C9CE;
		}
	}
	.records{
		display:flex;
		justify-content: center;
		align-items: center;
		font-size:28rpx;
		margin-top:50rpx;
		color:#FDF13C;
		text{
			margin-right:10rpx;
		}
	}
</style>