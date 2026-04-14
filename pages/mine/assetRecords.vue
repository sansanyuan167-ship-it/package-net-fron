<template>
	<view class="page-container">
		<com-page-title :title="getLanguage('资产记录')" />
		<view class="tabs">
			<tui-tab :current="current" :tabs="tabs" @change="change"></tui-tab>
		</view>
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
				height:`${pageTitleHeight + 80}rpx`
			}"></view>
			
			<view slot="refresher" class="refresher-container">
				<image class="image" src="/static/icon.png"></image>
				<text>{{refresherStatusText}}</text>
			</view>
			
			<view class="list-box" v-if="type == 'RECHARGE'">
				<view class="item panel-item" v-for="(item,index) in list" :key="index">
					<image class="icon" src="/static/mine-icons/recharge.png"></image>
					<view class="info">
						<view class="title">
							<text>{{getLanguage('充值金额')}}：</text>
							<text class="count bold">{{(parseFloat(item.amount) + parseFloat(item.bonus)).toFixed(2)}}</text>
						</view>
						<view class="msg-box">
							<view class="line">
								<view class="key">{{getLanguage('实付款')}}：</view>
								<view class="value text-red">{{item.amount}}</view>
							</view>
							<view class="line">
								<view class="key">{{getLanguage('时间')}}：</view>
								<view class="value">{{item.create_time}}</view>
							</view>
							<view class="line">
								<view class="key">{{getLanguage('订单号')}}：</view>
								<view class="value">{{item.order_number}}</view>
								<image class="copy" src="/static/copy.png" @click="copyText(item.order_number)"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="list-box" v-if="type == 'WITHDRAW'">
				<view class="item panel-item" v-for="(item,index) in list" :key="index">
					<image class="icon" src="/static/mine-icons/withdraw.png"></image>
					<view class="info">
						<view class="title">
							<text>{{getLanguage('提现金额')}}：</text>
							<text class="count bold">{{item.coin}}</text>
						</view>
						<view class="msg-box">
							<view class="line">
								<view class="key">{{getLanguage('到账金额')}}：</view>
								<view class="value text-red">{{item.amount}}</view>
							</view>
							<view class="line">
								<view class="key">{{getLanguage('时间')}}：</view>
								<view class="value">{{item.create_time}}</view>
							</view>
							<view class="line">
								<view class="key">{{getLanguage('订单号')}}：</view>
								<view class="value">{{item.order_number}}</view>
								<image class="copy" src="/static/copy.png" @click="copyText(item.order_number)"></image>
							</view>
							<view class="line" v-if="item.remark">
								<view class="key">{{getLanguage('备注')}}：</view>
								<view class="value">{{item.remark}}</view>
							</view>
							<view class="line" v-if="item.images.length">
								<view class="key">{{getLanguage('图片')}}：</view>
								<view class="value">
									<image :src="v" mode="aspectFill" v-for="(v,i) in item.images" :key="i" @click="previewImage(v,item.images)"></image>
								</view>
							</view>
						</view>
						<view class="status text-orange" v-if="item.status == 'UNDER_REVIEW'">{{getLanguage('审核中')}}</view>
						<view class="status text-green" v-else-if="item.status == 'APPROVED'">{{getLanguage('已到账')}}</view>
						<view class="status text-red" v-else>{{getLanguage('已拒绝')}}</view>
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
			type:'',
			title:'',
			pageTitleHeight:96,
			isRefresh:true, //用于记录是否整个页面数据加载刷新
			refresherStatusText: this.getLanguage('继续下拉刷新'),
			current:0,
			tabs: [{
					type: 'RECHARGE',
					name: this.getLanguage('充值记录')
				},
				{
					type: 'WITHDRAW',
					name: this.getLanguage('提现记录')
				}
			],
			list:[]
		};
	},
	async onLoad(options) {
		this.type = options.type || 'RECHARGE';
		this.current = this.type == 'RECHARGE' ? 0 : 1;
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
			let result = await this.assetApi.ordersRecords({
				type:this.type,
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
		},
		change(e){
			// console.log(e);
			this.list = [];
			this.type = e.item.type;
			this.$refs.paging.reload();
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
			align-items: flex-start;
			.icon{
				width:60rpx;
				height:60rpx;
				margin-right:20rpx;
			}
			.info{
				flex:1;
				.title{
					display:flex;
					justify-content: flex-start;
					align-items: center;
					.count{
						font-size:34rpx;
						display: inline-block;
						background-image: linear-gradient(to right bottom, #F7E3C1, #EDAD4D);
						-webkit-background-clip: text;
						color: transparent;
					}
				}
				.msg-box{
					padding-top:10rpx;
					.line{
						font-size:28rpx;
						margin-top:10rpx;
						line-height:40rpx;
						display:flex;
						justify-content: flex-start;
						align-items: flex-start;
						.key{
							
						}
						.value{
							flex:1;
							display:flex;
							justify-content: flex-start;
							flex-wrap: wrap;
							gap:20rpx;
							image{
								width:100rpx;
								height:100rpx;
								border-radius:12rpx;
							}
						}
						.copy{
							width:40rpx;
							height:40rpx;
						}
					}
				}
			}
			.status{
				position:absolute;
				top:25rpx;
				right:25rpx;
				font-size:26rpx;
			}
		}
	}
</style>
