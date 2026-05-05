<template>
	<view class="club-container">
		<!-- 背景图 -->
		<image 
			class="bg-image" 
			src="@/static/club/club-bg.png" 
			mode="aspectFill"
		></image>
		
		<view class="club-content">
            <!-- 顶部金币 -->
            <view class="coin-box">
                <view class="coin-balance">
                    <image src="/static/club/club-coin.png"></image>
                    <text>{{info.user_wallet || 0.00}}</text>
                </view>
            </view>

            <!-- 转盘区域 -->
            <view class="wheel-container">
                <image class="circle-bg" src="/static/club/club-circle.png" mode="aspectFit"></image>
                <view class="loading"></view>
                
                <almost-lottery :lotterySize="600" :actionSize="150" :imgWidth="120" :imgHeight="120" :stroked="true"
                        :strMarginOutside="25" :strFontSize="34" :imgMarginStr="5" :colors="['#434DD6','#FBCA03']"
                        :strFontColors="['#FFFFFF']" :prizeSize="550" :prizeList="prizeList" :prizeIndex="prizeIndex"
                        @reset-index="prizeIndex = -1" @draw-before="handleDrawBefore" @draw-start="handleDrawStart"
                        @draw-end="handleDrawEnd" @finish="handleDrawFinish" :duration="5" :ringCount="5" :selfRotaty="false"
                        :selfTime="2000" actionBg="/static/activity/go.png" lotteryBg="/static/activity/lottery-panel.png"
                        v-if="prizeList.length" @click="handleLotteryClick" />
            </view>

            <!-- 提现卡 -->
            <view class="card-section">
                <view class="card-header">
                    <!-- <view class="section-title">{{getLanguage('提现卡')}}</view> -->
                    <view class="card-list">
                        <view class="card-item" v-for="(count, amt) in withdrawCardsList" :key="amt">
                            <text>{{ amt }} × {{ count }}</text>
                        </view>
                    </view>
                </view>
				
                <view class="btn-row">
                    <view class="btn-primary" @click="withdraw">
                        <text>{{getLanguage('提现')}}</text>
                    </view>
                    <image class="club-record" src="/static/club/club-record.png"></image>
                </view>
                <view class="btn-row">
                    <button class="btn-secondary" @click="shareCard">
                        <text>{{getLanguage('分享获得提现卡')}}</text>
                    </button>
                    <text class="question cuIcon-question"></text>
                </view>
            </view>

            <!-- 我的俱乐部 -->
            <view class="club-section">
                <view class="section-header">
                    <text class="title">{{getLanguage('我的俱乐部')}}</text>
                </view>

                <view class="club-info">
                    <view class="info-row info-row-star">
                        <text>{{getLanguage('俱乐部星级：')}}</text>
                        <view class="stars">
                            <image src="/static/club/club_star.png" mode="aspectFit"></image>
                            <image src="/static/club/club_star.png" mode="aspectFit"></image>
                        </view>
                        <text class="question cuIcon-question"></text>
                    </view>
                    <view class="info-row">
                        <text>{{getLanguage('俱乐部人数：')}}</text>
                        <view class="progress">
                            <view class="progress-bar-wrap">
                                <view class="progress-bar" :style="{ width: '20%' }"></view>
                            </view>
                            <text class="progress-text">1/5</text>
                        </view>
                    </view>
                    <view class="info-row">
                        <text>{{getLanguage('洗码量：')}}</text>
                        <view class="progress">
                            <view class="progress-bar-wrap">
                                <view class="progress-bar" :style="{ width: '0%' }"></view>
                            </view>
                            <text class="progress-text">0/1261456</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 邀请奖励 -->
            <view class="reward-item">
                <view class="reward-left">
                    <view class="reward-icon">
                        <image src="/static/club/club_invite.png" mode="aspectFit"></image>
                    </view>
                    <text class="reward-title">{{getLanguage('邀请奖励')}}</text>
                </view>
                <view class="btn-wrap">
                    <view class="btn-small" @click="claim">
                        <text>{{getLanguage('领取')}}</text>
                    </view>
                    <image class="claim-icon" src="/static/club/club-record.png" mode="aspectFit"></image>
                </view>
            </view>

            <!-- 返佣 -->
            <view class="reward-item">
                <view class="reward-left">
                    <view class="reward-icon">
                        <image src="/static/club/club_return.png" mode="aspectFit"></image>
                    </view>
                    <text class="reward-title">{{getLanguage('返佣')}}</text>
                </view>
                <view class="btn-wrap">
                    <view class="btn-small" @click="claim">
                        <text>{{getLanguage('领取')}}</text>
                    </view>
                    <image class="claim-icon" src="/static/club/club-record.png" mode="aspectFit"></image>
                </view>
            </view>

            <!-- 分享按钮 -->
            <view class="share-btn" @click="shareToPoster">
                <image class="btn-bg" src="/static/club/shareCard_bg.png" mode="aspectFill"></image>
                <text>{{getLanguage('分享到海报')}}</text>
            </view>
        </view>
		<!-- START 中奖弹窗 -->
		<com-popup ref="winPopup" model="middle" :maskClosable="false">
			<view class="win-popup">
				<image class="rotate-bg" src="/static/activity/rotate-bg.png"></image>
				<image class="salute" src="/static/activity/salute-bg.webp"></image>
				<view class="popup-content panel-bg">
					<view class="title">{{getLanguage('恭喜中奖')}}</view>
				<view class="prize">
					<image class="scale" :src="
						currentItem.type == 'WALLET' ?
						'/static/activity/lottery-wallet.png' :
						currentItem.type == 'COIN' ?
						'/static/activity/lottery-coin.png' :
						'/static/activity/lottery-group.png'
					"></image>
					<view class="name">{{getLanguage('已获得')}}<text>{{currentItem.amount}}</text></view>
				</view>
				<view class="button" @click="hidePopup">{{getLanguage('我知道了')}}</view>
				</view>
			</view>
		</com-popup>
		<!-- END 中奖弹窗 -->
	</view>
