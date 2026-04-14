<template>
	<view class="page-container has-bottom">
		<com-page-title :title="getLanguage('邀请奖励')" />
		<view class="wallet-box panel-item">
			<image src="/static/activity/lottery-wallet.png"></image>
			<view class="info">
				<view class="value">{{inviteReward || 0}}</view>
				<view class="key">{{getLanguage('我的邀请奖励金额')}}</view>
			</view>
			<view class="question cuIcon-question"></view>
		</view>
		<view class="choose-card panel-item" @click="$refs['changeCardPopup'].show()">
			<image src="/static/activity/lottery-card.png"></image>
			<view v-if="!currentCard.id">
			<view class="value">{{cardList.length}}</view>
			<view class="key">{{getLanguage('请选择提现卡')}}</view>
			</view>
			<view class="info" v-else>
				<view class="value">{{currentCard.amount}}</view>
				<view class="key">{{getLanguage('已选择提现金额')}}</view>
			</view>
			<text class="open cuIcon-right"></text>
		</view>
		<view class="records">
			<text class="cuIcon-list"></text>
			<view @click="goPage('/pages/mine/walletRecords')">{{getLanguage('邀请奖励记录')}}</view>
		</view>

		<com-service />
		<view class="bottom-btn">
			<view @click="withdraw">{{getLanguage('立即提现')}}</view>
		</view>
		<!-- START 选择渠道弹窗 -->
		<com-popup ref="changeCardPopup" model="bottom">
			<view class="change-card-popup panel-bg">
				<text class="close cuIcon-close" @click="$refs['changeCardPopup'].hide()"></text>
				<view class="popup-title">{{getLanguage('选择提现卡')}}</view>
				<scroll-view scroll-y class="list">
					<view class="item" :class="{'active':item.id == currentCard.id}" v-for="(item,index) in cardList" :key="index" @click="changeCard(item)">
						<text>{{item.amount}}</text>
					</view>
					<view class="empty" v-if="!cardList.length">
						<image src="/static/empty-icons/data.png"></image>
						<view class="msg">{{getLanguage('暂无提现卡')}}</view>
					</view>
				</scroll-view>
			</view>
		</com-popup>
		<!-- END 选择渠道弹窗 -->
		<com-loading-msg ref="loadingMsg" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			inviteReward:0,
			allCardAmount:0,
			amount:'',
			currentCard:{},
			cardList:[
				// {id:1,amount:'100.00'},
				// {id:2,amount:'200.00'},
				// {id:3,amount:'300.00'}
			]
		};
	},
	async onLoad(options) {
		this.loadRechargeCards().then(res=>{
			this.getUserInvite()
		})
		
	},
	onShow(){
		
	},
	methods: {
		// 获取用户的邀请奖励
		getUserInvite(){
			this.userApi.getUserInviteReward().then(res=>{
				// console.log(res.data)
				this.inviteReward = res.data;
			});
		},
		// 拉取提现卡信息
		async loadRechargeCards(){
			let result = await this.assetApi.rechargeCards({
				limit:10,
				page:1
			});
			if(result.status && result.data){
				let n=result.data.length;
				for(let i=0;i<n;i++){
					let item=result.data[i]
					let info={"id":item["id"],"amount":item["amount"]}
					this.cardList.push(info)
					this.allCardAmount+=parseInt(item["amount"])
				}
			}
		},
		// 选择渠道
		changeCard(item){
			this.currentCard = item;
			this.amount=parseInt(item.amount) || 0;
			this.$refs['changeCardPopup'].hide();
		},
		// 提现
		async withdraw(){
			if(!this.currentCard.id) return this.showMsg(this.getLanguage('请选择提现渠道'));
			if(!this.amount) return this.showMsg(this.getLanguage('请输入提现金额'));
			if(!/^[0-9]+$/.test(this.amount)) return this.showMsg(this.getLanguage('提现金额必须为整数')+this.amount);
			this.$refs['loadingMsg'].show(this.getLanguage('提交中'));
			let result = await this.assetApi.withdraw({
				amount:this.amount
			});
			this.$refs['loadingMsg'].hide();
			if(!result.status) return this.showMsg(result.msg);
			let info = {
				msg:this.getLanguage('操作成功'),
				path:''
			};
			this.goPage('/pages/base/success?info=' + encodeURIComponent(JSON.stringify(info)),'redirect');
		}
	}
};
</script>

<style lang="scss" scoped>
	.wallet-box{
		padding:25rpx 20rpx;
		display:flex;
		justify-content: flex-start;
		align-items: center;
		image{
			width:100rpx;
			height:100rpx;
			margin-right:15rpx;
		}
		.info{
			.value{
				font-size:50rpx;
				line-height:110%;
				font-weight:600;
				color:#EDE336;
			}
			.key{
				font-size:28rpx;
				margin-top:5rpx;
				color:#D8D8D8;
			}
		}
		.question{
			margin-left:auto;
			font-size:36rpx;
			width:50rpx;
			height:50rpx;
			line-height:50rpx;
			text-align:center;
			color:#FDAF18;
		}
	}
	.choose-card{
		padding:25rpx 20rpx;
		display:flex;
		justify-content: flex-start;
		align-items: center;
		color:#D8D8D8;
		image{
			width:100rpx;
			height:100rpx;
			margin-right:15rpx;
		}
		.info{
			.value{
				font-size:50rpx;
				line-height:110%;
				font-weight:600;
				color:#B764F5;
			}
			.key{
				font-size:28rpx;
				margin-top:5rpx;
				color:#D8D8D8;
			}
		}
		.open{
			margin-left:auto;
		}
	}
	.records{
		display:flex;
		justify-content: center;
		align-items: center;
		font-size:28rpx;
		margin-top:50rpx;
		margin-bottom:40rpx;
		color:#FDF13C;
		text{
			margin-right:10rpx;
		}
	}
	.change-card-popup{
		position:relative;
		border-radius:30rpx 30rpx 0 0;
		padding:30rpx;
		padding-bottom:calc(30rpx + constant(safe-area-inset-bottom));
		padding-bottom:calc(30rpx + env(safe-area-inset-bottom));
		.close{
			position:absolute;
			top:10rpx;
			right:10rpx;
			z-index: 10;
			width:60rpx;
			height:60rpx;
			line-height:60rpx;
			text-align:center;
		}
		.popup-title{
			position:relative;
			font-size:32rpx;
			padding-bottom:30rpx;
			&::after{
				content:'';
				display:block;
				width:100%;
				height:2rpx;
				background:linear-gradient(to right,transparent 0%,#3E4355 50%,transparent 100%);
				position:absolute;
				bottom:-1rpx;
				left:0;
			}
		}
		.list{
			margin-top:30rpx;
			max-height:600rpx;
			.item{
				border:1rpx solid #3E4355;
				border-radius:20rpx;
				margin-bottom:20rpx;
				padding:30rpx;
				font-size:40rpx;
				&.active{
					color:#333333;
					font-weight:600;
					background:linear-gradient(to right bottom,#EDAD4D 0%,#D68B21 100%);
				}
			}
			.empty{
				padding:30rpx;
				image{
					width:250rpx;
					height:250rpx;
				}
				.msg{
					font-size:28rpx;
				}
			}
		}
	}
</style>
