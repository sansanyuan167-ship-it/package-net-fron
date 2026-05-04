<template>
	<view>
		<scroll-view class="scroll-view" scroll-y @scroll="scroll">
			<!-- 背景图 -->
			<image 
				class="bg-image" 
				src="@/static/vip-icons/new-bg.png" 
				mode="aspectFill"
			></image>
			<view class="is-content">
				<view class="header-box">
					<view class="tray"><image src="/static/vip-icons/tray.png"></image></view>
					<view class="current-vip-level">
						<image src="/static/vip-icons/wing-left.png"></image>
						<view class="vip-level-text">{{currentActualVip.vip_level || 'VIP0'}}</view>
						<image src="/static/vip-icons/wing-right.png"></image>
					</view>
					
				</view>
				<view class="current-vip shine-gradient" v-if="currentVip.id">
					<image class="bg" :src="currentVip.bg_image"></image>
					<view class="question cuIcon-question" v-if="info.vip_activity_id" @click="goPage('/pages/game/activityDetail?id='+info.vip_activity_id)"></view>
					<image class="vip-bicon" :src="currentVip.vip_icon"></image>
					<view class="content"> 
					    <image class="vip-level-icon" :src="currentVip.vip_level_icon"></image>
						<view class="progress-panel">
							<view class="progress-item">
								<view class="key">{{getLanguage('总充值')}} {{retainDecimals(currentVip.recharge_amount,2)}}</view>
								<view class="progress-box">
									<view :style="{
										width:`${currentVip.recharge_amount == 0 || (info.total_recharge / currentVip.recharge_amount) >= 1 ? 100 : ((info.total_recharge / currentVip.recharge_amount) * 100)}%`
									}"></view>
								</view>
								<view class="msg-box">
									<view class="msg">{{getLanguage('当前：')}}{{retainDecimals(info.total_recharge,2)}}</view>
									<view class="msg text-red" v-if="(currentVip.recharge_amount - info.total_recharge) > 0">{{getLanguage('剩余：')}}{{retainDecimals(currentVip.recharge_amount - info.total_recharge,2)}}</view>
									<view class="msg text-green" v-else>{{getLanguage('已达标')}}</view>
								</view>
							</view>
							<view class="progress-item">
								<view class="key">{{getLanguage('洗码量')}} {{retainDecimals(currentVip.bet_amount,2)}}</view>
								<view class="progress-box">
									<view :style="{
										width:`${currentVip.bet_amount == 0 || (info.total_bet / currentVip.bet_amount) >= 1 ? 100 : ((info.total_bet / currentVip.bet_amount) * 100)}%`
									}"></view>
								</view>
								<view class="msg-box">
									<view class="msg">{{getLanguage('当前：')}}{{retainDecimals(info.total_bet,2)}}</view>
									<view class="msg text-red" v-if="(currentVip.bet_amount - info.total_bet) > 0">{{getLanguage('剩余：')}}{{retainDecimals(currentVip.bet_amount - info.total_bet,2)}}</view>
									<view class="msg text-green" v-else>{{getLanguage('已达标')}}</view>
								</view>
							</view>
						</view>
						<view class="button finish" v-if="(parseFloat(info.total_recharge) >= parseFloat(currentVip.recharge_amount)) && (parseFloat(info.total_bet) >= parseFloat(currentVip.bet_amount))">{{getLanguage('已解锁')}}</view>
						<view class="button" v-if="parseFloat(info.total_recharge) < parseFloat(currentVip.recharge_amount)" @click="goPageCheck('/pages/mine/recharge',true)">{{getLanguage('立即充值')}}</view>
						<view class="button" v-if="parseFloat(info.total_bet) < parseFloat(currentVip.bet_amount)" @click="goPage('/pages/game/categoryGame')">{{getLanguage('去投注')}}</view>
					</view>
				</view>
				<view class="benefits-container">
					<view class="benefit-box">
						<image class="box-bg"></image>
						<view class="benefit-content">
							<image class="benefit-icon" src="/static/vip-icons/bonus.png"></image>
							<view class="benefit-text">{{getLanguage('升级奖金')}}</view>
							<view class="benefit-text">{{currentVip.upgrade_income}}</view>
						</view>
					</view>
					<view class="benefit-box">
						<image class="box-bg"></image>
						<view class="benefit-content">
							<image class="benefit-icon" src="/static/vip-icons/month.png"></image>
							<view class="benefit-text">{{getLanguage('月奖金')}}</view>
							<view class="benefit-text">{{currentVip.month_income}}</view>
						</view>
					</view>
					<view class="benefit-box">
						<image class="box-bg"></image>
						<view class="benefit-content">
							<image class="benefit-icon" src="/static/vip-icons/charge.png"></image>
							<view class="benefit-text">{{getLanguage('提现手续费')}}</view>
							<view class="benefit-text">{{(currentVip.withdrawal_fee * 100).toFixed(2)}}%</view>
						</view>
					</view>
					<view class="benefit-box">
						<image class="box-bg"></image>
						<view class="benefit-content">
							<image class="benefit-icon" src="/static/vip-icons/traffic.png"></image>
							<view class="benefit-text">{{getLanguage('提现上限')}}</view>
							<view class="benefit-text">{{currentVip.day_withdrawal_limit}}</view>
						</view>
					</view>
				</view>
				<view class="vip-list">
					<view class="item" :class="{active:currentVip.id == item.id}" v-for="(item,index) in info.list" :key="index" @click="currentVip = item">
						<view class="image-box">
							<image :src="item.vip_icon" mode="aspectFill"></image>
						</view>
						<view class="name">{{item.vip_level}}</view>
					</view>
				</view>
				<com-empty ref="empty" />
				<view class="title-bar">
					<image src="/static/title-l.png"></image>
					<view>{{getLanguage('活动规则')}}</view>
					<image src="/static/title-r.png"></image>
				</view>
				<view class="table">
					<view class="title bold">
						<view>{{getLanguage('等级')}}</view>
						<view>{{getLanguage('存款')}}</view>
						<view>{{getLanguage('月度奖金')}}</view>
						<view>{{getLanguage('升级奖金')}}</view>
						<view>{{getLanguage('每日提现额度')}}</view>
					</view>
					<view class="line" v-for="(item,index) in info.list" :key="index">
						<view class="item">
							<view>{{item.vip_level}}</view>
						</view>
						<view class="item">
							<view>{{item.bet_amount}}</view>
						</view>
						<view class="item">
							<view>{{item.month_income}}</view>
						</view>
						<view class="item">
							<view>{{item.upgrade_income}}</view>
						</view>
						<view class="item">
							<view>{{item.day_withdrawal_limit}}</view>
						</view>
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
			currentVip:{},
			info:{}
		};
	},
	async mounted(){
		this.pageTitleHeight = await this.getPageTitleHeight();
	},
	computed: {
			currentActualVip() {
				if (this.info.list && this.info.list.length > 0 && this.info.vip_id) {
					const vipItem = this.info.list.find(item => String(item.id) === String(this.info.vip_id));
					if (vipItem) {
						return vipItem;
					}
					return this.info.list[0];
				}
				return {};
			}
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
		position: relative;
		min-height:100vh;
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
	@media screen and (min-width: 768px) {
		.scroll-view {
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
	.header-box{
		position:relative;
		width: 730rpx;
		height: 164rpx;
		margin: 90rpx auto 0rpx auto;
		.tray{
			position:absolute;
			z-index: 0;
			image{
				height: 164rpx;
				width: 730rpx;
			}
		}
		.current-vip-level{
			position:relative;
			z-index: 1;
			display:flex;
			justify-content: center;
			align-items: center;
			gap:15rpx;
			image{
				width: 66rpx;
				height: 58rpx;
			}
			.vip-level-text{
				font-weight: bold;
				font-size: 64rpx;
				text-align: center;
				font-style: normal;
				text-transform: none;
				background: linear-gradient(180deg, #F1C776 0%, #FFFFFF 50%, #BA8036 75%, #E6BC5D 100%);
				-webkit-background-clip: text;
				color: transparent;
				filter: drop-shadow(0px 8rpx 4rpx #632600);
				height: 60rpx;
				line-height: 60rpx;
				transform: skewX(-10deg);
			}
		}
	}
	// 活动规则按钮样式 - 定位在页面标题栏右侧
	.activity-rule-btn{
		position:absolute;
		top:0;
		right:25rpx;
		height:96rpx;
		line-height:96rpx;
		font-size:28rpx;
		display:flex;
		align-items:center;
		gap:8rpx;
		z-index: 10;
		.question{
			font-size:32rpx;
		}
	}
	.current-vip{
		background: linear-gradient( 262deg, #4B3920 0%, #271800 100%);
		 position:relative;
		 z-index: 5;
		 margin:40rpx 25rpx 10rpx 25rpx;
		 border-radius:30rpx;
		 overflow: hidden;
		  &::before {
		     content: '';
		     position: absolute;
		     top: 0;
		     left: 0;
		     right: 0;
		     bottom: 0;
		     border-radius: 30rpx;
		     padding: 3rpx;  // 边框宽度
		     background: linear-gradient(270deg, 
		       rgba(204, 159, 63, 1), 
		       rgba(255, 238, 190, 1), 
		       rgba(255, 204, 64, 1), 
		       rgba(255, 238, 190, 1), 
		       rgba(153, 115, 62, 1)
		     );
		     -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		     mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		     -webkit-mask-composite: xor;
		     mask-composite: exclude;
		     pointer-events: none;
			 }
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
			background: linear-gradient( 0deg, #D99F4D 0%, #A6742F 100%);
			background-clip: text;
			-webkit-background-clip: text;
			color: transparent;
		}
		.vip-bicon{
			position:absolute;
			z-index:15;
			top:10rpx;
			right:10rpx;
			width: 268rpx;
			height: 268rpx;
			z-index: 2;
		}
		.content{
			
			position:relative;
			z-index: 10;
			padding:15rpx 20rpx 20rpx 20rpx;
			.vip-level-icon{
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
				font-family: YouSheBiaoTiHei, YouSheBiaoTiHei;
				font-weight: 400;
				font-size: 24rpx;
				color: #611405;
				padding:8rpx 25rpx;
				border-radius:100rpx;
				display:inline-block;
				background: linear-gradient( 90deg, #C47816 0%, #FCF7CB 50%, #BE7215 100%);
				margin-top:10rpx;
				margin-right:15rpx;
				&.finish{
					background: linear-gradient( 90deg, #C47816 0%, #FCF7CB 50%, #BE7215 100%);
				}
			}
		}
	}
	.benefits-container{
			display:flex;
			justify-content: space-between;
			align-items: center;
			padding:25rpx;
			gap:16rpx;
		}
	    .benefit-box{
		    position:relative;
		    flex:1;
		    height:160rpx;
		    border-radius:20rpx;
		    overflow: hidden;
		    .box-bg{
				background: rgba(153,115,62,0.12);
			    position:absolute;
			    width:100%;
			    height:100%;
			    top:0;
			    left:0;
		    }
			  // 渐变边框
			  &::before {
			    content: '';
			    position: absolute;
			    top: 0;
			    left: 0;
			    right: 0;
			    bottom: 0;
			    border-radius: 20rpx;
			    padding: 2rpx;  // 边框宽度
			    background: linear-gradient(270deg, 
			      rgba(153, 115, 62, 1), 
			      rgba(255, 204, 64, 1), 
			      rgba(153, 115, 62, 1)
			    );
			    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
			    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
			    -webkit-mask-composite: xor;
			    mask-composite: exclude;
			    pointer-events: none;
			  }
		    .benefit-content{
			    position:relative;
			    z-index:10;
			    height:100%;
			    display:flex;
		        flex-direction:column;
		        justify-content: center;
		        align-items: center;
		        padding:0 15rpx;
		        text-align:center;
		        .benefit-icon{
		        	width: 70rpx;
					height: 70rpx;
					// margin-bottom: 15rpx;
		        }
		        .benefit-text{
		        	font-weight: 400;
		        	font-size: 24rpx;
		        	color: #F4EBBE;
		        }
			}
	    }

	.vip-list{
		// display:flex;
		// justify-content: flex-start;
		// align-items: center;
		// gap:20rpx;
		// flex-wrap: wrap;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 20rpx;
		margin:0 25rpx;
		.item{
			background: rgba(153,115,62,0.12);
			border-radius:20rpx;
			// width:calc((100% - 80rpx) / 5 - 0rpx);
			position: relative;  // 添加相对定位
			 
			 // 渐变边框
			 &::before {
			   content: '';
			   position: absolute;
			   top: 0;
			   left: 0;
			   right: 0;
			   bottom: 0;
			   border-radius: 12rpx;
			   padding: 1rpx;  // 边框宽度
			   background: linear-gradient(360deg, 
			     rgba(153, 115, 62, 1), 
			     rgba(54, 45, 36, 1), 
			     rgba(153, 115, 62, 1), 
			     rgba(54, 45, 36, 1), 
			     rgba(153, 115, 62, 1)
			   );
			   -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
			   mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
			   -webkit-mask-composite: xor;
			   mask-composite: exclude;
			   pointer-events: none;
			 }
			.image-box{
				width:110rpx;
				height:110rpx;
				margin:0 auto;
				
				image{
					display:block;
					width:100%;
					height:100%;
				}
			}
			.name{
				text-align:center;
				font-weight: 400;
				font-size: 28rpx;
				color: #FFFFFF;
				padding-bottom:20rpx;
			}
			&.active{
				&::before {
					padding: 4rpx;
					background: linear-gradient(33deg, rgba(253, 176, 8, 1), rgba(255, 255, 193, 1), rgba(253, 176, 8, 1), rgba(255, 255, 193, 1));
				}
			}
		}
	}
	.table{
		position:relative;
		margin:0 32rpx;
		//border-radius:0 0 20rpx 20rpx;
		background:rgba(255,255,255,0.01);
		.title{
			display:flex;
			justify-content: space-between;
			align-items: stretch;
			text-align:center;
			border: 1px solid #FDB008;
			view{
				width:40%;
				min-width: 0;
				box-sizing: border-box;
				color:#632600;
				background: #FBE82F;
				background: linear-gradient(to right, #FFEBBF 0%, #EAC064 50%, #FFEBBF 100%);
				line-height:80rpx;
				font-size:24rpx;
				border-right:1rpx solid #F2DF26;
				display: flex;
				align-items: center;
				justify-content: center;
				word-break: break-word;
				&:nth-child(1){
					width:20%;
				}
				&:last-child{
					border-right:none;
				}
			}
		}
		.line{
			display:flex;
			justify-content: space-between;
			text-align:center;
			position: relative;
			height: 54rpx;
			
			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				height: 1px;
				background: linear-gradient(to right, rgba(253, 176, 8, 0) 0%, #FDB008 50%, rgba(253, 176, 8, 0) 100%);
				transform: scaleY(0.2);
				transform-origin: center bottom;
			}
			
			.item{
				width:40%;
				box-sizing: border-box;
				padding:0rpx 8rpx;
				display:flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				font-size: 22rpx;
				color: #FFFFFF;
				&:nth-child(1){
					width:20%;
				}
				&:last-child{
					border-right:none;
				}
				
			}
		}
	}
	.title-bar{
		position:relative;
		display:flex;
		justify-content: center;
		align-items: center;
		gap:20rpx;
		padding:30rpx;
		image{
			width: 128rpx;
			height: 40rpx;
		}
		view{
			font-weight: 500;
			font-size: 32rpx;
			text-align: center;
			font-style: normal;
			text-transform: none;
			background: linear-gradient(180deg, #FDB008 0%, #FFFFFF 50%, #FFE81A 100%);
			-webkit-background-clip: text;
			color: transparent;
			filter: drop-shadow(0px 4rpx 4rpx #B7070B);
		}
	}
</style>
