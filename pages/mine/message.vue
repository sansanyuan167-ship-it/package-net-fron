<template>
	<view class="page-container">
		<com-page-title :title="getLanguage('我的消息')" />
		<z-paging ref="paging" auto-show-back-to-top show-loading-more-when-reload :back-to-top-threshold="300" defaultThemeStyle="white"
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
					<image src="/static/mine-icons/message.png"></image>
					<view class="info">
						<view class="title bold ell1">这是信息标题</view>
						<view class="time text-gray">{{getLanguage('时间')}}：2025-09-12 08:34:56</view>
					</view>
					<text class="open cuIcon-right"></text>
				</view>
			</view>
			
		</z-paging>
	</view>
</template>

<script>
export default {
	data() {
		return {
			pageTitleHeight:96,
			isRefresh:true, //用于记录是否整个页面数据加载刷新
			refresherStatusText: '继续下拉刷新',
			list:[1,2,3,4,5,6]
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
			setTimeout(() => {
				this.$refs.paging.complete([1,2,3,4,5,6,7,8,9,10]);
				this.isRefresh = false;
			},500);
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
				this.refresherStatusText = '继续下拉刷新';
			} else if (e == 1) {
				this.refresherStatusText = '松开立即刷新';
			} else {
				this.refresherStatusText = '正在刷新中';
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
			padding:30rpx 25rpx;
			display:flex;
			justify-content: flex-start;
			align-items: center;
			image{
				width:60rpx;
				height:60rpx;
				margin-right:20rpx;
			}
			.info{
				flex:1;
				.title{
					
				}
				.time{
					font-size:28rpx;
					margin-top:10rpx;
				}
			}
			.open{
				margin-left:auto;
			}
		}
	}
</style>