</template>

<script>
	import AlmostLottery from '@/uni_modules/almost-lottery/components/almost-lottery/almost-lottery.vue';
    export default {
        components: {
            AlmostLottery
        },
        data() {
            return {
				info:{},
                // 以下是奖品配置数据
                // 奖品数据
                prizeList: [],
                // 中奖下标
                prizeIndex: -1,
                currentItem: {}
            };
        },
        computed: {
            // 提现卡列表（根据登录状态显示不同数据）
            withdrawCardsList() {
                // 如果已登录且有withdraw_cards数据
                if (this.info.withdraw_cards && Object.keys(this.info.withdraw_cards).length > 0) {
                    return this.info.withdraw_cards;
                }
                
                // 未登录时，从prizeList中提取CARD类型的数据
                const cardPrizes = this.prizeList.filter(item => item.type === 'CARD');
                const cardsObj = {};
                cardPrizes.forEach(item => {
                    cardsObj[item.amount] = 0; // 未登录时数量都为0
                });
                return cardsObj;
            }
        },
        methods: {
            async pageOnLoad(){
                console.log('club load');
                this.$emit('showLoading');
                // TODO: 在这里添加初始化逻辑
			    this.getLotteryList();
                this.$emit('hideLoading');
            },
            pageOnShow(){
                console.log('club show');
                // TODO: 在这里添加页面显示时的逻辑
                this.getClubList();
			    if(this.getToken()) this.lotteryInfo();
            },
            
			// 获取用户抽奖转盘数据
			async lotteryInfo(){
				let result = await this.activityApi.lotteryInfo();
				this.info = result.data;
			},
			// 获取奖品列表
			async getLotteryList(){
				let result = await this.activityApi.getLotteryList({
					scene:'INVITE'
				});
				this.prizeList = result.data.map((item,index) => {
					return {
						prizeId:item.id,
						prizeName:item.amount,
						prizeImage:item.type == 'WALLET' ? '/static/activity/lottery-wallet.png' : item.type == 'COIN' ? '/static/activity/lottery-coin.png' : '/static/activity/lottery-group.png',
						type:item.type,
						amount:item.amount
					}
				});
			},
            // 获取俱乐部列表
            async getClubList(){
                let result = await this.userApi.getClubList();
                this.info = result.data;
                if(this.info.list.length && !this.currentVip.id){
                    let index = this.info.list.findIndex(item => item.id == this.info.vip_id);
                    if(index < this.info.list.length - 1) index++;
                    this.currentVip = this.info.list[index];
                }
                if(!this.info.list.length) this.$refs['empty'].show(this.getLanguage('暂时没有任何数据'));
            },
			// 本次抽奖开始之前
			async handleDrawBefore(callback) {
				// 这里需要处理你抽奖之前的逻辑
				// 请查看示例项目中的代码
				// 必须调用 callback 并传递一个布尔值，布尔值为 true 时，转盘才会开始旋转
				callback(true);
			},
			// 本次抽奖开始
			async handleDrawStart() {
				if(!this.getToken() && uni.getStorageSync('register_wallet')){
					return this.showMsg(this.getLanguage('你获得奖励，注册后生效'));
				}
				let result = await this.activityApi.getLotteryId({
					scene:'INVITE'
				});
				if(!result.status) return this.showMsg(result.msg);
				this.prizeIndex = this.prizeList.findIndex(item => item.prizeId == result.data);
				this.currentItem = this.prizeList[this.prizeIndex];
				console.log(this.prizeIndex);
			},
			// 本次抽奖结束
			handleDrawEnd() {
				// 完成抽奖后，这里处理你拿到结果后的逻辑
				// 请查看示例项目中的代码
				this.prizeIndex = -1;
				this.$refs['winPopup'].show();
				this.lotteryInfo();
			},
			// 抽奖转盘绘制完成
			handleDrawFinish(res) {
				// 抽奖转盘准备就绪后，这里处理你的逻辑
				// 请查看示例项目中的代码
				console.log('抽奖转盘绘制完成', res)
			},
            // 监听页面滚动
            onPageScroll(e) {
            },
            withdraw() {
                uni.showToast({ title: this.getLanguage('提现功能待开发'), icon: 'none' });
            },
            shareCard() {
                uni.showToast({ title: this.getLanguage('分享成功'), icon: 'success' });
            },
            claim() {
                uni.showToast({ title: this.getLanguage('已领取'), icon: 'success' });
            },
            shareToPoster() {
                uni.showToast({ title: this.getLanguage('生成海报中...'), icon: 'loading' });
            },
			// 处理转盘点击事件
			handleLotteryClick(data){
				console.log('接收到点击事件:', data)
				// 检查点击的奖品是否为 lottery-card.png
				if(data && data.prizeIndex !== undefined && data.prizeList.length > 0){
					let currentPrize = data.prizeList[data.prizeIndex];
					console.log('当前奖品:', currentPrize)
					// 检查奖品类型是否为提现卡（不是 WALLET 或 COIN）
					if(currentPrize && currentPrize.type !== 'WALLET' && currentPrize.type !== 'COIN'){
						console.log('点击了提现卡')
						this.showMsg(this.getLanguage('邀请好友获得提现卡，立即提现！'),3000);
					}
				}
			}
        }
    };
