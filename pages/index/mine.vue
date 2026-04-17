<template>
	<view>
		<scroll-view class="scroll-view" scroll-y @scroll="scroll">
			<view class="is-content">
				<com-page-title :title="getLanguage('我的')" :showBack="false" :bgColor="bgColor" :showShadow="showShadow" :rightText="getLanguage('语言切换')" @rightTextClick="$emit('showLanguage')" />
				<view class="header-bg">
					<image class="bg" src="/static/mine-icons/mine-bg.png" :style="{
						top:`-${pageTitleHeight}rpx`
					}"></image>
				</view>
				<view v-if="!getToken()" class="user-box panel-item" @click="goPage('/pages/base/login','reLaunch')">
					<view class="avatar">
						<image src="/static/avatar.png"></image>
					</view>
					<view class="info">
						<view class="username">
							<text class="bold">{{getLanguage('请先登录')}}</text>
						</view>
						<view class="phone text-gray">{{getLanguage('登录享受更多福利')}}</view>
					</view>
					<text class="open cuIcon-right"></text>
				</view>
				<view v-else class="user-box panel-item" @click="goPageCheck('/pages/mine/info',true)">
					<view class="avatar">
						<image :src="info.avatar"></image>
					</view>
					<view class="info">
						<view class="username">
							<text class="bold">{{info.nickname}}</text>
							<image v-if="info.vip_info" :src="info.vip_info.icon"></image>
						</view>
						<view class="phone text-gray">{{info.phone}}</view>
					</view>
					<text class="open cuIcon-right"></text>
				</view>
				<view class="account-box panel-item">
					<view class="title" @click="goPageCheck('/pages/mine/coinRecords',true)">
						<image src="/static/mine-icons/asset.png"></image>
						<text>{{getLanguage('我的余额')}}：</text>
						<text class="count">{{info.coin || '0.00'}}</text>
						<text class="open cuIcon-right"></text>
					</view>
					<view class="buttons">
						<view class="recharge" @click="goPageCheck('/pages/mine/recharge',true)">{{getLanguage('充值')}}</view>
						<view class="withdraw" @click="goPageCheck('/pages/mine/withdraw',true)">{{getLanguage('提现')}}</view>
					</view>
				</view>
				<view class="records-box panel-item">
					<view class="item" @click="goPageCheck('/pages/mine/assetRecords?type=RECHARGE',true)">
						<image src="/static/mine-icons/recharge.png"></image>
						<view>{{getLanguage('充值记录')}}</view>
					</view>
					<view class="item" @click="goPageCheck('/pages/mine/assetRecords?type=WITHDRAW',true)">
						<image src="/static/mine-icons/withdraw.png"></image>
						<view>{{getLanguage('提现记录')}}</view>
					</view>
					<view class="item" @click="goPageCheck('/pages/mine/gameRecords?type=BROWSE',true)">
						<image src="/static/mine-icons/game.png"></image>
						<view>{{getLanguage('游戏记录')}}</view>
					</view>
				</view>
				<view class="menu-box panel-item">
					<view class="item" @click="goPageCheck('/pages/mine/coinRecords',true)">
						<image src="/static/mine-icons/coin.png"></image>
						<view>{{getLanguage('余额明细')}}</view>
						<text class="open cuIcon-right"></text>
					</view>
					<view class="item" @click="goPageCheck('/pages/mine/wallet',true)">
						<image src="/static/activity/lottery-wallet.png"></image>
						<view>{{getLanguage('邀请奖励')}}</view>
						<view class="text">{{info.wallet || 0}}</view>
						<text class="open cuIcon-right"></text>
					</view>
				</view>
				<view class="menu-box panel-item">
					<!-- <view class="item" @click="goPageCheck('/pages/mine/message',true)">
						<image src="/static/mine-icons/message.png"></image>
						<view>{{getLanguage('我的消息')}}</view>
						<text class="open cuIcon-right"></text>
					</view> -->
					<view class="item" @click="goPageCheck('/pages/mine/gameRecords?type=COLLECT',true)">
						<image src="/static/mine-icons/collect.png"></image>
						<view>{{getLanguage('游戏收藏')}}</view>
						<text class="open cuIcon-right"></text>
					</view>
					<view class="item" @click="goPageCheck('/pages/mine/question')">
						<image src="/static/mine-icons/question.png"></image>
						<view>{{getLanguage('常见问题')}}</view>
						<text class="open cuIcon-right"></text>
					</view>
					<view class="item" @click="goPageCheck('/pages/mine/partner')">
						<image src="/static/mine-icons/partner.png"></image>
						<view>{{getLanguage('成为合伙人')}}</view>
						<text class="open cuIcon-right"></text>
					</view>
				</view>
				<view class="menu-box panel-item">
					<view class="item" @click="goPageCheck('/pages/mine/service')">
						<image src="/static/mine-icons/service.png"></image>
						<view>{{getLanguage('联系客服')}}</view>
						<text class="open cuIcon-right"></text>
					</view>
				</view>
				<view class="menu-box panel-item">
					<view class="item" @click="goPageCheck('/pages/mine/setting',true)">
						<image src="/static/mine-icons/setting.png"></image>
						<view>{{getLanguage('通用设置')}}</view>
						<text class="open cuIcon-right"></text>
					</view>
				</view>
				<view class="tab-bar-place"></view>
			</view>
		</scroll-view>
		<com-login-popup ref="loginPopup" @onCancel="$refs['loginPopup'].hide()" @onConfirm="goPage('/pages/base/login','reLaunch')" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			pageTitleHeight: 96,
			bgColor:'transparent',
			showShadow:false,
			inviteReward:0,
			info:{
				avatar:'/static/avatar.png',
				username:'大神级别的',
				phone:'13800138000',
				balance:'0.00'
			}
		};
	},
	async mounted(){
		this.pageTitleHeight = await this.getPageTitleHeight();
	},
	methods: {
		pageOnLoad(){
			console.log('mine lond');
			this.$emit('showLoading');
		},
		async pageOnShow(){
			console.log('mine show');
			if(this.getToken()) await this.getUserInfo();
			this.$emit('hideLoading');
		},
		// 获取用户信息
		async getUserInfo(){
			let result = await this.userApi.getUserInfo();
			this.info = result.data;
			this.getUserInvite()
		},
		// 获取用户的邀请奖励
		getUserInvite(){
			this.userApi.getUserInviteReward().then(res=>{
				// console.log(res.data)
				this.inviteReward = res.data;
			});
		},
		// 跳转验证
		goPageCheck(url,type){
			if(type && !this.getToken()) return this.$refs['loginPopup'].show();
			this.goPage(url);
		},
		// 滚动触发
		scroll(e){
			// console.log(e);
			let top = e.detail.scrollTop;
			if(top > 50){
				this.bgColor = '#212F3F';
				this.showShadow = true;
			}else{
				this.bgColor = 'transparent';
				this.showShadow = false;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
	scroll-view{
		height:100vh;
	}
	@media screen and (min-width: 768px) {
		.scroll-view {
			position: relative;
			width: calc(100% + 25px);
			&::-webkit-scrollbar {
				display: none !important;
				width: 0 !important;
				height: 0 !important;
				background: transparent !important;
			}
			.is-content{
				width:500px;
			}
		}
	}
	.header-bg{
		position:relative;
		.bg{
			position:absolute;
			width:100%;
			height:680rpx;
			top:-96rpx;
			left:0;
			border-radius:0 0 30rpx 30rpx;
		}
	}
	.user-box{
		position:relative;
		padding:30rpx 25rpx;
		display:flex;
		justify-content: flex-start;
		align-items: center;
		background:url('/static/service-content-bg.png') center center no-repeat;
		background-size:100% 100%;
		.avatar{
			width:110rpx;
			height:110rpx;
			border-radius:100%;
			margin-right:20rpx;
			border:4rpx solid rgba(247,149,8,0.6);
			image{
				width:100%;
				height:100%;
				border-radius:100%;
			}
		}
		.info{
			.username{
				font-size:32rpx;
				display:flex;
				justify-content: flex-start;
				align-items: center;
				text{
					background-image: linear-gradient(to right bottom, #FDF13C, #FF8133);
					-webkit-background-clip: text;
					color: transparent;
				}
				image{
					width:128rpx;
					height:50rpx;
					margin-left:15rpx;
				}
			}
			.phone{
				font-size:28rpx;
				margin-top:10rpx;
			}
		}
		.open{
			margin-left:auto;
		}
	}
	.account-box{
		position:relative;
		padding:30rpx 25rpx;
		background:url('/static/panel-bg.png') center center no-repeat;
		background-size:100% 100%;
		.title{
			position:relative;
			display:flex;
			justify-content: flex-start;
			align-items: center;
			padding-bottom:25rpx;
			&::after{
				content:'';
				display:block;
				width:100%;
				height:2rpx;
				background:linear-gradient(to right,transparent 0%,#212434 50%,transparent 100%);
				position:absolute;
				bottom:0;
				left:0;
			}
			image{
				width:68rpx;
				height:68rpx;
				margin-right:10rpx;
			}
			.count{
				font-size:46rpx;
				font-weight:600;
				display: inline-block;
				background-image: linear-gradient(to right bottom, #F7E3C1, #EDAD4D);
				-webkit-background-clip: text;
				color: transparent;
			}
			.open{
				margin-left:auto;
			}
		}
		.buttons{
			display:flex;
			justify-content: space-between;
			align-items: center;
			margin-top:30rpx;
			gap:30rpx;
			view{
				line-height:80rpx;
				width:100%;
				text-align:center;
				background:linear-gradient(to right bottom,#D68B21 0%,#C17E1F 100%);
				border-radius:100rpx;
				&.withdraw{
					background:linear-gradient(to right bottom,#4B4BFF 0%,#3434C1 100%);
				}
			}
		}
	}
	.records-box{
		position:relative;
		padding:30rpx 4rpx;
		display:flex;
		justify-content: space-between;
		align-items: center;
		.item{
			font-size:28rpx;
			text-align:center;
			width:100%;
			image{
				width:70rpx;
				height:70rpx;
				display:block;
				margin:0 auto;
			}
			view{
				margin-top:6rpx;
			}
		}
	}
	.menu-box{
		position:relative;
		padding:0 25rpx;
		.item{
			position:relative;
			display:flex;
			justify-content: flex-start;
			align-items: center;
			padding:25rpx 0;
			&::after{
				content:'';
				display:block;
				width:100%;
				height:2rpx;
				background:linear-gradient(to right,transparent 0%,#212434 50%,transparent 100%);
				position:absolute;
				bottom:-1rpx;
				left:0;
			}
			&:last-child::after{
				display:none;
			}
			image{
				width:50rpx;
				height:50rpx;
				margin-right:15rpx;
			}
			.text{
				position:absolute;
				top:30rpx;
				right:50rpx;
				color:#EDE336;
			}
			.open{
				margin-left:auto;
			}
		}
	}
</style>
