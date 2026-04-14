<template>
	<view>
		<scroll-view scroll-y @scroll="scroll">
			<com-page-title :title="getLanguage('vip')" :showBack="false" :bgColor="bgColor" :showShadow="showShadow" />
			<view class="header-box">
				<image class="bg" src="/static/vip-icons/vip-bg.png" :style="{
					top:`-${pageTitleHeight}rpx`
				}"></image>
				<view class="not-login text-orange" v-if="!getToken()" @click="goPage('/pages/base/login','reLaunch')">
					<text>{{getLanguage('你暂未登录，请先登录哦')}}</text>
					<text class="open cuIcon-right"></text>
				</view>
				<view class="vip-club">
					<image class="club-image" src="/static/vip-icons/vip-club.png"></image>
					<view class="text">
						<view>每日现金返还 - 特权</view>
					</view>
				</view>
				<view class="info text-gray">通过投注，您可以提高您的ViP级别。 等级越高，返现越多，升级奖励和各种特权越多，还有你可以享受的福利！</view>
				<view class="see-detail text-green" @click="goPage('/pages/mine/vipDetail')">查看 VIP 特权的详细信息</view>
			</view>
			<view class="current-vip shine-gradient" v-if="currentVip.id">
				<image class="bg" :src="currentVip.bg_image"></image>
				<view class="question cuIcon-question" @click="goPage('/pages/mine/vipDetail')"></view>
				<view class="content">
					<image class="vip-icon" :src="currentVip.icon"></image>
					<view class="progress-panel">
						<view class="progress-item">
							<view class="key">总充值 {{retainDecimals(currentVip.recharge_amount,2)}}</view>
							<view class="progress-box">
								<view :style="{
									width:`${currentVip.recharge_amount == 0 || (info.total_recharge / currentVip.recharge_amount) >= 1 ? 100 : ((info.total_recharge / currentVip.recharge_amount) * 100)}%`
								}"></view>
							</view>
							<view class="msg-box">
								<view class="msg">当前：{{retainDecimals(info.total_recharge,2)}}</view>
								<view class="msg text-red" v-if="(currentVip.recharge_amount - info.total_recharge) > 0">剩余：{{retainDecimals(currentVip.recharge_amount - info.total_recharge,2)}}</view>
								<view class="msg text-green" v-else>已达标</view>
							</view>
						</view>
						<view class="progress-item">
							<view class="key">洗码量 {{retainDecimals(currentVip.bet_amount,2)}}</view>
							<view class="progress-box">
								<view :style="{
									width:`${currentVip.bet_amount == 0 || (info.total_bet / currentVip.bet_amount) >= 1 ? 100 : ((info.total_bet / currentVip.bet_amount) * 100)}%`
								}"></view>
							</view>
							<view class="msg-box">
								<view class="msg">当前：{{retainDecimals(info.total_bet,2)}}</view>
								<view class="msg text-red" v-if="(currentVip.bet_amount - info.total_bet) > 0">剩余：{{retainDecimals(currentVip.bet_amount - info.total_bet,2)}}</view>
								<view class="msg text-green" v-else>已达标</view>
							</view>
						</view>
					</view>
					<view class="button finish" v-if="(parseFloat(info.total_recharge) >= parseFloat(currentVip.recharge_amount)) && (parseFloat(info.total_bet) >= parseFloat(currentVip.bet_amount))">已解锁</view>
					<view class="button" v-if="parseFloat(info.total_recharge) < parseFloat(currentVip.recharge_amount)" @click="goPageCheck('/pages/mine/recharge',true)">立即充值</view>
					<view class="button" v-if="parseFloat(info.total_bet) < parseFloat(currentVip.bet_amount)" @click="goPage('/pages/game/categoryGame')">去投注</view>
				</view>
			</view>
			<view class="vip-list">
				<view class="item" :class="{active:currentVip.id == item.id}" v-for="(item,index) in info.list" :key="index" @click="currentVip = item">
					<view class="image-box">
						<image :src="item.badge_icon" mode="aspectFill"></image>
					</view>
					<view class="name">{{item.name}}</view>
				</view>
			</view>
			<com-empty ref="empty" />
			<view class="title-bar">
				<image src="/static/title-left.png"></image>
				<view>解锁更多权益</view>
				<image src="/static/title-right.png"></image>
			</view>
			<view class="vip-panel">
				<view class="item" v-for="(item,index) in info.list" :key="index">
					<image class="bg" :src="item.bg_image"></image>
					<view class="question cuIcon-question" @click="goPage('/pages/mine/vipDetail')"></view>
					<view class="content">
						<image class="vip-icon" :src="item.icon"></image>
						<view class="progress-panel">
							<view class="progress-item">
								<view class="key">总充值 {{retainDecimals(item.recharge_amount,2)}}</view>
								<view class="progress-box">
									<view :style="{
										width:`${item.recharge_amount == 0 || (info.total_recharge / item.recharge_amount) >= 1 ? 100 : ((info.total_recharge / item.recharge_amount) * 100)}%`
									}"></view>
								</view>
								<view class="msg-box">
									<view class="msg">当前：{{retainDecimals(info.total_recharge,2)}}</view>
									<view class="msg text-red" v-if="(item.recharge_amount - info.total_recharge) > 0">剩余：{{retainDecimals(item.recharge_amount - info.total_recharge,2)}}</view>
									<view class="msg text-green" v-else>已达标</view>
								</view>
							</view>
							<view class="progress-item">
								<view class="key">洗码量 {{retainDecimals(item.bet_amount,2)}}</view>
								<view class="progress-box">
									<view :style="{
										width:`${item.bet_amount == 0 || (info.total_bet / item.bet_amount) >= 1 ? 100 : ((info.total_bet / item.bet_amount) * 100)}%`
									}"></view>
								</view>
								<view class="msg-box">
									<view class="msg">当前：{{retainDecimals(info.total_bet,2)}}</view>
									<view class="msg text-red" v-if="(item.bet_amount - info.total_bet) > 0">剩余：{{retainDecimals(item.bet_amount - info.total_bet,2)}}</view>
									<view class="msg text-green" v-else>已达标</view>
								</view>
							</view>
						</view>
						<view class="button finish" v-if="(parseFloat(info.total_recharge) >= parseFloat(item.recharge_amount)) && (parseFloat(info.total_bet) >= parseFloat(item.bet_amount))">已解锁</view>
						<view class="button" v-if="parseFloat(info.total_recharge) < parseFloat(item.recharge_amount)" @click="goPageCheck('/pages/mine/recharge',true)">立即充值</view>
						<view class="button" v-if="parseFloat(info.total_bet) < parseFloat(item.bet_amount)" @click="goPage('/pages/game/categoryGame')">去投注</view>
					</view>
				</view>
			</view>
			<view class="remark text-gray">
				<view class="title">描述说明：</view>
				<view class="content">
					<view>1. 工作服务时间：08:00 ~ 22:00。</view>
					<view>2. 如你遇到任何问题，可咨询平台客服。</view>
					<view>3. 我们将会第一时间协助你解答你的问题。</view>
				</view>
			</view>
			<view class="tab-bar-place"></view>
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
			currentVip:{},
			info:{}
		};
	},
	async mounted(){
		this.pageTitleHeight = await this.getPageTitleHeight();
	},
	methods: {
		async pageOnLoad(){
			console.log('vip lond');
			this.$emit('showLoading');
		},
		async pageOnShow(){
			console.log('vip show');
			await this.getVipList();
			this.$emit('hideLoading');
		},
		// 获取VIP列表
		async getVipList(){
			let result = await this.userApi.getVipList();
			this.info = result.data;
			if(this.info.list.length && !this.currentVip.id){
				let index = this.info.list.findIndex(item => item.id == this.info.vip_id);
				if(index < this.info.list.length - 1) index++;
				this.currentVip = this.info.list[index];
			}
			if(!this.info.list.length) this.$refs['empty'].show(this.getLanguage('暂时没有任何数据'));
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
		},
		// 跳转验证
		goPageCheck(url,type){
			if(type && !this.getToken()) return this.$refs['loginPopup'].show();
			this.goPage(url);
		},
	}
};
</script>

