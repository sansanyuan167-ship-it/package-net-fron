<template>
	<view>
		<scroll-view scroll-y>
			<com-page-title :title="getLanguage('分享赚钱')" :showBack="false" />
			<view class="is-login" v-if="getToken()">
				<view class="info-box panel-item">
					<view class="image-box">
						<image :src="info.avatar"></image>
					</view>
					<view class="info">
						<view class="name bold">{{info.nickname}}</view>
						<view class="code-box text-gray">{{getLanguage('邀请码')}}：<text class="code text-green">{{info.code}}</text><text class="copy text-blue" @click="copyText(info.code)">{{getLanguage('复制')}}</text></view>
					</view>
				</view>
				<view class="qrcode-box panel-item">
					<view class="my-title">
						<view class="title">{{getLanguage('我的推广链接')}}</view>
						<image src="/static/share.png" class="share-icon" mode="widthFix" @click="showShareModal = true"></image>
					</view>
					<view class="my-code">
						<canvas :style="{ width: getUnit(250,'px') + 'px', height: getUnit(250,'px') + 'px' }" canvas-id="my-canvas" id="my-canvas"></canvas>
						<view class="code-info text-orange">{{getLanguage('扫一扫，注册绑定关系')}}</view>
					</view>
					<view class="link">
						<text>{{info.link}}</text>
						<image src="/static/copy.png" @click="copyText(info.link)"></image>
					</view>
				</view>
				<view class="my-friends panel-item" @click="goPage('/pages/mine/friends')">
					<text>{{getLanguage('我的好友')}}：</text>
					<text class="count text-orange">{{info.friend_count}}</text>
					<text class="open cuIcon-right"></text>
				</view>
				<view class="data-panel">
					<view class="item" @click="goPage('/pages/mine/wallet')">
						<view class="key">邀请奖励</view>
						<view class="value bold text-orange">{{info.wallet}}</view>
					</view>
					<view class="item">
						<view class="key">{{getLanguage('今日邀请')}}</view>
						<view class="value bold text-orange">{{info.today_friend_count}}</view>
					</view>
				</view>
			</view>
			<view class="not-login" v-else>
				<image src="/static/logo.png"></image>
				<view class="name">678bom</view>
				<view class="login" @click="goPage('/pages/base/login','reLaunch')">{{getLanguage('请先登录')}}</view>
			</view>
			<com-service />
			<view class="tab-bar-place"></view>
		</scroll-view>
		<!-- 分享弹窗 -->
		<com-popup :model="'bottom'" :showModal="showShareModal" @onClose="showShareModal = false">
			<view class="share-popup">
				<view class="share-title">{{getLanguage('分享至')}}</view>
				<view class="share-icons">
					<view class="share-item" @click="shareToTelegram">
						<view class="icon telegram"></view>
						<view class="name">Telegram</view>
					</view>
					<view class="share-item" @click="shareToWhatsApp">
						<view class="icon whatsapp"></view>
						<view class="name">WhatsApp</view>
					</view>
				</view>
				<view class="share-cancel" @click="showShareModal = false">{{getLanguage('取消')}}</view>
			</view>
		</com-popup>		
	</view>
</template>

