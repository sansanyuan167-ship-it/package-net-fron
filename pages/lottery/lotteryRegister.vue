<template>
	<view class="page-container">
		<com-page-title title="新人注册抽奖转盘" bgColor="rgba(33,47,63,0.6)" />
		<view class="bg">
			<image src="/static/activity/lottery-bg.png" mode="aspectFill"></image>
		</view>
		<particle
		    :particle-count="100"
		    :particle-size-range="[2, 6]"
		    :particle-colors="['rgba(255,255,255,0.5)', 'rgba(185,36,38,0.5)', 'rgba(117,203,22,0.5)', 'rgba(160,13,212,0.5)']" />
		<view class="lottery-box">
			<view class="loading"></view>
			<almost-lottery :lotterySize="600" :actionSize="150" :imgWidth="120" :imgHeight="120" :stroked="true"
				:strMarginOutside="25" :strFontSize="34" :imgMarginStr="5" :colors="['#F06C58','#F7CE55']" :strFontColors="['#F5BC1C', '#ED583E']" :prizeSize="550"
				:prizeList="prizeList" :prizeIndex="prizeIndex" @reset-index="prizeIndex = -1"
				@draw-before="handleDrawBefore" @draw-start="handleDrawStart" @draw-end="handleDrawEnd"
				@finish="handleDrawFinish" :duration="5" :ringCount="5" :selfRotaty="false" :selfTime="2000"
				actionBg="/static/activity/go.png" v-if="prizeList.length" />
		</view>
		<view class="register-amount" v-if="registerAmount">
			<view class="value scale">{{registerAmount}}</view>
			<view class="title">您已抽奖成功获得</view>
			<view v-if="!getToken()" class="register" @click="goPage('/pages/base/register','redirect')">注册生效</view>
			<view v-else class="register" @click="goPage('/pages/index/index','reLaunch')">我知道了</view>
		</view>
		<view class="sound" :class="{
			off:!sound
		}" :style="{
			top:`calc(${pageTitleHeight}rpx + 30rpx)`
		}" @click="actionSound">
			<image src="/static/notice.png"></image>
		</view>
		<!-- START 中奖弹窗 -->
		<com-popup ref="winPopup" model="middle" :maskClosable="false">
			<view class="win-popup">
				<image class="rotate-bg" src="/static/activity/rotate-bg.png"></image>
				<image class="salute" src="/static/activity/salute-bg.webp"></image>
				<view class="popup-content panel-bg">
					<view class="title">恭喜中奖</view>
					<view class="prize">
						<image class="scale" :src="
							currentItem.type == 'WALLET' ?
							'/static/activity/lottery-wallet.png' :
							currentItem.type == 'COIN' ?
							'/static/activity/lottery-coin.png' :
							'/static/activity/lottery-card.png'
						"></image>
						<view class="name">已获得<text>{{currentItem.amount}}</text></view>
					</view>
					<view class="button" @click="hidePopup">我知道了</view>
				</view>
			</view>
		</com-popup>
		<!-- END 中奖弹窗 -->
	</view>
</template>

