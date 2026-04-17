<template>
	<view class="page-container">
		<com-page-title title="排行榜" :rightText="currentDate.name" @rightTextClick="$refs['changeDatePopup'].show()" />
		<view class="tabs">
			<tui-tab :current="current" :tabs="tabs" @change="change"></tui-tab>
		</view>
		<z-paging ref="paging" :refresher-only="true" defaultThemeStyle="white" :use-custom-refresher="true"
			@refresherStatusChange="refresherStatusChange" @onRefresh="queryList" @scroll="scrollFun">
			
			<view slot="top" :style="{
				height:`${pageTitleHeight + 80}rpx`
			}"></view>
			
			<view slot="refresher" class="refresher-container">
				<image class="image" src="/static/icon.png"></image>
				<text>{{refresherStatusText}}</text>
			</view>
			
			<view class="empty" v-if="noData">
				<image src="/static/empty-data.png"></image>
				<view>暂无数据哦 ~</view>
			</view>
			
			<view class="list-box">
				<view class="item panel-item" v-for="(item,index) in list" :key="index">
					<view class="number">{{index + 1}}</view>
					<image :src="item.avatar" mode="aspectFill"></image>
					<view class="info">
						<view class="name bold">{{item.username}}</view>
						<view class="msg">
							<view class="key-value">
								<view class="key">总充值</view>
								<view class="value">{{item.recharge_amount}}</view>
							</view>
							<view class="key-value">
								<view class="key">总投注</view>
								<view class="value">{{item.bet_amount}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view style="height:140rpx;"></view>
			<view class="my-ranking">
				<view class="num" v-if="info.ranking">{{info.ranking}}</view>
				<image :src="info.avatar"></image>
				<view class="info">
					<view class="key-value">
						<view class="key">总充值</view>
						<view class="value">{{(info.recharge_amount).toFixed(2)}}</view>
					</view>
					<view class="key-value">
						<view class="key">总投注</view>
						<view class="value">{{(info.bet_amount).toFixed(2)}}</view>
					</view>
				</view>
			</view>
		</z-paging>
		<!-- START 选择时间 -->
		<com-popup ref="changeDatePopup" model="bottom">
			<view class="change-date-popup panel-bg">
				<text class="close cuIcon-close" @click="$refs['changeDatePopup'].hide()"></text>
				<view class="popup-title">选择时间</view>
				<scroll-view scroll-y class="list">
					<view class="item" :class="{'active':item.key == currentDate.key}" v-for="(item,index) in date"
						:key="index" @click="changeDate(item)">
						<text>{{item.name}}</text>
					</view>
				</scroll-view>
			</view>
		</com-popup>
		<!-- END 选择时间 -->
		<com-page-loading ref="pageLoading" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			type:'RECHARGE',
			pageTitleHeight:96,
			refresherStatusText: this.getLanguage('继续下拉刷新'),
			current:0,
			tabs: [{
					type: 'RECHARGE',
					name: '充值'
				},
				{
					type: 'BET',
					name: '投注'
				}
			],
			info:{
				recharge_amount:0,
				bet_amount:0
			},
			list:[],
			noData:false,
			currentDate:{key:'today',name:'日榜'},
			date:[
				{key:'today',name:'日榜'},
				{key:'week',name:'周榜'},
				{key:'month',name:'月榜'}
			]
		};
	},
	async onLoad(options) {
		this.pageTitleHeight = await this.getPageTitleHeight();
		this.queryList();
	},
	onShow(){
		
	},
	methods: {
		//加载数据
		async queryList() {
			this.noData = false;
			this.$refs['pageLoading'].show();
			let result = await this.activityApi.rankingList({
				type:this.type,
				date:this.currentDate.key
			});
			this.list = result.data.list;
			this.info = result.data.user;
			this.$refs.paging.complete();
			this.$refs['pageLoading'].hide();
			this.noData = !this.list.length;
		},
		//下拉刷新状态改变
		refresherStatusChange(e) {
			//e=0 下拉刷新 （静默状态）
			//e=1 松开即刷新
			//e=2 正在刷新中
			if (e == 0) {
				this.refresherStatusText = this.getLanguage('继续下拉刷新');
			} else if (e == 1) {
				this.refresherStatusText = this.getLanguage('松开立即刷新');
			} else {
				this.refresherStatusText = this.getLanguage('正在刷新中');
			}
		},
		//页面滚动触发
		scrollFun(e){
			// console.log(e.detail.scrollTop);
		},
		change(e){
			console.log(e);
			this.type = e.item.type;
			this.list = [];
			this.queryList();
		},
		// 选择时间
		changeDate(item){
			this.currentDate = item;
			this.$refs['changeDatePopup'].hide();
			this.queryList();
		}
	}
};
</script>

