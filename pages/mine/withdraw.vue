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
				<view class="count bold">{{bankInfo.coin || 0}}</view>
			</view>
			<view class="channel">
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
			</view>
			<view class="amount">
				<view class="key bold">{{getLanguage('金额')}}</view>
				<input v-model="amount" type="text" :placeholder="getLanguage('请输入提现金额')" placeholder-style="color:#9D9B9B;">
			</view>
			<view class="notice text-red">提现手续费为:{{bankInfo.withdrawal_fee || 0}}</view>
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
			<view @click="withdraw">{{getLanguage('立即提现')}}</view>
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
		<com-loading-msg ref="loadingMsg" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			amount:'',
			currentChannel:{},
			bankInfo:{},
			channelList:[
				{id:1,name:'渠道一'},
				{id:2,name:'渠道二'},
				{id:3,name:'渠道三'}
				
			]
		};
	},
	async onLoad(options) {
		this.loadBankInfo()
	},
	onShow(){
		
	},
	methods: {
		loadBankInfo(){
			this.assetApi.bankInfo().then(res=>{
				if(res.status==1){
					this.bankInfo=res.data
					// 空值判断
					let obj=[
					  "bank_country_code_name",
					  "bank_code_name",
					  "bank_number",
					  "bank_name",
					  "bank_phone",
					  "bank_email"
					]
					let have_empty=false;
					for(let i=0;i<obj.length;i++){
						let k=obj[i]
						if(res.data[k]==''){
							have_empty=true;
							break;
						}
					}
					if(have_empty){
						uni.showToast({
							icon:"none",
							title:this.getLanguage('请完善提现信息后再操作'),
							duration:3000,
							success:()=>{
								uni.redirectTo({
									url:"/pages/mine/editWithdraw"
								})
							}
						})
					}
				}
			});
		},
		// 选择渠道
		changeChannel(item){
			this.currentChannel = item;
			this.$refs['changeChannelPopup'].hide();
		},
		// 提现
		async withdraw(){
			// if(!this.currentChannel.id) return this.showMsg(this.getLanguage('请选择提现渠道'));
			if(!this.amount) return this.showMsg(this.getLanguage('请输入提现金额'));
			if(!/^[0-9]+$/.test(this.amount)) return this.showMsg(this.getLanguage('提现金额必须为整数'));
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
</style>
