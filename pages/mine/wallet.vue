<template>
	<view class="page-container has-bottom">
		<com-page-title :title="getLanguage('邀请奖励')" />
		<view class="wallet-box panel-item">
			<image src="/static/activity/lottery-wallet.png"></image>
			<view class="info">
				<view class="value">{{inviteReward || 0}}</view>
				<view class="key">{{getLanguage('我的邀请奖励金额')}}</view>
			</view>
			<view class="question cuIcon-question" @click="tipShow"></view>
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
			<view @click="showPasswordPopup">{{getLanguage('立即提现')}}</view>
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
		
		<!-- START 提现密码输入弹窗 -->
		<com-popup ref="passwordPopup" model="bottom">
			<view class="password-popup panel-bg">
				<text class="close cuIcon-close" @click="$refs['passwordPopup'].hide()"></text>
				<view class="popup-title">{{getLanguage('请输入提现密码')}}</view>
				<view class="password-input-box">
					<view class="input-item" v-for="(item, index) in 6" :key="index">
						<view class="dot" v-if="password.length > index"></view>
					</view>
				</view>
				<view class="keyboard">
					<view class="key-row">
						<view class="key" v-for="num in [1, 2, 3]" :key="num" @click="inputPassword(num)">{{num}}</view>
					</view>
					<view class="key-row">
						<view class="key" v-for="num in [4, 5, 6]" :key="num" @click="inputPassword(num)">{{num}}</view>
					</view>
					<view class="key-row">
						<view class="key" v-for="num in [7, 8, 9]" :key="num" @click="inputPassword(num)">{{num}}</view>
					</view>
					<view class="key-row">
						<view class="key empty"></view>
						<view class="key" @click="inputPassword(0)">0</view>
						<view class="key delete" @click="deletePassword">
							<text class="cuIcon-delete"></text>
						</view>
					</view>
				</view>
			</view>
		</com-popup>
		<!-- END 提现密码输入弹窗 -->
		
		<com-loading-msg ref="loadingMsg" />
		<com-confirm 
			ref="confirm" 
			:content="getLanguage('请绑定银行卡')"
			@onCancel="$refs['confirm'].hide()" 
			@onConfirm="confirm" 
		/>
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
			],
			password: '' // 提现密码
		};
	},
	async onLoad(options) {
		let result = await this.userApi.getUserInfo();
		this.info = result.data;
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
		// 显示密码输入弹窗
		showPasswordPopup(){
			if(this.inviteReward <= 0) return this.showMsg(this.getLanguage('可提现余额')+'：'+this.inviteReward,3000);
			if(this.cardList.length==0) return this.showMsg(this.getLanguage('暂无提现卡'));
			if(!this.currentCard.id) return this.showMsg(this.getLanguage('请选择提现渠道'));
			if(!this.amount) return this.showMsg(this.getLanguage('请输入提现金额'));
			if(!/^[0-9]+$/.test(this.amount)) return this.showMsg(this.getLanguage('提现金额必须为整数')+this.amount);
			if(!this.info.bank_number) return this.$refs['confirm'].show();
			
			this.password = '';
			this.$refs['passwordPopup'].show();
		},
		// 输入密码
		inputPassword(num){
			if(this.password.length < 6){
				this.password += num;
				// 如果密码已输入6位，自动提交
				if(this.password.length === 6){
					this.submitWithdraw();
				}
			}
		},
		// 删除密码
		deletePassword(){
			if(this.password.length > 0){
				this.password = this.password.slice(0, -1);
			}
		},
		// 提现
		async submitWithdraw(){
			this.$refs['passwordPopup'].hide();
			this.$refs['loadingMsg'].show(this.getLanguage('提交中'));
			let result = await this.assetApi.cashWithdraw({
				amount:this.amount,
				cash_password:this.password
			});
			this.$refs['loadingMsg'].hide();
			if(!result.status) return this.showMsg(result.msg);
			let info = {
				msg:this.getLanguage('操作成功'),
				path:''
			};
			this.goPage('/pages/base/success?info=' + encodeURIComponent(JSON.stringify(info)),'redirect');
		},
		// 确认去绑定银行卡
		confirm(){
			this.$refs['confirm'].hide()
			this.goPage('/pages/mine/editWithdraw')
		},
		tipShow(){
			this.showMsg(this.getLanguage('抽中的现金存入该钱包，待抽中提现卡现金即可立即提现！'),3000);
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
	
	// 密码输入弹窗样式
	.password-popup{
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
			text-align:center;
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
		
		.password-input-box{
			display:flex;
			justify-content: center;
			align-items: center;
			gap:20rpx;
			margin:60rpx 0;
			
			.input-item{
				width:80rpx;
				height:80rpx;
				border:2rpx solid #3E4355;
				border-radius:12rpx;
				display:flex;
				justify-content: center;
				align-items: center;
				
				.dot{
					width:20rpx;
					height:20rpx;
					border-radius:50%;
					background:#EDAD4D;
				}
			}
		}
		
		.keyboard{
			.key-row{
				display:flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom:20rpx;
				
				.key{
					flex:1;
					height:100rpx;
					line-height:100rpx;
					text-align:center;
					background:#2A2D3E;
					border-radius:12rpx;
					margin:0 10rpx;
					font-size:40rpx;
					font-weight:600;
					
					&:first-child{
						margin-left:0;
					}
					
					&:last-child{
						margin-right:0;
					}
					
					&:active{
						background:#3E4355;
					}
					
					&.empty{
						background:transparent;
						pointer-events:none;
					}
					
					&.delete{
						font-size:36rpx;
					}
				}
			}
		}
	}
</style>
