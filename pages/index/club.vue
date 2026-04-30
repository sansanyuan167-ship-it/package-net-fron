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
                    <text>1234</text>
                </view>
            </view>

            <!-- 转盘区域 -->
            <view class="wheel-container">
                
			    <view class="loading"></view>
                
                <almost-lottery :lotterySize="600" :actionSize="150" :imgWidth="120" :imgHeight="120" :stroked="true"
                        :strMarginOutside="25" :strFontSize="34" :imgMarginStr="5" :colors="['#434DD6','#FBCA03']"
                        :strFontColors="['#FFFFFF']" :prizeSize="550" :prizeList="prizeList" :prizeIndex="prizeIndex"
                        @reset-index="prizeIndex = -1" @draw-before="handleDrawBefore" @draw-start="handleDrawStart"
                        @draw-end="handleDrawEnd" @finish="handleDrawFinish" :duration="5" :ringCount="5" :selfRotaty="false"
                        :selfTime="2000" actionBg="/static/activity/go.png" lotteryBg="/static/activity/lottery-panel.png"
                        v-if="prizeList.length" />
            </view>

            <!-- 提现卡 -->
            <view class="card-section">
                <view class="section-title">提现卡</view>
                <view class="card-list">
                    <view class="card-item" v-for="amt in [100, 200, 300]" :key="amt">
                        <text>{{ amt }}</text>
                    </view>
                </view>
                <view class="btn-primary" @click="withdraw">提现</view>
                <view>
                <button class="btn-secondary" @click="shareCard">分享获得提现卡</button>
                <text class="question cuIcon-question"></text>
                </view>
            </view>

            <!-- 我的俱乐部 -->
            <view class="club-section">
                <view class="section-header">
                    <text class="title">我的俱乐部</text>
                    <text class="cuIcon-question" style="font-size: 28rpx; margin-left: 10rpx;"></text>
                </view>

                <view class="club-info">
                    <view class="info-row">
                        <text>俱乐部星级：</text>
                        <view class="stars">
                            <text class="cuIcon-starfill" style="color: #FFD700;"></text>
                            <text class="cuIcon-starfill" style="color: #FFD700;"></text>
                            <text class="cuIcon-star" style="color: #ccc;"></text>
                        </view>
                    </view>
                    <view class="info-row">
                        <text>俱乐部人数：</text>
                        <view class="progress">
                            <view class="progress-bar" :style="{ width: '20%' }"></view>
                            <text class="progress-text">1/5</text>
                        </view>
                    </view>
                    <view class="info-row">
                        <text>洗码量：</text>
                        <view class="progress">
                            <view class="progress-bar" :style="{ width: '0%' }"></view>
                            <text class="progress-text">0/1261456</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 邀请奖励 -->
            <view class="reward-item">
                <view class="reward-icon">
                    <text class="cuIcon-hand"></text>
                </view>
                <view class="reward-content">
                    <text>邀请奖励</text>
                    <view class="btn-small" @click="claim">领取</view>
                </view>
            </view>

            <!-- 返佣 -->
            <view class="reward-item">
                <view class="reward-icon">
                    <text class="cuIcon-gift"></text>
                </view>
                <view class="reward-content">
                    <text>返佣</text>
                    <view class="btn-small" @click="claim">领取</view>
                </view>
            </view>

            <!-- 分享按钮 -->
            <view class="share-btn" @click="shareToPoster">
                分享到海报
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
                // 以下是奖品配置数据
                // 奖品数据
                prizeList: [],
                // 中奖下标
                prizeIndex: -1,
                currentItem: {}
            };
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
                uni.showToast({ title: '提现功能待开发', icon: 'none' });
            },
            shareCard() {
                uni.showToast({ title: '分享成功', icon: 'success' });
            },
            claim() {
                uni.showToast({ title: '已领取', icon: 'success' });
            },
            shareToPoster() {
                uni.showToast({ title: '生成海报中...', icon: 'loading' });
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
	padding-bottom: 40rpx;
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
}

// 提现卡区域
.card-section {
	padding: 30rpx;
	color: #fff;

	.section-title {
		font-size: 30rpx;
		margin-bottom: 20rpx;
	}

	.card-list {
		display: flex;
		gap: 20rpx;
		margin-bottom: 20rpx;

		.card-item {
			flex: 1;
			background: rgba(255, 255, 255, 0.1);
			border-radius: 12rpx;
			padding: 20rpx;
			text-align: center;
			font-size: 28rpx;
			font-weight: bold;
			color: #FFD700;
			border: 1px solid rgba(255, 255, 255, 0.2);
		}
	}

	.btn-primary,
	.btn-secondary {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 40rpx;
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.btn-primary {
		background: linear-gradient(135deg, #FFA500, #FFD700);
		color: #1a1e2d;
		box-shadow: 0 6rpx 20rpx rgba(255, 215, 0, 0.5);
	}

	.btn-secondary {
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
		border: 1px solid rgba(255, 255, 255, 0.3);
	}
}

// 俱乐部区域
.club-section {
	padding: 30rpx;
	background: rgba(255, 255, 255, 0.05);
	border-radius: 20rpx;
	margin: 30rpx;
	color: #fff;

	.section-header {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		font-size: 32rpx;
		font-weight: bold;
	}

	.club-info {
		.info-row {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			font-size: 28rpx;

			text {
				flex: 1;
			}

			.progress {
				flex: 2;
				display: flex;
				align-items: center;
				gap: 10rpx;

				.progress-bar {
					height: 12rpx;
					background: linear-gradient(90deg, #FFA500, #FFD700);
					border-radius: 6rpx;
				}

				.progress-text {
					font-size: 24rpx;
					color: #aaa;
				}
			}
		}
	}
}

// 奖励项
.reward-item {
	display: flex;
	align-items: center;
	padding: 24rpx 30rpx;
	background: rgba(255, 255, 255, 0.05);
	border-radius: 20rpx;
	margin: 0 30rpx 20rpx;
	color: #fff;

	.reward-icon {
		width: 80rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 50rpx;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.reward-content {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;

		text {
			font-size: 30rpx;
			font-weight: bold;
		}

		.btn-small {
			width: 120rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
			background: rgba(255, 255, 255, 0.1);
			border-radius: 30rpx;
			font-size: 26rpx;
			color: #fff;
			border: 1px solid rgba(255, 255, 255, 0.3);
		}
	}
}

// 分享按钮
.share-btn {
	width: 90%;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	background: linear-gradient(135deg, #2a2a4a, #1a1a30);
	border-radius: 40rpx;
	color: #fff;
	font-size: 32rpx;
	font-weight: bold;
	margin: 40rpx auto;
	box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.5);
}
</style>