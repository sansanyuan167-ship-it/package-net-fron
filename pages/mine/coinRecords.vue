<template>
	<view class="page-container">
		<com-page-title :title="getLanguage('余额明细')" />
		<view class="tabs">
			<tui-tab :scroll="true" :current="current" :tabs="tabs" @change="change"></tui-tab>
		</view>
		<z-paging ref="paging" auto-show-back-to-top show-loading-more-when-reload :back-to-top-threshold="300"
			defaultThemeStyle="white" :loading-more-default-text="getLanguage('点击加载更多')"
			:loading-more-loading-text="getLanguage('正在加载')" :loading-more-no-more-text="getLanguage('没有更多了')"
			:empty-view-text="getLanguage('暂时没有任何数据')" :back-to-top-img="iconHost('go-top.png')" :back-to-top-style="{
			width:`80rpx`,
			height:`80rpx`,
			bottom:`30rpx`,
			right:`25rpx`,
			background:`#fff`,
			borderRadius:`100%`,
			boxShadow:`0 0 10rpx 0 #e3e3e3`
		}" :default-page-no="1" :default-page-size="20" v-model="list" @query="queryList" :use-custom-refresher="true"
			@refresherStatusChange="refresherStatusChange" @onRefresh="refresh" @scroll="scrollFun">

			<view slot="top" :style="{
				height:`${pageTitleHeight + 80}rpx`
			}"></view>

			<view slot="refresher" class="refresher-container">
				<image class="image" src="/static/icon.png"></image>
				<text>{{refresherStatusText}}</text>
			</view>

			<view class="list-box">
				<view class="item panel-item" v-for="(item,index) in list" :key="index">
					<view>
						<text class="key">{{getLanguage('变动类型')}}：</text>
						<text class="value text-orange" v-if="item.type == 'BET'">{{getLanguage('投注')}}</text>
						<text class="value text-blue" v-if="item.type == 'RECHARGE'">{{getLanguage('充值')}}</text>
						<text class="value text-yellow" v-if="item.type == 'LOTTERY'">{{getLanguage('抽奖')}}</text>
						<text class="value text-green" v-if="item.type == 'WITHDRAW'">{{getLanguage('提现')}}</text>
						<text class="value text-green" v-if="item.type == 'RETURN'">{{getLanguage('俱乐部返利')}}</text>
						<text class="value text-green" v-if="item.type == 'SELF_RETURN'">{{getLanguage('每日返利')}}</text>
					</view>
					<view>
						<text class="key">{{getLanguage('变动金额')}}：</text>
						<text class="value">{{item.amount}}</text>
					</view>
					<view v-if="item.type == 'BET'">
						<text class="key">{{getLanguage('游戏名称')}}：</text>
						<text class="value ell1">{{item.game_name}}</text>
						<text class="play-again text-blue"
							@click="goPage('/pages/game/gameView?id='+item.game_id)">{{getLanguage('继续玩')}}</text>
					</view>
					<view v-if="item.type == 'BET'">
						<text class="key">{{getLanguage('投注金额')}}：</text>
						<text class="value text-red">{{item.bet_amount}}</text>
					</view>
					<view v-if="item.type == 'BET'">
						<text class="key">{{getLanguage('盈利金额')}}：</text>
						<text class="value text-green">{{item.win_amount}}</text>
					</view>
					<view>
						<text class="key">{{getLanguage('变动后余额')}}：</text>
						<text class="value">{{item.balance}}</text>
					</view>
					<view>
						<text class="key">{{getLanguage('变动时间')}}：</text>
						<text class="value">{{item.create_time}}</text>
					</view>
				</view>
			</view>

		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: '',
				title: '',
				pageTitleHeight: 96,
				isRefresh: true, //用于记录是否整个页面数据加载刷新
				refresherStatusText: this.getLanguage('继续下拉刷新'),
				current: 0,
				tabs: [{
						type: '',
						name: this.getLanguage('全部')
					}, {
						type: 'BET',
						name: this.getLanguage('投注')
					},
					{
						type: 'RECHARGE',
						name: this.getLanguage('充值')
					}, {
						type: 'LOTTERY',
						name: this.getLanguage('抽奖')
					}, {
						type: 'WITHDRAW',
						name: this.getLanguage('提现')
					}, {
						type: 'RETURN',
						name: this.getLanguage('俱乐部返利')
					},{
						type:'SELF_RETURN',
						name: this.getLanguage('每日返利')
					}
				],
				list: []
			};
		},
		async onLoad(options) {
			this.pageTitleHeight = await this.getPageTitleHeight();
		},
		onShow() {

		},
		methods: {
			//加载数据
			async queryList(pageNo, pageSize) {
				if (this.isRefresh) {
					// console.log('整页面刷新');
				} else {
					// console.log('仅列表加载');
				}
				let result = await this.assetApi.userCoinRecords({
					type: this.type,
					page: pageNo,
					limit: pageSize
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
			scrollFun(e) {
				// console.log(e.detail.scrollTop);
			},
			change(e) {
				console.log(e);
				this.type = e.item.type;
				this.$refs.paging.reload();
			}
		}
	};
</script>

<style lang="scss" scoped>
	.tabs {
		position: sticky;
		top: 0;
		z-index: 50;
	}

	.list-box {
		.item {
			padding: 30rpx 25rpx;

			view {
				line-height: 46rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;

				.value {
					flex: 1;
				}

				.play-again {
					text-decoration: underline;
					margin-left: 10rpx;
				}
			}
		}
	}
</style>