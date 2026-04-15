<template>
	<view class="home-page">
		<view class="header">
			<view class="status_bar"></view>
			<view class="download-box" v-show="showDownload">
				<view class="title">{{getLanguage('下载APP，享受更多优惠')}}</view>
				<view class="download-button scale">{{getLanguage('立即下载')}}</view>
				<text class="close cuIcon-close" @click="showDownload = false"></text>
			</view>
			<view class="content">
				<view class="left">
					<image class="more" src="/static/more-list.png" @click="$refs['listPopup'].show()"></image>
					<image class="logo" src="/static/logo.png"></image>
				</view>
				<view class="right">
					<view class="icon-box scale" @click="openActivePopup()">
						<image src="/static/activity/activity.png"></image>
						<view class="dot"></view>
					</view>
					<view class="icon-box">
						<image src="/static/language.png" @click="$emit('showLanguage')"></image>
					</view>
					<!-- <view class="icon-box">
						<image src="/static/message.png" @click="goPageCheck('/pages/mine/message',true)"></image>
						<view class="dot-nums">8</view>
					</view> -->
				</view>
			</view>
		</view>
		<scroll-view class="home-container" scroll-y refresher-enabled :refresher-threshold="80"
			refresher-background="#363948" :refresher-triggered="refreshStatus" @refresherrefresh="refreshHandle"
			@scrolltolower="bottomHandle">
			<!--START 轮播图-->
			<view class="uni-padding-wrap banner">
				<view class="bg"></view>
				<swiper class="swiper" :circular="true" :autoplay="true" interval="5000" duration="500"
					@change="bannerIndex = $event.detail.current">
					<swiper-item v-for="(v,i) in info.banner" :key="i">
						<image :src="v.image" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
				<view class="dots">
					<view v-for="(v,i) in info.banner" :key="i" :class="bannerIndex == i ? 'on' : ''"></view>
				</view>
			</view>
			<!--END 轮播图-->
			<view class="index-panel">
				<!-- <image src="/static/test/index-panel1.png" mode="widthFix"></image>
				<image src="/static/test/index-panel2.png" mode="widthFix"></image> -->
				<image :src="item.image" mode="widthFix" v-for="(item,index) in activityList" :key="index" @click="goPage('/pages/game/activityDetail?id='+item.id)"></image>
			</view>
			<view class="notice">
				<image src="/static/notice.png"></image>
				<view class="text-box">
					<view class="text" id="scrollText" ref="scrollText" :style="`
					animation: scrollText ${scrollTime}s linear infinite;
					-webkit-animation: scrollText ${scrollTime}s linear infinite;
					`">{{info.notice}}</view>
				</view>
			</view>
			<view class="supplier-box">
				<view class="scroll-box">
					<view class="image-box" v-for="(item,index) in info.supplier" :key="index"
						@click="goPageCheck('/pages/game/supplierGame?id='+item.id)">
						<image :src="item.icon" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<view class="group-box" v-for="(v,i) in info.list" :key="i">
				<view class="title-box">
					<image :src="v.icon"></image>
					<view class="title bold">{{v.name}}</view>
					<view class="more" @click="goPageCheck('/pages/game/categoryGame?id='+v.id)">
						<text>{{getLanguage('查看更多')}}</text>
						<text class="open cuIcon-right"></text>
					</view>
				</view>
				<view class="list">
					<view class="item" v-for="(vv,ii) in v.game_list" :key="ii"
						@click="goPageCheck('/pages/game/gameView?id='+vv.game_id,true)">
						<image class="image-bg" :src="vv.cover" mode="widthFix"></image>
						<view class="collect text-gray cuIcon-likefill" :class="{'text-red':vv.is_collect}"
							@click.stop="actionGameCollect(i,ii)"></view>
					</view>
				</view>
			</view>
			<view class="title-bar">
				<image src="/static/title-left.png"></image>
				<view>合作伙伴</view>
				<image src="/static/title-right.png"></image>
			</view>
			<image class="partners" src="/static/partners.png" mode="widthFix"
				@click="goPageCheck('/pages/game/supplierGame')"></image>
			<view class="tab-bar-place"></view>
		</scroll-view>

		<view class="ranking" @click="goPageCheck('/pages/game/ranking')">
			<image class="icon rotate" src="/static/activity/activity-ranking.png"></image>
			<view class="text scale bold">排行奖励</view>
		</view>

		<view class="lottery" @click="goPageCheck('/pages/lottery/lottery')">
			<image class="icon rotate" src="/static/activity/activity-lottery.png"></image>
			<view class="text scale bold">转盘抽奖</view>
		</view>

		<!-- START 左侧列表弹窗 -->
		<com-popup ref="listPopup" model="left">
			<view class="list-popup panel-bg">
				<scroll-view scroll-y>
					<view class="status_bar"></view>
					<view class="logo-box">
						<image src="/static/logo.png"></image>
						<view class="title">678bom</view>
					</view>
					<view class="buttons">
						<view class="recharge" @click="goPageCheck('/pages/mine/recharge',true)">{{getLanguage('充值')}}
						</view>
						<view class="withdraw" @click="goPageCheck('/pages/mine/withdraw',true)">{{getLanguage('提现')}}
						</view>
					</view>
					<view class="activity">
						<view class="title">{{getLanguage('精彩活动')}}</view>
						<view class="list">
							
								<image :src="item.image" mode="widthFix" v-for="(item,index) in activityList" :key="index"
													@click="goPage('/pages/game/activityDetail?id='+item.id)"></image>
													
							
					

						</view>
					</view>
					<view class="menu-list">
						<view class="item" @click="goPageCheck('/pages/mine/partner')">
							<image src="/static/mine-icons/game.png"></image>
							<text>{{getLanguage('成为合伙人')}}</text>
						</view>
						<view class="item" @click="goPageCheck('/pages/mine/service')">
							<image src="/static/mine-icons/service.png"></image>
							<text>{{getLanguage('联系客服')}}</text>
						</view>
						<view class="item" @click="goPageCheck('/pages/mine/question')">
							<image src="/static/mine-icons/question.png"></image>
							<text>{{getLanguage('常见问题')}}</text>
						</view>
						<view class="item" @click="goPageCheck('/pages/mine/setting',true)">
							<image src="/static/mine-icons/setting.png"></image>
							<text>{{getLanguage('通用设置')}}</text>
						</view>
						<view class="item" @click="goPageCheck('/pages/lottery/lottery')">
							<image src="/static/icon.png"></image>
							<text>{{getLanguage('转盘抽奖')}}</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</com-popup>
		<!-- END 左侧列表弹窗 -->
		<!-- START 活动列表弹窗 -->
		<com-popup ref="activePopup" model="bottom">
			<view class="active-popup panel-bg">
				<text class="close cuIcon-close" @click="$refs['activePopup'].hide()"></text>
				<view class="title">{{getLanguage('精彩活动')}}</view>
				<scroll-view scroll-y>
					<view class="item">
						<image class="icon" src="/static/activity/activity-recharge.png"></image>
						<view class="info">
							<view class="name">
								<text>{{getLanguage('首次充值优惠')}}</text>
							</view>
							<view class="msg">{{getLanguage('新用户首次充值获取奖励')}}</view>
						</view>
						<view class="button" @click="showFirstRechargePopup"
							v-if="activityData.first_recharge_items.length">{{getLanguage('立即前往')}}</view>
						<view class="button finish" @click="goPageCheck('/pages/mine/recharge',true)" v-else>{{getLanguage('已完成首充')}}
						</view>
					</view>
					<view class="item">
						<image class="icon" src="/static/activity/activity-lottery.png"></image>
						<view class="info">
							<view class="name">
								<text>{{getLanguage('幸运转盘')}}</text>
							</view>
							<view class="msg">{{getLanguage('最高可抽中@REPLACE@现金红包','5000')}}</view>
						</view>
						<view class="button" @click="goPageCheck('/pages/lottery/lottery')">{{getLanguage('立即前往')}}<text v-if="info.lottery_count>0">{{info.lottery_count || 0}}</text></view>
					</view>
					<view class="item">
						<image class="icon" src="/static/activity/activity-ranking.png"></image>
						<view class="info">
							<view class="name">
								<text>{{getLanguage('人气排行榜')}}</text>
							</view>
							<view class="msg">{{getLanguage('排进@REPLACE@名内，可获取现金奖励',100)}}</view>
						</view>
						<view class="button" @click="goPage('/pages/game/ranking')">{{getLanguage('立即前往')}}</view>
					</view>
					<view class="item">
						<image class="icon" src="/static/activity/activity-invite.png"></image>
						<view class="info">
							<view class="name">
								<text>{{getLanguage('邀请奖励')}}</text>
							</view>
							<view class="data">
								<view class="key-value">
									<view class="key">{{getLanguage('邀请人数')}}</view>
									<view class="value">{{activityData.invite_count}}</view>
								</view>
								<view class="key-value">
									<view class="key">{{getLanguage('已获现金红包')}}</view>
									<view class="value">{{activityData.wallet}}</view>
								</view>
							</view>
						</view>
						<view class="button" @click="goPage('/pages/mine/wallet')">{{getLanguage('立即前往')}}</view>
					</view>
					<view class="item">
						<image class="icon" src="/static/activity/activity-vip.png"></image>
						<view class="info">
							<view class="name">
								<text>{{getLanguage('晋升VIP等级')}}</text>
								<image src="/static/tab-bar-icon/vip.png"></image>
							</view>
							<view class="data">
								<view class="key-value">
									<view class="key">{{getLanguage('总充值')}}</view>
									<view class="value">{{activityData.total_recharge}}</view>
								</view>
								<view class="key-value">
									<view class="key">{{getLanguage('洗码量')}}</view>
									<view class="value">{{activityData.total_bet}}</view>
								</view>
							</view>
						</view>
						<view class="button" @click="goPage('/pages/mine/vipDetail')">{{getLanguage('等级说明')}}</view>
					</view>
				</scroll-view>
			</view>
		</com-popup>
		<!-- END 活动列表弹窗 -->
		<!-- START 首充赠送列表弹窗 -->
		<com-popup ref="firstRechargePopup" model="middle" :maskClosable="false">
			<view class="first-recharge-popup panel-bg">
				<text class="close cuIcon-close" @click="hideFirstRechargePopup"></text>
				<view class="title">{{getLanguage('首充赠送优惠')}}</view>
				<scroll-view scroll-y>
					<view class="items">
						<view :class="['item',{
							active:item.id == firstRechargeId
						}]" v-for="(item,index) in activityData.first_recharge_items" :key="index" @click="firstRechargeId = item.id">
							<view class="cash">
								<text>{{parseFloat(item.amount)}}</text>
								<text class="key">{{getLanguage('充值')}}</text>
							</view>
							<view class="add">+</view>
							<view class="bonus">
								<text>{{parseFloat(item.bonus)}}</text>
								<text class="key">{{getLanguage('奖励')}}</text>
							</view>
							<view class="eq">=</view>
							<view class="total">
								<text>{{parseFloat(item.coin) + parseFloat(item.bonus)}}</text>
								<text class="key">{{getLanguage('总共')}}</text>
							</view>
							<view class="recharge-amount">
								<text>{{getLanguage('仅需支付')}}：</text>
								<text class="value">{{parseFloat(item.coin)}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="button" @click="goRecharge('/pages/mine/recharge?id=' + firstRechargeId,true)">{{getLanguage('立即充值')}}</view>
			</view>
		</com-popup>
		<!-- END 首充赠送列表弹窗 -->
		<!-- START 抽奖弹窗 -->
		<com-popup ref="lotteryPopup" model="middle" :maskClosable="false">
			<view class="lottery-popup">
				<text class="close cuIcon-close" @click="$refs['lotteryPopup'].hide();"></text>
				<image class="bg" src="/static/activity/lottery-popup.png"></image>
				<view class="button" @click="goPageCheck('/pages/lottery/lotteryRegister')">{{getLanguage('立即免费抽奖')}}</view>
			</view>
		</com-popup>
		<!-- END 抽奖弹窗 -->
		<com-login-popup ref="loginPopup" @onCancel="$refs['loginPopup'].hide()"
			@onConfirm="goPage('/pages/base/login','reLaunch')" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 显示过新人抽奖弹窗时间
				lotteryTime:0,
				refreshStatus: true,
				pageTitleHeight: 96,
				showDownload: true,
				bannerIndex: 0,
				scrollTime: 15,
				info: {
					banner: [],
					notice: '',
					list: [],
					supplier: []
				},
				// 活动列表
				activityList:[],
				firstRechargeId: null,
				activityData: {
					first_recharge_items: []
				}
			};
		},
		async mounted() {
			this.pageTitleHeight = await this.getPageTitleHeight();
		},
		methods: {
			// 获取手机语言
			getSystemLanguage() {
				if (typeof navigator.language === 'string') {
					return navigator.language;
				} else {
					try {
						return uni.getSystemInfoSync().language;
					} catch (e) {
						return 'zh-CN'; // 默认语言
					}
				}
			},
			async pageOnLoad() {
				console.log('home lond');
				this.$emit('showLoading');
				await this.getIndexData();
				this.$emit('hideLoading');
				this.scrollTextSpeed();
			},
			pageOnShow() {
				console.log('home show');
				this.showDownload = true;
				this.getActivityData();
			},
			// 获取首页数据
			async getIndexData() {
				let result = await this.baseApi.getIndexData();
				this.info = result.data;
				this.activityList=result?.data?.activity_list;
			},
			openActivePopup(){
				this.$refs['activePopup'].show();
			},
			// 获取活动数据
			async getActivityData() {
				let result = await this.baseApi.getActivityData();
				this.activityData = result.data;
				if (this.activityData.first_recharge_items.length) {
					this.firstRechargeId = this.activityData.first_recharge_items[0].id;
				}
				if(!this.activityData.free_lottery){
					if(!uni.getStorageSync('register_coin')){
						let dateTime = Math.floor(Date.now() / 1000);
						if((dateTime - this.lotteryTime) < 60) return false;
						this.$refs['lotteryPopup'].show();
						this.lotteryTime = dateTime;
					}else{
						this.$refs['lotteryPopup'].hide();
					}
				}
			},
			// 下拉刷新
			async refreshHandle() {
				console.log(4545);
				this.refreshStatus = true;
				console.log('refresh');
				await this.getIndexData();
				setTimeout(() => {
					this.refreshStatus = false;
				}, 500);
			},
			// 触底加载
			bottomHandle() {
				console.log('loading more');
			},
			// 设置公告文本速度
			scrollTextSpeed() {
				const query = uni.createSelectorQuery().in(this);
				query.select('#scrollText').boundingClientRect(data => {
					if (data.width < 300) {
						this.scrollTime = 10;
					} else {
						this.scrollTime = data.width / 40;
					}
				}).exec();
			},
			// 操作收藏
			async actionGameCollect(index1, index2) {
				if (!this.getToken()) return this.$refs['loginPopup'].show();
				let status = this.info.list[index1].game_list[index2].is_collect;
				let action = status ? 'remove' : 'add';
				let result = await this.userApi.actionGameCollect({
					id: this.info.list[index1].game_list[index2].id,
					type: 'COLLECT',
					action: action
				});
				this.info.list[index1].game_list[index2].is_collect = !status;
			},
			// 跳转验证
			goPageCheck(url, type) {
				if (type && !this.getToken()) return this.$refs['loginPopup'].show();
				this.goPage(url);
			},
			// 显示首次充值弹窗
			showFirstRechargePopup() {
				this.$refs['activePopup'].hide();
				this.$refs['firstRechargePopup'].show();
			},
			// 关闭首次充值弹窗
			hideFirstRechargePopup() {
				this.$refs['firstRechargePopup'].hide();
				this.$refs['activePopup'].show();
			},
			// 充值
			goRecharge(url, type) {
				if (type && !this.getToken()) return this.$refs['loginPopup'].show();
				this.$refs['firstRechargePopup'].hide();
				this.goPage(url);
			},
		}
	};
</script>

<style lang="scss" scoped>
	.home-page {
		height: 100vh;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: column;
	}

	.home-container {
		position: relative;
		flex: 1;
		width: 100%;
		height: 0;
	}

	.header {
		width: 100%;
		top: 0;
		z-index: 50;
		background: #512033;

		.status_bar {
			height: var(--status-bar-height);
			width: 100%;
		}

		.download-box {
			position: relative;
			height: 90rpx;
			background: url('/static/download-bg.png') center center no-repeat;
			background-size: 100% 100%;

			.title {
				position: absolute;
				left: 150rpx;
				top: 20rpx;
				font-size: 30rpx;
				line-height: 50rpx;
				color: #fff;
				font-weight: 800;
				text-shadow: 0 0 8rpx #B1082A;
			}

			.download-button {
				line-height: 60rpx;
				position: absolute;
				top: 15rpx;
				right: 25rpx;
				padding: 0 20rpx;
				border-radius: 100rpx;
				font-size: 26rpx;
				color: #B00326;
				background: #FFEA96;
				background: linear-gradient(to right bottom, #FFEA96 0%, #F2D86F 100%);
			}

			.close {
				position: absolute;
				padding: 0 20rpx 0 15rpx;
				line-height: 40rpx;
				font-size: 24rpx;
				text-align: center;
				top: 0;
				left: 0;
				background: rgba(0, 0, 0, 0.5);
				border-radius: 0 0 30rpx 0;
			}
		}

		.content {
			position: relative;
			padding: 25rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.left {
				display: flex;
				justify-content: space-between;
				align-items: center;

				image {
					width: 50rpx;
					height: 50rpx;
					padding: 5rpx;
					box-sizing: border-box;

					&.logo {
						width: 140rpx;
						height: 60rpx;
						padding: 0;
						margin-left: 15rpx;
					}
				}
			}

			.right {
				display: flex;
				justify-content: space-between;
				align-items: center;
				gap: 25rpx;

				.icon-box {
					position: relative;
					width: 50rpx;
					height: 50rpx;
					padding: 5rpx;
					box-sizing: border-box;

					image {
						display: block;
						width: 100%;
						height: 100%;
					}

					.dot-nums {
						position: absolute;
						top: -10rpx;
						right: -10rpx;
					}

					.dot {
						position: absolute;
						width: 16rpx;
						height: 16rpx;
						border-radius: 20rpx;
						background: #CD4B49;
						top: -6rpx;
						right: -6rpx;
					}
				}
			}
		}
	}

	.banner {
		padding: 10rpx 25rpx 0 25rpx;
		margin-bottom: 25rpx;
		position: relative;

		.bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 500rpx;
			background: linear-gradient(to bottom, #512033 0%, transparent 100%);
		}

		swiper {
			height: 300rpx;
			border-radius: 25rpx;
			overflow: hidden;

			swiper-item {
				overflow: hidden;

				image {
					display: block;
					width: 100%;
					height: 300rpx;
				}
			}
		}

		.dots {
			width: 100%;
			box-sizing: border-box;
			font-size: 80rpx;
			text-align: center;
			position: absolute;
			bottom: 15rpx;
			left: 0;
			pointer-events: none;

			view {
				display: inline-block;
				width: 18rpx;
				height: 18rpx;
				background: rgba(0, 0, 0, 0.5);
				border: 1rpx solid rgba(255, 255, 255, 0.6);
				border-radius: 100%;
				line-height: 32rpx;
				margin-right: 8rpx;
				-webkit-transition: all .5s linear;
				transition: all .5s linear;

				&:last-child {
					margin-right: 0;
				}
			}

			view.on {
				background: rgba(229, 44, 52, 0.9);
				color: #fff;
			}
		}
	}

	.index-panel {
		margin: 25rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 25rpx;

		image {
			width: calc(50% - 12.5rpx - 4rpx);

		}
	}

	.notice {
		margin: 25rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 15rpx;

		image {
			width: 46rpx;
			height: 46rpx;
		}

		.text-box {
			flex: 1;
			overflow: hidden;
			white-space: nowrap;

			.text {
				color: #F7F7E5;
				font-size: 24rpx;
				display: inline-block;
				/* 使内容宽度适应内容 */
				animation: scrollText 15s linear infinite;
				-webkit-animation: scrollText 15s linear infinite;
			}
		}
	}

	.supplier-box {
		margin: 25rpx;
		height: 68rpx;
		overflow: hidden;

		.scroll-box {
			white-space: nowrap;
			overflow-x: scroll;
			padding-bottom: 50rpx;
			font-size: 0;

			.image-box {
				display: inline-block;
				width: 140rpx;
				height: 65rpx;
				background: #363849;
				margin-right: 20rpx;
				border-radius: 10rpx;

				&:last-child {
					margin-right: 0;
				}

				image {
					width: 100%;
					height: 100%;
					display: block;
					margin: 0 auto;
				}
			}
		}
	}

	.group-box {
		margin: 25rpx;

		.title-box {
			display: flex;
			justify-content: flex-start;
			align-items: center;

			image {
				width: 90rpx;
				height: 90rpx;
				margin-right: 5rpx;
			}

			.title {
				font-size: 32rpx;
				display: inline-block;
				background-image: linear-gradient(to right bottom, #FDF13C, #FF8133);
				-webkit-background-clip: text;
				color: transparent;
			}

			.more {
				color: #E5E5E5;
				margin-left: auto;
				font-size: 28rpx;

				.open {
					margin-left: 10rpx;
				}
			}
		}

		.list {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			gap: 20rpx;
			margin-top: 10rpx;

			.item {
				position: relative;
				width: calc((100% - 60rpx) / 4);
				border-radius: 20rpx;
				overflow: hidden;

				image {
					display: block;
					width: 100%;
					height: 100%;
				}

				.collect {
					position: absolute;
					width: 50rpx;
					height: 50rpx;
					text-align: center;
					line-height: 50rpx;
					bottom: 0;
					right: 0;
					text-shadow: 0 0 16rpx #000;
				}
			}
		}
	}

	.partners {
		width: 100%;
		padding: 0 25rpx;
		box-sizing: border-box;
	}

	.ranking {
		position: fixed;
		width: 110rpx;
		height: 120rpx;
		bottom: 360rpx;
		right: 25rpx;

		.icon {
			display: block;
			width: 100%;
			height: 100%;
		}

		.text {
			font-size: 24rpx;
			position: absolute;
			width: 100%;
			bottom: -10rpx;
			left: 0;
			line-height: 42rpx;
			text-align: center;
			background: #FAE708;
			border: 2rpx solid #850FC6;
			color: #850FC6;
			border-radius: 100rpx;
			opacity:0.86;
		}
	}

	.lottery {
		position: fixed;
		width: 110rpx;
		height: 120rpx;
		bottom: 180rpx;
		right: 25rpx;

		.icon {
			display: block;
			width: 100%;
			height: 100%;
		}

		.text {
			font-size: 24rpx;
			position: absolute;
			width: 100%;
			bottom: -10rpx;
			left: 0;
			line-height: 42rpx;
			text-align: center;
			background: #850FC6;
			border: 2rpx solid #FAE708;
			color: #FAE708;
			border-radius: 100rpx;
			opacity:0.86;
		}
	}

	.list-popup {
		height: 100%;
		padding: 25rpx;
		box-sizing: border-box;

		scroll-view {
			height: 100%;
		}

		.status_bar {
			height: var(--status-bar-height);
			width: 100%;
		}

		.logo-box {
			display: flex;
			justify-content: flex-start;
			align-items: center;

			image {
				width: 130rpx;
				height: 60rpx;
				margin-right: 15rpx;
			}

			.title {
				font-weight: 600;
				display: inline-block;
				background-image: linear-gradient(to right bottom, #FDF13C, #FF8133);
				-webkit-background-clip: text;
				color: transparent;
			}
		}

		.buttons {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 30rpx;
			margin-top: 30rpx;

			view {
				width: 100%;
				line-height: 60rpx;
				background: linear-gradient(to right bottom, #D68B21 0%, #C17E1F 100%);
				border-radius: 100rpx;

				&.withdraw {
					background: linear-gradient(to right bottom, #4B4BFF 0%, #3434C1 100%);
				}
			}
		}

		.activity {
			margin-top: 30rpx;

			.title {
				text-align: left;
			}

			.list {
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex-wrap: wrap;
				gap: 10rpx;
				margin-top: 20rpx;

				image {
					width: calc((100% - 10rpx) / 2 - 4rpx);
					height: 100rpx;
					border-radius: 12rpx;
				}
			}
		}

		.menu-list {
			margin-top: 30rpx;

			.item {
				position: relative;
				display: flex;
				justify-content: flex-start;
				padding: 20rpx 0;

				&::after {
					content: '';
					display: block;
					width: 100%;
					height: 2rpx;
					background: linear-gradient(to right, transparent 0%, #212434 50%, transparent 100%);
					position: absolute;
					bottom: -1rpx;
					left: 0;
				}

				&:last-child::after {
					display: none;
				}

				image {
					width: 46rpx;
					height: 46rpx;
					margin-right: 15rpx;
				}
			}
		}
	}

	.active-popup {
		padding: 30rpx;
		padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
		border-radius: 30rpx 30rpx 0 0;

		scroll-view {
			max-height: 900rpx;
		}

		.close {
			position: absolute;
			top: 10rpx;
			right: 10rpx;
			z-index: 10;
			width: 60rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
		}

		.title {
			position: relative;
			font-size: 32rpx;
			padding: 10rpx 30rpx 40rpx 30rpx;
			font-weight: 600;
			background-image: linear-gradient(to right bottom, #FDF13C, #FF8133);
			-webkit-background-clip: text;
			color: transparent;

			&::after {
				content: '';
				display: block;
				width: 100%;
				height: 2rpx;
				background: linear-gradient(to right, transparent 0%, #212434 50%, transparent 100%);
				position: absolute;
				bottom: 0;
				left: 0;
			}
		}

		.item {
			position: relative;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding: 30rpx 0;

			&::after {
				content: '';
				display: block;
				width: 100%;
				height: 2rpx;
				background: linear-gradient(to right, transparent 0%, #212434 50%, transparent 100%);
				position: absolute;
				bottom: 0;
				left: 0;
			}

			&:last-child::after {
				display: none;
			}

			.icon {
				width: 80rpx;
				height: 80rpx;
				margin-right: 20rpx;
			}

			.info {
				text-align: left;

				.name {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					font-weight: 600;

					image {
						width: 46rpx;
						height: 46rpx;
						margin-left: 20rpx;
					}
				}

				.msg {
					font-size: 26rpx;
					margin-top: 6rpx;
					color: #C1C4CE;
				}

				.data {
					font-size: 26rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					gap: 30rpx;
					margin-top: 6rpx;

					.key-value {
						display: flex;
						justify-content: flex-start;
						align-items: center;
						gap: 8rpx;

						.key {
							color: #C1C4CE;
						}

						.value {
							font-weight: 600;
							color: #EAE034;
						}
					}
				}
			}

			.button {
				position: relative;
				margin-left: auto;
				font-size: 26rpx;
				padding: 10rpx 20rpx;
				border-radius: 100rpx;
				color: #333333;
				background: #D68B21;
				background: linear-gradient(to right bottom, #FDF13C 0%, #FF8133 100%);

				text {
					position: absolute;
					background: #F52727;
					color: #fff;
					font-size: 28rpx;
					box-sizing: border-box;
					line-height: 40rpx;
					min-width: 40rpx;
					border-radius: 100rpx;
					top: -20rpx;
					left: -20rpx;
				}

				&.finish {
					color: #F0FCF2;
					background: #43C967;
					background: linear-gradient(to right bottom, #43C967 0%, #24B94D 100%);
				}
			}
		}
	}

	.first-recharge-popup {
		position: relative;
		top: -60rpx;
		border-radius: 20rpx;
		padding: 30rpx;

		.close {
			position: absolute;
			bottom: -80rpx;
			left: calc(50% - 25rpx);
			width: 50rpx;
			height: 50rpx;
			line-height: 50rpx;
			text-align: center;
			border-radius: 100rpx;
			border: 1rpx solid rgba(255, 255, 255, 0.8);
			box-sizing: border-box;
		}

		.title {
			position: relative;
			padding-bottom: 30rpx;

			&::after {
				content: '';
				display: block;
				width: 100%;
				height: 2rpx;
				background: linear-gradient(to right, transparent 0%, #212434 50%, transparent 100%);
				position: absolute;
				bottom: 0;
				left: 0;
			}
		}

		scroll-view {
			max-height: 650rpx;
		}

		.items {
			.item {
				position: relative;
				padding: 20rpx;
				border: 1rpx solid #212434;
				border-radius: 20rpx;
				margin: 20rpx 0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-bottom: 110rpx;
				transition: all .1s linear;
				-webkit-transition: all .1s linear;

				&.active {
					background: #9B31D6;
					background: linear-gradient(to right bottom, #9B31D6 0%, #850FC6 100%);
				}

				view {
					position: relative;
					width: 150rpx;

					&.cash,
					&.bonus,
					&.total {
						font-size: 34rpx;
						font-weight: 600;
					}

					&.add,
					&.eq {
						width: 30rpx;
						font-size: 30rpx;
						font-weight: 600;
					}

					.key {
						position: absolute;
						bottom: -40rpx;
						left: 0;
						width: 150rpx;
						font-size: 26rpx;
						color: #FDF13C;
					}
				}

				.recharge-amount {
					width: 100%;
					padding-left: 30rpx;
					box-sizing: border-box;
					text-align: left;
					position: absolute;
					bottom: 20rpx;
					right: 0;
					font-size: 26rpx;

					.value {
						font-size: 34rpx;
						font-weight: 600;
						color: #ED0D48;
					}
				}
			}
		}

		.button {
			font-size: 30rpx;
			line-height: 80rpx;
			margin: 10rpx 60rpx;
			border-radius: 100rpx;
			color: #333333;
			background: #D68B21;
			background: linear-gradient(to right bottom, #FDF13C 0%, #FF8133 100%);
		}
	}

	.lottery-popup {
		position: relative;
		top:-60rpx;
		margin: 0 50rpx;
		height: 600rpx;

		.bg {
			position: absolute;
			display: block;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
		}

		.close {
			position: absolute;
			bottom: -80rpx;
			left: calc(50% - 25rpx);
			width: 50rpx;
			height: 50rpx;
			line-height: 50rpx;
			text-align: center;
			border-radius: 100rpx;
			border: 1rpx solid rgba(255, 255, 255, 0.8);
			box-sizing: border-box;
		}

		.button {
			width: 100%;
			position: absolute;
			left: 20rpx;
			bottom: 135rpx;
			text-align: center;
			font-size: 46rpx;
			line-height:80rpx;
			font-weight: 600;
			background-image: linear-gradient(to right bottom, #FDFEEE, #FDD68B);
			-webkit-background-clip: text;
			color: transparent;
			/* 使用skew函数实现倾斜 */
			transform: skew(-10deg, -8deg);
			/* X轴负倾斜，Y轴负倾斜 */
			/* 设置旋转锚点为右上角 */
			transform-origin: top right;
			/* 可选：添加过渡效果 */
			transition: transform 0.3s ease;
		}
	}
</style>