<script>
	import AlmostLottery from '@/uni_modules/almost-lottery/components/almost-lottery/almost-lottery.vue';
	import particle from '@/pages/components/particle.vue';
	export default {
		components: {
			AlmostLottery,
			particle
		},
		data() {
			return {
				pageTitleHeight:96,
				sound:true,
				audio:null,
				// 以下是奖品配置数据
				// 奖品数据
				prizeList: [],
				// 中奖下标
				prizeIndex: -1,
				currentItem:{},
				registerAmount:''
			};
		},
		async onLoad(options) {
			let sound = uni.getStorageSync('sound');
			this.sound = sound === '' ? true : sound;
			this.pageTitleHeight = await this.getPageTitleHeight();
			this.getLotteryList();
			if(this.getToken()){
				let result = await this.activityApi.lotteryInfo();
				this.registerAmount = result.data.register_amount;
			}else{
				this.registerAmount = uni.getStorageSync('register_coin') || 0;
			}
		},
		onShow() {
			this.playAudio('/static/activity/lottery-bg.mp3', true);
		},
		onHide(){
			if (this.audio) this.audio.stop();
		},
		beforeDestroy() {
			if (this.audio) this.audio.stop();
		},
		methods: {
			// 获取奖品列表
			async getLotteryList(){
				let result = await this.activityApi.getLotteryList({
					scene:'REGISTER'
				});
				this.prizeList = result.data.map((item,index) => {
					return {
						prizeId:item.id,
						prizeName:item.amount,
						prizeImage:item.type == 'WALLET' ? '/static/activity/lottery-wallet.png' : item.type == 'COIN' ? '/static/activity/lottery-coin.png' : '/static/activity/lottery-card.png',
						type:item.type,
						amount:item.amount
					}
				});
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
				if(!this.getToken() && uni.getStorageSync('register_coin')){
					return this.showMsg('你获得奖励，注册后生效');
				}
				let result = await this.activityApi.getLotteryId({
					scene:'REGISTER'
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
				if(!this.getToken()){
					uni.setStorageSync('register_coin',this.currentItem.amount);
				}
				this.registerAmount = this.currentItem.amount;
				this.playAudio('/static/activity/lottery-open.mp3',false);
				this.$refs['winPopup'].show();
			},
			// 抽奖转盘绘制完成
			handleDrawFinish(res) {
				// 抽奖转盘准备就绪后，这里处理你的逻辑
				// 请查看示例项目中的代码
				console.log('抽奖转盘绘制完成', res)
			},
			// 关闭弹窗
			hidePopup(){
				this.$refs['winPopup'].hide();
				this.playAudio('/static/activity/lottery-bg.mp3',true);
			},
			// 播放音频
			playAudio(src,loop){
				if(!this.sound) return false;
				if(!this.audio) this.audio = uni.createInnerAudioContext();
				this.audio.stop();
				this.audio.src = src;
				this.audio.volume = 0.6;
				this.audio.loop = loop;
				this.audio.play();
			},
			// 关闭开启声音
			actionSound(){
				if(this.sound){
					if(this.audio) this.audio.stop();
					this.sound = false;
					uni.setStorageSync('sound',false);
				}else{
					this.sound = true;
					this.playAudio('/static/activity/lottery-bg.mp3', true);
					uni.setStorageSync('sound',true);
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.bg{
		position:absolute;
		top:0;
		left:0;
		width:100%;
		height:100vh;
		image{
			display:block;
			width:100%;
			height:100%;
		}
	}
	.lottery-box {
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
	
		@keyframes rotateAnimation {
			from {
				transform: rotate(0deg);
			}
	
			to {
				transform: rotate(360deg);
			}
		}
	}
	.register-amount{
		position:relative;
		text-align:center;
		margin-top:80rpx;
		.value{
			font-size:80rpx;
			font-weight:600;
			color:#FDF13C;
		}
		.title{
			font-size:28rpx;
			margin-top:50rpx;
			color:#FBCE73;
		}
		.register{
			width:60%;
			line-height:80rpx;
			border-radius:100rpx;
			margin:30rpx auto;
			color:#333;
			font-weight:600;
			background: #D68B21;
			background: linear-gradient(to right bottom, #FDF13C 0%, #FF8133 100%);
		}
	}
	.sound{
		position:absolute;
		top:126rpx;
		right:30rpx;
		width:50rpx;
		height:50rpx;
		image{
			width:100%;
			height:100%;
		}
		&.off{
			image{
				filter: grayscale(80%);
				opacity: 0.6;
			}
		}
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
		.salute{
			position:absolute;
			top:-50rpx;
			left:0;
			width:100%;
			height:100%;
		}
		.popup-content{
			position:relative;
			width:80%;
			margin:0 auto;
			padding:40rpx 25rpx;
			border-radius:30rpx;
			background: radial-gradient(260rpx at center, #2C2F3E, transparent);
			.title{
				font-weight:600;
				font-size:50rpx;
				line-height:110%;
				display: inline-block;
				background-image: linear-gradient(to bottom, #FFFFFF, #FAED24);
				-webkit-background-clip: text;
				color: transparent;
			}
			.prize{
				margin-top:10rpx;
				image{
					width:230rpx;
					height:230rpx;
				}
				.name{
					margin-top:10rpx;
					font-size:30rpx;
					color:#FFFFF0;
					text{
						padding-left:10rpx;
						font-size:46rpx;
						font-weight:600;
					}
				}
			}
			.button{
				margin:50rpx 30rpx 10rpx 30rpx;
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
			transform: rotate(0deg) scale(2.3);
		}
	
		50% {
			transform: rotate(180deg) scale(2.3);
		}
	
		100% {
			transform: rotate(360deg) scale(2.3);
		}
	}
</style>