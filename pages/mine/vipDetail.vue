<template>
	<view class="page-container">
		<com-page-title :title="getLanguage('VIP权益介绍')" :bgColor="bgColor" :showShadow="showShadow" />
		<view class="header-bg">
			<image class="bg" src="/static/vip-icons/vip-bg.png" :style="{
				top:`-${pageTitleHeight}rpx`
			}"></image>
		</view>
		<view class="table">
			<view class="title bold">
				<view>{{getLanguage('等级')}}</view>
				<view>{{getLanguage('升级条件')}}</view>
				<view>{{getLanguage('权益介绍')}}</view>
			</view>
			<view class="line" v-for="(item,index) in list" :key="index">
				<view class="item">
					<view class="bold">{{item.name}}</view>
				</view>
				<view class="item">
					<view>{{getLanguage('充值')}}：{{retainDecimals(item.recharge_amount,2)}}</view>
					<view>{{getLanguage('投注')}}：{{retainDecimals(item.recharge_amount,2)}}</view>
				</view>
				<view class="item">
					<view>{{getLanguage('A级好友分佣')}}：{{retainDecimals((item.level_a_rate * 100).toFixed(5),2)}}%</view>
					<view>{{getLanguage('B级好友分佣')}}：{{retainDecimals((item.level_b_rate * 100).toFixed(5),2)}}%</view>
					<view>{{getLanguage('提现手续费')}}：{{retainDecimals(item.withdrawal_fee * 100,2)}}%</view>
				</view>
			</view>
		</view>
		<com-page-loading ref="pageLoading" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageTitleHeight: 96,
				bgColor:'transparent',
				showShadow:false,
				list:[]
			}
		},
		onPageScroll(e) {
		    let top = e.scrollTop;
		    if(top > 30){
		    	this.bgColor = '#212F3F';
		    	this.showShadow = true;
		    }else{
		    	this.bgColor = 'transparent';
		    	this.showShadow = false;
		    }
		},
		async onLoad(options) {
			this.pageTitleHeight = await this.getPageTitleHeight();
			await this.getVipList();
			this.$nextTick(() => {
				this.$refs['pageLoading'].hide();
			});
		},
		onShow() {
			
		},
		methods: {
			// 获取VIP列表
			async getVipList(){
				let result = await this.userApi.getVipList();
				this.list = result.data.list;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.header-bg{
		position:relative;
		.bg{
			position:absolute;
			width:100%;
			height:680rpx;
			top:-96rpx;
			left:0;
			border-radius:0 0 30rpx 30rpx;
		}
	}
	.table{
		position:relative;
		margin:30rpx 25rpx;
		border:1rpx solid #F2DF26;
		border-radius:0 0 20rpx 20rpx;
		background:rgba(255,255,255,0.01);
		.title{
			display:flex;
			justify-content: space-between;
			align-items: center;
			text-align:center;
			view{
				width:40%;
				box-sizing: border-box;
				color:#632600;
				background: #FBE82F;
				background: linear-gradient(to right, #FFEBBF 0%, #EAC064 50%, #FFEBBF 100%);
				line-height:80rpx;
				font-size:30rpx;
				border-right:1rpx solid #F2DF26;
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
			border-top:1rpx solid #F2DF26;
			.item{
				width:40%;
				box-sizing: border-box;
				padding:20rpx 15rpx;
				border-right:1rpx solid #F2DF26;
				display:flex;
				justify-content: center;
				align-items: flex-start;
				flex-direction: column;
				font-size:26rpx;
				&:nth-child(1){
					width:20%;
					font-size:30rpx;
				}
				&:last-child{
					border-right:none;
				}
				
			}
		}
	}
</style>
