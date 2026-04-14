<template>
	<view class="page-container">
		<com-page-title title="邀请奖励记录" />
		<z-paging ref="paging" auto-show-back-to-top show-loading-more-when-reload :back-to-top-threshold="300" defaultThemeStyle="white"
		:loading-more-default-text="getLanguage('点击加载更多')"
		:loading-more-loading-text="getLanguage('正在加载')"
		:loading-more-no-more-text="getLanguage('没有更多了')"
		:empty-view-text="getLanguage('暂时没有任何数据')"
			:back-to-top-img="iconHost('go-top.png')" :back-to-top-style="{
			width:`80rpx`,
			height:`80rpx`,
			bottom:`30rpx`,
			right:`25rpx`,
			background:`#fff`,
			borderRadius:`100%`,
			boxShadow:`0 0 10rpx 0 #e3e3e3`
		}" :default-page-no="1" :default-page-size="10" v-model="list" @query="queryList" :use-custom-refresher="true"
			@refresherStatusChange="refresherStatusChange" @onRefresh="refresh" @scroll="scrollFun">
			
			<view slot="top" :style="{
				height:`${pageTitleHeight}rpx`
			}"></view>
			
			<view slot="refresher" class="refresher-container">
				<image class="image" src="/static/icon.png"></image>
				<text>{{refresherStatusText}}</text>
			</view>
			
			<view class="list-box">
				<view class="item panel-item" v-for="(item,index) in list" :key="index">
					<image :src="
					item.type == 'LOTTERY' ?
					'/static/activity/lottery-wallet.png' :
					'/static/activity/lottery-card.png'"></image>
					<view class="info">
						<view class="title">{{typeList[item.type]}}</view>
						<view class="time">{{item.create_time}}</view>
					</view>
					<view class="amount">{{item.amount}}</view>
				</view>
			</view>
			
		</z-paging>
	</view>
</template>

<script>
export default {
	data() {
		return {
			typeList:{
				'LOTTERY':'抽奖获得',
				'WITHDRAW':'奖励提现'
			},
			pageTitleHeight:96,
			isRefresh:true, //用于记录是否整个页面数据加载刷新
			refresherStatusText: this.getLanguage('继续下拉刷新'),
			list:[]
		};
	},
	async onLoad(options) {
		this.pageTitleHeight = await this.getPageTitleHeight();
	},
	onShow(){
		
	},
	methods: {
		//加载数据
		async queryList(pageNo, pageSize) {
			if(this.isRefresh){
				// console.log('整页面刷新');
			}else{
				// console.log('仅列表加载');
			}
			let result = await this.activityApi.walletRecordsPage({
				page:pageNo,
				limit:pageSize
			});
			this.$refs.paging.complete(result.data);
			this.isRefresh = false;
		},
		//触发下拉刷新
		refresh() {
			console.log('下拉刷新触发');
			this.isRefresh = true;
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
		}
	}
};
</script>

<style lang="scss" scoped>
	.list-box{
		.item{
			padding:30rpx 20rpx;
			display:flex;
			justify-content: flex-start;
			align-items: center;
			image{
				width:100rpx;
				height:100rpx;
				margin-right:10rpx;
			}
			.info{
				.title{
					font-size:30rpx;
				}
				.time{
					font-size:28rpx;
					margin-top:10rpx;
				}
			}
			.amount{
				margin-left:auto;
				font-size:36rpx;
				font-weight:600;
				color:#FDF13C;
			}
		}
	}
</style>