<style lang="scss" scoped>
	scroll-view{
		height:100vh;
	}
	.header-box{
		position:relative;
		.bg{
			display:block;
			position:absolute;
			width:100%;
			height:680rpx;
			top:-96rpx;
			left:0;
			border-radius:0 0 30rpx 30rpx;
		}
		.not-login{
			position:relative;
			display:flex;
			justify-content: space-between;
			align-items: center;
			padding:25rpx;
			background:rgba(255,255,255,0.2);
		}
		.vip-club{
			position:relative;
			width:600rpx;
			height:230rpx;
			margin:0 auto;
			.club-image{
				display:block;
				width:100%;
				height:100%;
			}
			.text{
				position:absolute;
				width:100%;
				left:0;
				bottom:60rpx;
				display:flex;
				justify-content:center;
				align-items:center;
				view{
					font-weight:600;
					background-image: linear-gradient(to right, #F5D38B,#FCFCF7,#F5D38B);
					-webkit-background-clip: text;
					color: transparent;
				}
			}
		}
		.info{
			position:relative;
			font-size:28rpx;
			padding:0 25rpx;
			text-align:center;
		}
		.see-detail{
			position:relative;
			text-align:center;
			margin-top:20rpx;
			text-decoration: underline;
		}
	}
	.current-vip{
		position:relative;
		z-index: 5;
		margin:40rpx 25rpx 10rpx 25rpx;
		border-radius:30rpx;
		overflow: hidden;
		.bg{
			position:absolute;
			width:100%;
			height:100%;
			top:0;
			left:0;
		}
		.question{
			position:absolute;
			z-index:15;
			top:10rpx;
			right:10rpx;
			width:60rpx;
			height:60rpx;
			text-align:center;
			line-height:60rpx;
			font-size:36rpx;
			color:#333;
		}
		.content{
			position:relative;
			z-index: 10;
			padding:15rpx 20rpx 20rpx 20rpx;
			.vip-icon{
				width:160rpx;
				height:60rpx;
			}
			.progress-panel{
				width:400rpx;
				display:flex;
				justify-content: space-between;
				align-items: center;
				gap:20rpx;
				margin-top:5rpx;
				.progress-item{
					width:100%;
					.key{
						font-size:26rpx;
					}
					.progress-box{
						width:100%;
						height:14rpx;
						border-radius:100rpx;
						overflow: hidden;
						background:rgba(255,255,255,0.5);
						margin-top:5rpx;
						view{
							width:50%;
							height:100%;
							background: linear-gradient(to right bottom, #F0E536 50%, #FF8133 100%);
						}
					}
					.msg-box{
						color:#333333;
						margin-top:10rpx;
						.msg{
							line-height:30rpx;
							font-size:24rpx;
						}
					}
				}
			}
			.button{
				font-size:24rpx;
				padding:8rpx 25rpx;
				border-radius:100rpx;
				display:inline-block;
				background: linear-gradient(to right bottom, #ED9A26 50%, #E67A06 100%);
				margin-top:10rpx;
				margin-right:15rpx;
				&.finish{
					background: linear-gradient(to right bottom, #24A729 50%, #1AA01F 100%);
				}
			}
		}
	}
	.vip-list{
		display:flex;
		justify-content: flex-start;
		align-items: center;
		gap:20rpx;
		flex-wrap: wrap;
		padding:25rpx;
		.item{
			width:calc((100% - 80rpx) / 5 - 0rpx);
			.image-box{
				width:100%;
				height:125rpx;
				padding:6rpx;
				box-sizing: border-box;
				background:#303148;
				background: linear-gradient(to right bottom, #303148 50%, #27273E 100%);
				border-radius:12rpx;
				overflow: hidden;
				image{
					display:block;
					width:100%;
					height:100%;
				}
			}
			.name{
				text-align:center;
				font-size:26rpx;
				margin-top:10rpx;
			}
			&.active{
				.image-box{
					background:#F2B255;
					background: linear-gradient(to right bottom, #F2B255 50%, #E58921 100%);
				}
				.name{
					color:#E58921;
				}
			}
		}
	}
	.vip-panel{
		.item{
			position:relative;
			z-index: 5;
			margin:25rpx;
			border-radius:30rpx;
			overflow: hidden;
			.bg{
				position:absolute;
				width:100%;
				height:100%;
				top:0;
				left:0;
			}
			.question{
				position:absolute;
				z-index:15;
				top:10rpx;
				right:10rpx;
				width:60rpx;
				height:60rpx;
				text-align:center;
				line-height:60rpx;
				font-size:36rpx;
				color:#333;
			}
			.content{
				position:relative;
				z-index: 10;
				padding:15rpx 20rpx 20rpx 20rpx;
				.vip-icon{
					width:160rpx;
					height:60rpx;
				}
				.progress-panel{
					width:400rpx;
					display:flex;
					justify-content: space-between;
					align-items: center;
					gap:20rpx;
					margin-top:5rpx;
					.progress-item{
						width:100%;
						.key{
							font-size:26rpx;
						}
						.progress-box{
							width:100%;
							height:14rpx;
							border-radius:100rpx;
							overflow: hidden;
							background:rgba(255,255,255,0.5);
							margin-top:5rpx;
							view{
								width:50%;
								height:100%;
								background: linear-gradient(to right bottom, #F0E536 50%, #FF8133 100%);
							}
						}
						.msg-box{
							color:#333333;
							margin-top:10rpx;
							.msg{
								line-height:30rpx;
								font-size:24rpx;
							}
						}
					}
				}
				.button{
					font-size:24rpx;
					padding:8rpx 25rpx;
					border-radius:100rpx;
					display:inline-block;
					background: linear-gradient(to right bottom, #ED9A26 50%, #E67A06 100%);
					margin-top:10rpx;
					margin-right:15rpx;
					&.finish{
						background: linear-gradient(to right bottom, #24A729 50%, #1AA01F 100%);
					}
				}
			}
		}
	}
</style>