<style lang="scss" scoped>
	.tabs {
		position: sticky;
		top:0;
		z-index: 50;
	}
	.list-box{
		.item{
			position:relative;
			padding:30rpx 25rpx;
			display:flex;
			justify-content: flex-start;
			align-items: center;
			.number{
				font-size:30rpx;
				width:60rpx;
				text-align:center;
				margin-right:10rpx;
			}
			image{
				width:100rpx;
				height:100rpx;
				margin-right:20rpx;
				border-radius:100rpx;
			}
			.info{
				flex:1;
				.name{
					display:flex;
					justify-content: flex-start;
					align-items: center;
					font-size:32rpx;
					display: inline-block;
					background-image: linear-gradient(to right bottom, #FDF13C, #FF8133);
					-webkit-background-clip: text;
					color: transparent;
				}
				.msg{
					font-size:26rpx;
					color:#C1C4CE;
					margin-top:10rpx;
					display:flex;
					justify-content: flex-start;
					align-items: center;
					gap:30rpx;
					.key-value{
						display:flex;
						justify-content: flex-start;
						align-items: center;
						gap:10rpx;
						width:100%;
						.value{
							color:#FF8133;
						}
					}
				}
			}
		}
	}
	@media screen and (min-width: 768px) {
		.my-ranking{
			width:500px !important;
			left:calc((100vw - 500px) / 2) !important;
		}
	}
	.my-ranking{
		position:fixed;
		width:100%;
		padding:30rpx;
		box-sizing: border-box;
		left:0;
		bottom:0;
		display:flex;
		justify-content: flex-start;
		align-items: center;
		background: #EA7458;
		background: linear-gradient(to right bottom, #EA7458 0%, #C64B2E 100%);
		border-radius:40rpx 40rpx 0 0;
		.num{
			font-size:36rpx;
			font-weight:600;
			margin-right:20rpx;
		}
		image{
			width:80rpx;
			height:80rpx;
			border-radius:100rpx;
			margin-right:20rpx;
			border:3rpx solid rgba(236,218,33,0.6);
			box-sizing: border-box;
		}
		.info{
			font-size:28rpx;
			.key-value{
				display:flex;
				justify-content: flex-start;
				align-items: center;
				gap:10rpx;
				.value{
					color:#EAFFE5;
					font-weight:600;
				}
			}
		}
	}
	.change-date-popup {
		position: relative;
		border-radius: 30rpx 30rpx 0 0;
		padding: 30rpx;
		padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
	
		.close {
			position: absolute;
			top: 10rpx;
			right: 10rpx;
			z-index: 10;
			width: 60rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
		}
	
		.popup-title {
			position: relative;
			font-size: 32rpx;
			padding-bottom: 30rpx;
	
			&::after {
				content: '';
				display: block;
				width: 100%;
				height: 2rpx;
				background: linear-gradient(to right, transparent 0%, #3E4355 50%, transparent 100%);
				position: absolute;
				bottom: -1rpx;
				left: 0;
			}
		}
	
		.list {
			margin-top: 30rpx;
			max-height: 600rpx;
	
			.item {
				border: 1rpx solid #3E4355;
				border-radius: 20rpx;
				margin-bottom: 20rpx;
				line-height: 80rpx;
	
				&.active {
					color: #333333;
					font-weight: 600;
					background: linear-gradient(to right bottom, #EDAD4D 0%, #D68B21 100%);
				}
			}
		}
	}
	.empty{
		text-align:center;
		margin-top:80rpx;
		font-size:26rpx;
		opacity: 0.8;
		image{
			display:block;
			width:250rpx;
			height:250rpx;
			margin:0 auto;
		}
	}
</style>
