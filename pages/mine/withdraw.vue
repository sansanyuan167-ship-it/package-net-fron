<template>
	<view class="page-container has-bottom">
		<com-page-title :title="getLanguage('提现')" />
		<view class="title-box">
			<view class="title bold">{{getLanguage('申请提现')}}</view>
			<view class="records text-green" @click="goPage('/pages/mine/assetRecords?type=WITHDRAW')">
				<text>{{getLanguage('提现记录')}}</text>
				<text class="open cuIcon-right"></text>
			</view>
		</view>
		<view class="info-bar panel-item">
			<view class="account">
				<view class="account-title">{{getLanguage('可提现余额')}}：</view>
				<view class="count bold">{{(bankInfo.withdraw_info && bankInfo.withdraw_info.can_total_withdraw) || 0}}</view>
			</view>
			<!-- <view class="channel">
				<view class="key bold">{{getLanguage('开户国家编码')}}</view>
				<view class="value">{{bankInfo.bank_country_code_name}}</view>
			</view>
			<view class="channel">
				<view class="key bold">{{getLanguage('开户银行编码')}}</view>
				<view class="value">{{bankInfo.bank_code_name}}</view>
			</view>
			<view class="channel">
				<view class="key bold">{{getLanguage('开户银行姓名')}}</view>
				<view class="value">{{bankInfo.bank_name}}</view>
			</view>
			<view class="channel">
				<view class="key bold">{{getLanguage('开户银行卡号')}}</view>
				<view class="value">{{bankInfo.bank_number}}</view>
			</view>
			<view class="channel">
				<view class="key bold">{{getLanguage('开户银行手机号')}}</view>
				<view class="value">{{bankInfo.bank_phone}}</view>
			</view>
			<view class="channel">
				<view class="key bold">{{getLanguage('开户银行邮箱')}}</view>
				<view class="value">{{bankInfo.bank_email}}</view>
			</view> -->
			<view class="amount">
				<view class="key bold">{{getLanguage('金额')}}</view>
				<input v-model="amount" type="text" :placeholder="getLanguage('请输入提现金额')" placeholder-style="color:#9D9B9B;">
			</view>
			<view class="notice text-red">{{getLanguage('提现手续费为 @REPLACE@').replace('@REPLACE@', (bankInfo.withdrawal_fee * 100).toFixed(2) + '%')}}</view>
		</view>
<!-- 		<view class="remark text-gray">
			<view class="title">描述说明：</view>
			<view class="content">
				<view>1. 工作服务时间：08:00 ~ 22:00。</view>
				<view>2. 如你遇到任何问题，可咨询平台客服。</view>
				<view>3. 我们将会第一时间协助你解答你的问题。</view>
			</view>
		</view> -->
		<com-service />
		<view class="bottom-btn">
			<view @click="showPasswordPopup">{{getLanguage('立即提现')}}</view>
		</view>
		<!-- START 选择渠道弹窗 -->
<!-- 		<com-popup ref="changeChannelPopup" model="bottom">
			<view class="change-channel-popup panel-bg">
				<text class="close cuIcon-close" @click="$refs['changeChannelPopup'].hide()"></text>
				<view class="popup-title">{{getLanguage('渠道')}}</view>
				<scroll-view scroll-y class="list">
					<view class="item" :class="{'active':item.id == currentChannel.id}" v-for="(item,index) in channelList" :key="index" @click="changeChannel(item)">
						<text>{{item.name}}</text>
					</view>
				</scroll-view>
			</view>
		</com-popup> -->
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
			:content="getLanguage('请完善提现信息后再操作')"
			@onCancel="$refs['confirm'].hide()" 
			@onConfirm="confirm" 
		/>
	</view>
</template>

