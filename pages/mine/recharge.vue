<template>
	<view class="page-container has-bottom">
		<com-page-title :title="getLanguage('充值')" />
		<view class="title-box">
			<view class="title bold">{{getLanguage('选择充值金额')}}</view>
			<view class="records text-green" @click="goPage('/pages/mine/assetRecords?type=RECHARGE')">
				<text>{{getLanguage('充值记录')}}</text>
				<text class="open cuIcon-right"></text>
			</view>
		</view>
		<view class="items">
			<view class="item transition panel-bg" :class="{active:currentItem.id == item.id}" v-for="(item,index) in items" :key="index" @click="changeItem(item)">
				<image class="hot" src="/static/hot.png" v-if="item.is_hot"></image>
				<view class="amount bold">{{parseFloat(item.amount)}}</view>
				<view class="total" v-if="isFirstRecharge">{{getLanguage('获得')}} {{parseFloat(item.bonus) ? `${parseFloat(item.coin)} + ${parseFloat(item.bonus)}` : `${parseFloat(item.coin)}`}}</view>
				<view class="total" v-else>{{getLanguage('获得')}} {{parseFloat(item.coin)}}</view>
			</view>
		</view>
		<view class="title-box">
			<view class="title bold">{{getLanguage('自定义充值金额')}}</view>
			<view class="records text-red" v-if="activityId" @click="goPage('/pages/game/activityDetail?id='+activityId)">
				<text>{{getLanguage('活动规则')}} </text>
				<text class="question cuIcon-question"></text>
			</view>
		</view>
		<view class="input-box">
			<input class="panel-bg" v-model="amount"  @input="inputChange" type="text" :placeholder="getLanguage('请输入充值金额')" placeholder-style="color:#9D9B9B;">
			<view class="info text-red">{{getLanguage('最小充值金额为 @REPLACE@',mini_recharge_amount)}}</view>
		</view>

		<com-service />
		<view class="bottom-btn">
			<view @click="recharge">{{getLanguage('立即充值')}}</view>
		</view>
		<com-page-loading ref="pageLoading" />
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
			id:null,
			activityId:null,
			// 自定义充值金额
			amount:'',
			have_empty:false,
			bankInfo:{},
			isFirstRecharge:false,
			mini_recharge_amount:0,
			currentItem:{id:1,amount:5,total:50,hot:true},
			items:[]
		};
	},
	async onLoad(options) {
		this.id = options.id || null;
		await this.getRechargeItems();
		this.$nextTick(() => {
			this.$refs['pageLoading'].hide();
		});
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
		// 确认去绑定银行卡
		confirm(){
			this.$refs['confirm'].hide()
			this.goPage('/pages/mine/editWithdraw')
		},
		// 获取充值选项列表
		async getRechargeItems(){
			let result = await this.assetApi.rechargeItems();
			this.isFirstRecharge = result.data.is_first_recharge;
			this.mini_recharge_amount=result.data.mini_recharge_amount;
			this.activityId = result.data.recharge_activity_id;
			this.items = result.data.list;
			let activeItem = this.items.find(item => item.id == this.id);
			if(!activeItem) activeItem = this.items[0];
			this.currentItem = activeItem;
			console.log(activeItem);
		},
		// 选择充值金额
		changeItem(item){
			this.currentItem = item;
			this.amount = '';
		},
		// 自定义充值数量输入框输入
		inputChange(e) {
			if (e.detail.value) this.currentItem = {};
		},
		async recharge(){
			if(!this.currentItem.id && !this.amount) return this.showMsg('请输入充值金额');
			if(!this.currentItem.id && !/^[0-9]+$/.test(this.amount)) return this.showMsg('充值金额必须为整数');
			let data = {};
			if(this.currentItem.id){ // 套餐充值金额
				data = {
					id:this.currentItem.id
				}
			}else{ // 自定义充值金额
				data = {
					amount:this.amount
				}
			}
			if(this.have_empty) return this.$refs['confirm'].show();
			this.$refs['loadingMsg'].show(this.getLanguage('提交中'));
			let result = await this.assetApi.recharge(data);
			this.$refs['loadingMsg'].hide();
			if(!result.status) return this.showMsg(result.msg);
			let info = {
				msg:this.getLanguage('操作成功'),
				path:result.data.pay_url///pages/mine/assetRecords?type=RECHARGE
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
	.items{
		margin:25rpx;
		display:flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		gap:20rpx;
		.item{
			position:relative;
			width:calc((100% - 40rpx) / 3);
			box-sizing: border-box;
			padding:25rpx 10rpx;
			text-align:center;
			border-radius:20rpx;
			overflow: hidden;
			.hot{
				position:absolute;
				top:0;
				left:0;
				width:60rpx;
				height:50rpx;
			}
			.amount{
				font-size:40rpx;
			}
			.total{
				font-size:28rpx;
				margin-top:15rpx;
				color:#E4A875;
			}
			&.active{
				background: #4D3E31;
				background: linear-gradient(to right bottom, #4D3E31 0%, #E6B139 100%);
				color:#F5F7FC;
				.total{
					color:#F5F7FC;
				}
			}
		}
	}
	.input-box{
		margin:30rpx 25rpx;
		input{
			border:1rpx solid #704B24;
			height:90rpx;
			border-radius:20rpx;
			padding:0 20rpx;
			box-sizing: border-box;
			width:100%;
		}
		.info{
			margin-top:20rpx;
			font-size:26rpx;
		}
	}
</style>
