<template>
	<view class="page-container">
		<com-page-title title="转盘抽奖" />
		<view class="lottery-box">
			<almost-lottery :lotterySize="600" :actionSize="150" :imgWidth="120" :imgHeight="120" :stroked="true"
				:strMarginOutside="25" :strFontSize="28" :imgMarginStr="5" :colors="['#ED583E','#F5BC1C']" :strFontColors="['#FFBF05', '#FFFFFF']" :prizeSize="550"
				:prizeList="prizeList" :prizeIndex="prizeIndex" @reset-index="prizeIndex = -1"
				@draw-before="handleDrawBefore" @draw-start="handleDrawStart" @draw-end="handleDrawEnd"
				@finish="handleDrawFinish" :duration="5" :ringCount="5" :selfRotaty="false" :selfTime="2000"
				actionBg="/static/activity/go.png" v-if="prizeList.length" />
		</view>
		<!-- START 中奖弹窗 -->
		<com-popup ref="winPopup" model="middle">
			<view class="win-popup">
				<image class="rotate-bg" src="/static/activity/rotate-bg.png"></image>
				<view class="popup-content panel-bg">
					<view class="title">恭喜中奖</view>
					<view class="prize">
						<image src="/static/activity/lottery-coin.png"></image>
						<view class="name">获得金币500枚</view>
					</view>
					<view class="button" @click="$refs['winPopup'].hide()">立即收下</view>
				</view>
			</view>
		</com-popup>
		<!-- END 中奖弹窗 -->
	</view>
</template>

<script>
	import AlmostLottery from '@/uni_modules/almost-lottery/components/almost-lottery/almost-lottery.vue'
	export default {
		components: {
			AlmostLottery
		},
		data() {
			return {
				// 转盘类型
				scene:'',
				// 以下是奖品配置数据
				// 奖品数据
				prizeList: [{
						prizeId: 1,
						prizeName: '100',
						prizeImage: '/static/activity/lottery-coin.png'
					},
					{
						prizeId: 2,
						prizeName: '提现卡100',
						prizeImage: '/static/activity/lottery-card.png'
					},
					{
						prizeId: 3,
						prizeName: '300',
						prizeImage: '/static/activity/lottery-coin.png'
					},
					{
						prizeId: 4,
						prizeName: '提现卡200',
						prizeImage: '/static/activity/lottery-card.png'
					},
					{
						prizeId: 5,
						prizeName: '500',
						prizeImage: '/static/activity/lottery-coin.png'
					},
					{
						prizeId: 6,
						prizeName: '提现卡500',
						prizeImage: '/static/activity/lottery-card.png'
					}
				],
				// 中奖下标
				prizeIndex: -1
			};
		},
		async onLoad(options) {
			this.scene = options.scene || 'INVITE';
		},
		onShow() {
			
		},
		methods: {
			// 随机获取两个整数或之间的整数
			getRandomInt(min, max) {
			  return Math.floor(Math.random() * (max - min + 1)) + min;
			},
			// 本次抽奖开始之前
			async handleDrawBefore(callback) {
				// 这里需要处理你抽奖之前的逻辑
				// 请查看示例项目中的代码
				// 必须调用 callback 并传递一个布尔值，布尔值为 true 时，转盘才会开始旋转
				callback(true);
			},
			// 本次抽奖开始
			handleDrawStart() {
				// 这里需要处理你的抽奖逻辑，并得出中奖物品的 prizeIndex
				// 设置中奖选项的下标
				let index = this.getRandomInt(0,this.prizeList.length - 1);
				this.prizeIndex = index;
				console.log(index);
			},
			// 本次抽奖结束
			handleDrawEnd() {
				// 完成抽奖后，这里处理你拿到结果后的逻辑
				// 请查看示例项目中的代码
				this.$refs['winPopup'].show();
			},
			// 抽奖转盘绘制完成
			handleDrawFinish(res) {
				// 抽奖转盘准备就绪后，这里处理你的逻辑
				// 请查看示例项目中的代码
				console.log('抽奖转盘绘制完成', res)
			}
		}
	};
</script>

<style lang="scss" scoped>
	.lottery-box{
		margin:80rpx 25rpx 30rpx 25rpx;
	}
	.win-popup{
		position:relative;
		.rotate-bg{
			position:absolute;
			width:100%;
			height:100%;
			top:0;
			left:0;
			pointer-events: none;
			animation: rotate 3s linear infinite;
			-webkit-animation: rotate 3s linear infinite;
		}
		.popup-content{
			position:relative;
			width:80%;
			margin:0 auto;
			padding:60rpx 25rpx;
			border-radius:30rpx;
			.title{
				font-weight:600;
				font-size:34rpx;
				display: inline-block;
				background-image: linear-gradient(to right bottom, #FDF13C, #FF8133);
				-webkit-background-clip: text;
				color: transparent;
			}
			.prize{
				margin-top:30rpx;
				image{
					width:150rpx;
					height:150rpx;
				}
				.name{
					font-size:30rpx;
				}
			}
			.button{
				margin:30rpx;
				line-height:80rpx;
				font-size:32rpx;
				background:red;
				border-radius:100rpx;
				color:#333;
				background:#FDF13C;
				background: linear-gradient(to right bottom, #FDF13C, #FF8133);
			}
		}
	}
	@keyframes rotate {
		0% {
			transform: rotate(0deg) scale(1.9);
		}
	
		50% {
			transform: rotate(180deg) scale(1.9);
		}
	
		100% {
			transform: rotate(360deg) scale(1.9);
		}
	}
</style>