<script>
import qrCode from '@/common/utils/weapp-qrcode.js';
export default {
	data() {
		return {
			pageTitleHeight: 96,
			info:{},
			showShareModal: false//
		};
	},
	async mounted(){
		this.pageTitleHeight = await this.getPageTitleHeight();
	},
	methods: {
		async pageOnLoad(){
			console.log('share lond');
			if(!this.getToken()) return false;
			this.$emit('showLoading');
			let result = await this.userApi.inviteData();
			this.info = result.data;
			setTimeout(() => {
				this.$nextTick(() => {
					this.couponQrCode(this.info.link);
				});
				this.$emit('hideLoading');
			},300);
		},
		pageOnShow(){
			console.log('share show');
		},
		showShareModal(){
			this.showShareModal = true;
		},
		// 分享到Telegram
		shareToTelegram() {
			const shareText = `${this.getLanguage('分享赚钱 - 邀请好友注册，一起赚钱')}\n${this.info.link}`;
			const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(this.info.link)}&text=${encodeURIComponent(this.getLanguage('分享赚钱 - 邀请好友注册，一起赚钱'))}`;

			if (typeof window !== 'undefined') {
				window.open(telegramUrl, '_blank');
			} else {
				plus.runtime.openURL(telegramUrl);
			}
			this.showShareModal = false;
		},
		// 分享到WhatsApp
		shareToWhatsApp() {
			const shareText = `${this.getLanguage('分享赚钱 - 邀请好友注册，一起赚钱')}\n${this.info.link}`;
			const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
			
			if (typeof window !== 'undefined') {
				window.open(whatsappUrl, '_blank');
			} else {
				plus.runtime.openURL(whatsappUrl);
			}
			this.showShareModal = false;
		},
		// 二维码生成
		couponQrCode(text) {
			let test = new qrCode('my-canvas', {
				text: text,
				width: this.getUnit(250,'px'),
				height: this.getUnit(250,'px'),
				colorDark: '#171A24',
				colorLight: '#F5F7FC',
				// correctLevel: qrCode.CorrectLevel.H
				correctLevel: qrCode.CorrectLevel.L
			});
		},
	}
};
</script>

<style lang="scss" scoped>
	scroll-view{
		height:100vh;
	}
	.info-box{
		padding:30rpx 25rpx;
		display:flex;
		justify-content: flex-start;
		align-items: center;
		.image-box{
			width:120rpx;
			height:120rpx;
			margin-right:15rpx;
			border-radius:100%;
			overflow: hidden;
			image{
				display:block;
				width:100%;
				height:100%;
			}
		}
		.info{
			.name{
				font-size:34rpx;
				display: inline-block;
				background-image: linear-gradient(to right bottom, #FDF13C, #FF8133);
				-webkit-background-clip: text;
				color: transparent;
			}
			.code-box{
				margin-top:15rpx;
				display:flex;
				justify-content: flex-start;
				align-items: center;
				.code{
					
				}
				.copy{
					margin-left:20rpx;
				}
			}
		}
	}
	.qrcode-box{
		padding:30rpx 25rpx;
		.my-title{
			display:flex;
			flex-direction: row;
			justify-content: space-between;
			.title{
				font-size:32rpx;
			}
			.share-icon{
				width: 40rpx;
				z-index: 10;
				filter: drop-shadow(0 2rpx 4rpx rgba(0,0,0,0.2));
			}
		}
		
		.my-code{
			position:relative;
			margin-top:30rpx;
			padding-bottom:40rpx;
			&::after{
				content:'';
				display:block;
				width:100%;
				height:4rpx;
				background:linear-gradient(to right,transparent 0%,#BF9236 50%,transparent 100%);
				position:absolute;
				bottom:0;
				left:0;
			}
			#my-canvas{
				display: block;
				margin: 0 auto;
				border:6rpx solid #212434;
			}
			.code-info{
				text-align:center;
				margin-top:20rpx;
				font-size:26rpx;
			}
		}
		.link{
			display:flex;
			justify-content: flex-start;
			align-items: center;
			margin-top:30rpx;
			image{
				width:50rpx;
				height:50rpx;
				padding:3rpx;
				box-sizing: border-box;
				margin-left:15rpx;
			}
		}
	}
	.my-friends{
		padding:30rpx 25rpx;
		display:flex;
		justify-content: flex-start;
		align-items: center;
		.count{
			font-size:38rpx;
			font-weight:600;
		}
		.open{
			margin-left:auto;
		}
	}
	.data-panel{
		margin:25rpx;
		display:flex;
		justify-content: space-between;
		align-items: center;
		gap:25rpx;
		.item{
			background:#2C2F3E;
			width:100%;
			padding:25rpx;
			border-radius:20rpx;
			.key{
				
			}
			.value{
				font-size:34rpx;
				margin-top:10rpx;
			}
		}
	}
	
	.not-login{
		text-align:center;
		image{
			display:block;
			width:350rpx;
			height:200rpx;
			margin:60rpx auto;
		}
		.name{
			font-weight:600;
			font-size:50rpx;
			display: inline-block;
			background-image: linear-gradient(to right bottom, #FDF13C, #FF8133);
			-webkit-background-clip: text;
			color: transparent;
		}
		.login{
			background: #FBE82F;
			background: linear-gradient(to right bottom, #FBE82F 0%, #E5D31A 100%);
			color: #333333;
			margin:60rpx;
			line-height:90rpx;
			border-radius:100rpx;
			font-size:32rpx;
			font-weight:600;
		}
	}
	
	/* 分享弹窗样式 */
	.share-popup{
		background: #212434;
		padding: 30rpx;
		border-radius: 30rpx 30rpx 0 0;
		
		.share-title{
			text-align: center;
			font-size: 32rpx;
			color: #FFFFFF;
			margin-bottom: 30rpx;
		}
		
		.share-icons{
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
			margin-bottom: 30rpx;
			
			.share-item{
				display: flex;
				flex-direction: column;
				align-items: center;
				margin: 20rpx 0;
				width: 20%;
				
				.icon{
					width: 80rpx;
					height: 80rpx;
					border-radius: 16rpx;
					margin-bottom: 10rpx;
					background-size: cover;
					background-position: center;
					background-repeat: no-repeat;
				}
				
				.name{
					font-size: 24rpx;
					color: #FFFFFF;
				}
				
				.icon.telegram{
					background-image: url('/static/telegram.png');
				}
				.icon.whatsapp{
					background-image: url('/static/whatsapp.png');
				}
			}
		}
		
		.share-cancel{
			text-align: center;
			font-size: 32rpx;
			color: #999999;
			padding: 20rpx 0;
			margin-top: 10rpx;
			border-top: 1rpx solid #333333;
		}
	}
</style>
