<template>
	<view class="page-container">
		<com-page-title :title="getLanguage('排行榜')" :rightText="currentDate.name" @rightTextClick="$refs['changeDatePopup'].show()" bgColor="rgba(33,47,63,0.6)" />
		<view class="bg">
			<image src="/static/ranking/ranking-bg.png" mode="aspectFill"></image>
		</view>
		<view class="tabs panel-item" :class="'tab-index-' + current">
			<tui-tab :current="current" :tabs="tabs" @change="change" backgroundColor="rgba(33,47,63,0.6)"></tui-tab>
		</view>
		<view class="cup-container">
			<image src="/static/ranking/ranking-cup.png" mode="aspectFit"></image>
		</view>
		<z-paging id="paging" ref="paging" :refresher-only="true" defaultThemeStyle="white" :use-custom-refresher="true"
			@refresherStatusChange="refresherStatusChange" @onRefresh="queryList" @scroll="scrollFun">
			
			<view slot="top" :style="{
				height:`${pageTitleHeight + 450}rpx`
			}"></view>
			
			<view slot="refresher" class="refresher-container">
				<image class="image" src="/static/icon.png"></image>
				<text>{{refresherStatusText}}</text>
			</view>
			
			<view class="empty" v-if="noData">
				<image src="/static/empty-data.png"></image>
				<view>{{getLanguage('暂无数据哦 ~')}}</view>
			</view>
			
			<view class="list-box">
				<view class="item panel-item" v-for="(item,index) in list" :key="index" :class="{'top-three': index < 3}">
					<view class="number" :class="{'rank-1': index == 0, 'rank-2': index == 1, 'rank-3': index == 2, 'other-rank': index >= 3}">
						{{index + 1}}
						<image v-if="index == 0" mode="aspectFill" src="/static/ranking/ranking-gold.png"></image>
						<image v-if="index == 1" mode="aspectFill" src="/static/ranking/ranking-silver.png"></image>
						<image v-if="index == 2" mode="aspectFill" src="/static/ranking/ranking-bronze.png"></image>
					</view>
					<view class="avatar-box"> 
						<image :src="item.avatar" mode="aspectFill"></image>
						<!-- <view class="name bold">{{item.username}}</view> -->
					</view>
					<view class="info">
						<view class="msg">
							<view class="key-value">
								<view class="key">{{getLanguage('总充值')}}</view>
								<view class="value">{{item.recharge_amount}}</view>
							</view>
							<view class="key-value">
								<view class="key">{{getLanguage('总投注')}}</view>
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
						<view class="key">{{getLanguage('总充值')}}</view>
						<view class="value">{{(info.recharge_amount).toFixed(2)}}</view>
					</view>
					<view class="middle" style="height: 10rpx;"></view>
					<view class="key-value">
						<view class="key">{{getLanguage('总投注')}}</view>
						<view class="value">{{(info.bet_amount).toFixed(2)}}</view>
					</view>
				</view>
			</view>
		</z-paging>
		<!-- START 选择时间 -->
		<com-popup ref="changeDatePopup" model="bottom">
			<view class="change-date-popup panel-bg">
				<text class="close cuIcon-close" @click="$refs['changeDatePopup'].hide()"></text>
				<view class="popup-title">{{getLanguage('选择时间')}}</view>
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
					name: this.getLanguage('充值')
				},
				{
					type: 'BET',
					name: this.getLanguage('投注')
				}
			],
			info:{
				recharge_amount:0,
				bet_amount:0
			},
			list:[],
			noData:false,
			currentDate:{key:'today',name:this.getLanguage('日榜')},
			date:[
				{key:'today',name:this.getLanguage('日榜')},
				{key:'week',name:this.getLanguage('周榜')},
				{key:'month',name:this.getLanguage('月榜')}
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
			this.current = e.index;
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
	.tabs {
		width: 600rpx;
		position: sticky;
		border-radius: 52rpx;
		top:0;
		z-index: 50;
		margin-left: auto;
		margin-right: auto;
		
		// 根据current值动态给选中的tab项添加背景色
		&.tab-index-0 {
			::v-deep .tui-tabs__item:first-child {
				background: linear-gradient(90deg, #E67A06 0%, #FFE81A 50%, #ED9A26 100%) !important;
				box-shadow: inset 0rpx 0rpx 19rpx 0rpx rgba(255,255,255,0.78) !important;
				border-radius: 52rpx !important;
				.tui-item__child{
					font-family: Source Han Sans SC, Source Han Sans SC;
					font-weight: 800 !important;
					font-size: 32rpx !important;
					color: #FFFFFF !important;
					text-shadow: 
						-1rpx -1rpx 0 #943900,
						1rpx -1rpx 0 #943900,
						-1rpx 1rpx 0 #943900,
						1rpx 1rpx 0 #943900,
						0px 4px 8px rgba(0,0,0,0.54) !important;
					text-align: center;
					font-style: normal;
					text-transform: none;
				}
			}
		}
		
		&.tab-index-1 {
			::v-deep .tui-tabs__item:last-child {
				background: linear-gradient(90deg, #E67A06 0%, #FFE81A 50%, #ED9A26 100%) !important;
				box-shadow: inset 0rpx 0rpx 19rpx 0rpx rgba(255,255,255,0.78) !important;
				border-radius: 52rpx !important;
				.tui-item__child{
					font-family: Source Han Sans SC, Source Han Sans SC;
					font-weight: 800 !important;
					font-size: 32rpx !important;
					color: #FFFFFF !important;
					text-shadow: 
						-1rpx -1rpx 0 #943900,
						1rpx -1rpx 0 #943900,
						-1rpx 1rpx 0 #943900,
						1rpx 1rpx 0 #943900,
						0px 4px 8px rgba(0,0,0,0.54) !important;
					text-align: center;
					font-style: normal;
					text-transform: none;
				}
			}
		}
	}
	
	.cup-container {
		position: absolute;
		top: 34rpx;
		left: 50%;
		transform: translateX(-50%);
		
		image {
			width: 600rpx;
			height: 600rpx;
		}
	}
	.list-box{
		.item{
			position:relative;
			padding:28rpx 24rpx;
			display:flex;
			justify-content: flex-start;
			align-items: center;
			margin: 0 20rpx 20rpx;
			background: linear-gradient( 0deg, #FAF3CD 0%, #EDD7AE 100%);
			box-shadow: 0rpx 4rpx 6rpx 0rpx #EB9B31;
			border-radius: 34rpx 34rpx 34rpx 34rpx;
			&.top-three {
				background: linear-gradient( 180deg, #FFB742 0%, #FFF7AF 100%);
			}
			.avatar-box{
				display: flex;
				align-items: center;
				justify-content: center;
				image{
					width:80rpx;
					height:80rpx;
					margin-right:10rpx;
					border-radius:50%;
				}
				.name{
					// display:flex;
					// justify-content: flex-start;
					// align-items: center;
					// font-size:32rpx;
					// display: inline-block;
					color: #ffffff;
					-webkit-text-stroke: 2rpx #652903;
				}
			}
			.number{
				font-size:28rpx;
				width:60rpx;
				height:60rpx;
				text-align:center;
				line-height:56rpx;
				margin-right:30rpx;
				image{
					position: absolute;
					left: 24rpx;
					top: -4rpx;
					border-radius: unset;
					width: 72rpx;
					height: 110rpx;
				}
				&.other-rank {
					background: #eab441;
					border-radius: 50%;
					color: white;
					border: 1rpx solid #FFFFFF; 
					box-sizing: border-box;
					-webkit-text-stroke: 1.3rpx #652903;
					font-weight: 600;
					
				}
			}
			.info{
				flex:1;
				.msg{
					font-size:24rpx;
					color:#e07033;
					// margin-top:10rpx;
					// display:flex;
					// justify-content: flex-start;
					// align-items: center;
					gap:30rpx;
					.key-value{
						display:flex;
						justify-content: flex-start;
						align-items: center;
						gap:10rpx;
						width:100%;
						.value{
							color:#a44512;
							font-weight:600;
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
		background: linear-gradient( 88deg, #E67A06 0%, #FFE81A 50%, #ED9A26 100%);
		box-shadow: inset 0rpx 0rpx 19rpx 0rpx rgba(255,255,255,0.78);
		border-radius: 52rpx 52rpx 0rpx 0rpx;
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
			color: #ffffff;
			font-size:44rpx;
			font-weight: bold;
			.key-value{
				display:flex;
				justify-content: flex-start;
				align-items: center;
				gap:10rpx;
				.key{
					text-shadow: 
						-1rpx -1rpx 0 #943900,
						1rpx -1rpx 0 #943900,
						-1rpx 1rpx 0 #943900,
						1rpx 1rpx 0 #943900;
				}
				.value{
					color:#EAFFE5;
					font-weight:600;
					text-stroke: 2rpx #652903;
					-webkit-text-stroke: 2rpx #652903;
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