<script>
export default {
	data() {
		return {
			have_empty:false,
			amount:'',
			currentChannel:{},
			bankInfo:{},
			channelList:[
				{id:1,name:'渠道一'},
				{id:2,name:'渠道二'},
				{id:3,name:'渠道三'}
				
			],
			password: '' // 提现密码
		};
	},
	async onLoad(options) {
	},
	onShow(){
		this.loadBankInfo()
	},
	methods: {
		async loadBankInfo(){
			let result = await this.assetApi.bankInfo();
			this.bankInfo=result.data
			if(result.status==1&&result.data.bank_code_name&&result.data.bank_name&&result.data.bank_number&&result.data.bank_phone&&result.data.bank_email&&result.data.bank_country_code_name){
				this.have_empty=false
			}else{
				this.have_empty=true
				this.$refs['confirm'].show();
			}
		},
		// 选择渠道
		changeChannel(item){
			this.currentChannel = item;
			this.$refs['changeChannelPopup'].hide();
		},
		// 确认去绑定银行卡
		confirm(){
			this.$refs['confirm'].hide()
			this.goPage('/pages/mine/editWithdraw')
		},
		// 显示密码输入弹窗
		showPasswordPopup(){
			// if(!this.currentChannel.id) return this.showMsg(this.getLanguage('请选择提现渠道'));
			if(!this.amount || this.amount <= 0) return this.showMsg(this.getLanguage('请输入提现金额'));
			if(this.amount > (this.bankInfo.withdraw_info && this.bankInfo.withdraw_info.can_total_withdraw)) return this.showMsg(this.getLanguage('可提现余额')+'：'+(this.bankInfo.withdraw_info && this.bankInfo.withdraw_info.can_total_withdraw),3000);
			if(!/^[0-9]+$/.test(this.amount)) return this.showMsg(this.getLanguage('提现金额必须为整数'));
			if(this.have_empty) return this.$refs['confirm'].show();
			
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
			let result = await this.assetApi.withdraw({
				amount:this.amount,
				cash_password:this.password
			});
			this.$refs['loadingMsg'].hide();
			if(!result.status) return this.showMsg(result.msg);
			let info = {
				msg:this.getLanguage('操作成功'),
				path:'/pages/mine/assetRecords?type=WITHDRAW'
			};
			this.goPage('/pages/base/success?info=' + encodeURIComponent(JSON.stringify(info)),'redirect');
		}
	}
};
</script>

<style lang="scss" scoped>
	.title-box{
		margin:40rpx 25rpx 25rpx 25rpx;
		display:flex;
		justify-content: space-between;
		align-items: center;
		.title{
			font-size:32rpx;
		}
		.records{
			font-size:28rpx;
			.open{
				margin-left:6rpx;
			}
		}
	}
	.info-bar{
		padding:40rpx 25rpx;
		.account{
			display:flex;
			justify-content: flex-start;
			align-items: center;
			.count{
				font-size:40rpx;
				display: inline-block;
				background-image: linear-gradient(to right bottom, #F7E3C1, #EDAD4D);
				-webkit-background-clip: text;
				color: transparent;
			}
		}
		.channel{
			display:flex;
			justify-content: flex-start;
			align-items: center;
			background:#212433;
			margin-top:30rpx;
			border-radius:20rpx;
			line-height:85rpx;
			overflow: hidden;
			.key{
				color:#333333;
				background:#C1A03E;
				width:250rpx;
				text-align:center;
				margin-right:20rpx;
				border-radius:0 50rpx 0 0;
			}
			.value{
				flex:1;
			}
			.open{
				margin-left:auto;
				margin-right:20rpx;
			}
		}
		.amount{
			display:flex;
			justify-content: flex-start;
			align-items: center;
			background:#212433;
			margin-top:30rpx;
			border-radius:20rpx;
			line-height:85rpx;
			overflow: hidden;
			.key{
				color:#333333;
				background:#C1A03E;
				width:150rpx;
				text-align:center;
				margin-right:20rpx;
				border-radius:0 50rpx 0 0;
			}
			input{
				flex:1;
			}
		}
		.notice{
			font-size:26rpx;
			margin-top:30rpx;
			text-align: center;
		}
	}
	.change-channel-popup{
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
				line-height:80rpx;
				&.active{
					color:#333333;
					font-weight:600;
					background:linear-gradient(to right bottom,#EDAD4D 0%,#D68B21 100%);
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