</script>

<style lang="scss" scoped>
.club-container {
	position: relative;
	min-height: 100vh;
	overflow: hidden;
}

// 背景图
.bg-image {
	position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
	transition: transform 0.1s ease-out;
}
.club-content{
	position: relative;
    min-height: 100vh;
	padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}
.coin-box {
	display: flex;
	align-items: center;
    justify-content: center;
    margin: 62rpx auto;

	.coin-balance {
		display: flex;
        justify-content: center;
		align-items: center;
		gap: 20rpx;
        background-image: url('/static/club/club-coin-bg.png');
        background-size: 100% 100%;
        background-position: center;
        height: 78rpx;
        min-width: 266rpx;
        padding: 0 80rpx;
        image {
            width: 58rpx;
            height: 54rpx;
        }
        text {
            font-size: 40rpx;
            font-weight: 800;
            color: #FFFFFF;
        }
	}
}

// 转盘容器
.wheel-container {
    position: relative;
    height:600rpx;
    margin: 80rpx 25rpx 50rpx 25rpx;
    .circle-bg {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 680rpx;
        height: 680rpx;
        z-index: 0;
        pointer-events: none;
    }
    .loading {
        position: absolute;
        left:calc(50% - 30rpx);
        top:calc(300rpx - 30rpx);
        width: 60rpx;
        height: 60rpx;
        box-sizing: border-box;
        border-radius:100rpx;
        border-width:5rpx;
        border-style:solid;
        border-color:transparent #ffffff transparent #ffffff;
        animation: rotateAnimation 1.2s linear infinite;
        -webkit-animation: rotateAnimation 1.2s linear infinite;
    }
    :deep(.almost-lottery) {
        position: relative;
        z-index: 1;
    }
}

// 提现卡区域
.card-section {
	padding: 30rpx;
	color: #fff;

	.card-header {
		display: flex;
		align-items: center;
		gap: 20rpx;
		margin-bottom: 20rpx;
	}

	.section-title {
		font-weight: 400;
		font-size: 32rpx;
		color: #FFFFFF;
		flex-shrink: 0;
	}

	.card-list {
		display: flex;
		gap: 15rpx;
		flex: 1;

		.card-item {
			position: relative;
			flex: 1;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 14rpx;
			overflow: hidden;
			background: url("/static/club/card_bg.png")center center no-repeat;
	        background-size:100% 100%;


			text {
				position: relative;
				z-index: 1;
				font-weight: 500;
				font-size: 28rpx;
				color: #FFFFFF;
			}
		}
	}

	.btn-row {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.btn-primary,
	.btn-secondary {
		position: relative;
		flex: 1;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 20rpx;
		font-size: 32rpx;
		font-weight: bold;
		overflow: hidden;

		text {
			font-weight: 500;
			font-size: 32rpx;
			color: #F5E5B8;
			text-shadow: 0px 8px 8px rgba(0,0,0,0.25);
			position: relative;
			z-index: 1;
		}
	}
	.btn-primary{
		background: url("/static/club/withdraw_bg.png")center center no-repeat;
		background-size:100% 100%;
		
	}

	.btn-secondary {
		background: url("/static/club/shareCard_bg.png")center center no-repeat;
		background-size:100% 100%;
		text {
			font-weight: 500;
			font-size: 32rpx;
			color: #F5E5B8;
			text-shadow: 0px 8px 8px rgba(0,0,0,0.25);
		}
	}

	.club-record {
		width: 40rpx;
		height: 40rpx;
		margin-left: 20rpx;
	}

	.question {
		margin-left: 20rpx;
		font-size: 40rpx;
		background: linear-gradient( 180deg, #FFFCD2 0%, #B98542 100%);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
	}
}

// 俱乐部区域
.club-section {
	position: relative;
	padding: 20rpx 40rpx 20rpx 20rpx;
	margin: 30rpx;
	color: #fff;
	overflow: hidden;
    background: url("/static/club/myclub_bg.png")center center no-repeat;
	background-size:100% 100%;

	.section-header {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		margin-bottom: 36rpx;
		
		.title{
			font-weight: 500;
			font-size: 36rpx;
			background: linear-gradient(270deg, #FFE81A 0%, #FDB008 100%);
			-webkit-background-clip: text;
		    color: transparent;
		}
	}

	.club-info {
		position: relative;
		z-index: 1;
		.info-row {
			display: flex;
			align-items: center;
			margin-bottom: 16rpx;
			font-weight: 400;
			font-size: 30rpx;
			color: #FFFFFF;

			&.info-row-star {
				margin-bottom: 36rpx;
			}

			text {
				flex-shrink: 0;
			}

			.stars {
				display: flex;
				align-items: center;
				gap: 8rpx;
				margin-left: 10rpx;

				image {
					width: 64rpx;
					height: 64rpx;
				}
			}

			.question {
				margin-left: 20rpx;
				font-size: 40rpx;
				background: linear-gradient( 180deg, #FFFCD2 0%, #B98542 100%);
				background-clip: text;
				-webkit-background-clip: text;
				color: transparent;
			}

			.progress {
				flex: 1;
				display: flex;
				align-items: center;
				gap: 15rpx;

				.progress-bar-wrap {
					flex: 1;
					height: 16rpx;
					background: rgba(255, 255, 255, 0.2);
					border-radius: 8rpx;
					overflow: hidden;

					.progress-bar {
						height: 100%;
						background: linear-gradient(90deg, #FFD700, #FFA500);
						border-radius: 8rpx;
					}
				}

				.progress-text {
					font-size: 26rpx;
					color: rgba(255, 255, 255, 0.8);
					flex-shrink: 0;
				}
			}
		}
	}
}

// 奖励项
.reward-item {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 58rpx 20rpx 68rpx;
	border-radius: 24rpx;
	margin: 0 30rpx 24rpx;
    background: url("/static/club/attachs_bg.png")center center no-repeat;
	background-size:100% 100%;

	.reward-left {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16rpx;
		flex-shrink: 0;
	}

	.reward-icon {
		width: 130rpx;
		height: 130rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		image {
			width: 120rpx;
			height: 120rpx;
		}
	}

	.reward-title {
		font-weight: 400;
		font-size: 32rpx;
		color: #FFFFFF;
		text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
	}

	.btn-wrap {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		gap: 20rpx;
		flex-shrink: 0;
	}

	.btn-small {
		position: relative;
		width: 168rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border: 3rpx solid rgba(255, 215, 0, 0.6);
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3);
		border-radius: 12rpx;
		background: url("/static/club/shareCard_bg.png")center center no-repeat;
	    background-size:100% 100%;


		text {
			position: relative;
			z-index: 1;
			font-weight: 400;
			font-size: 28rpx;
			color: #FFFFFF;
		}
	}

	.claim-icon {
		width: 50rpx;
		height: 50rpx;
	}
}

// 分享按钮
.share-btn {
	width: 90%;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	background: linear-gradient(135deg, #2a2a4a, #1a1a30);
	color: #fff;
	font-size: 32rpx;
	font-weight: bold;
	margin: 40rpx auto;
	box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.5);
	position: relative;
	border-radius: 20rpx;
	overflow: hidden;
	
	.btn-bg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
	}
	text {
		font-weight: 500;
		font-size: 32rpx;
		color: #F5E5B8;
		text-shadow: 0px 8px 8px rgba(0,0,0,0.25);
		position: relative;
		z-index: 1;
	}
}
</style>