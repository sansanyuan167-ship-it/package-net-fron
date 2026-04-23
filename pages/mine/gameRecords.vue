<template>
	<view class="page-container">
		<com-page-title :title="getLanguage('游戏记录')" />
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
			
			<view class="list-box">
				<view class="item panel-item" v-for="(item,index) in list" :key="index" @click="goPage('/pages/game/gameView?id='+item.game_id)" @longpress="removeConfirm(index)">
					<image class="image-bg" :src="item.cover" mode="aspectFill"></image>
					<view class="info">
						<view class="title bold">{{item.name}}</view>
						<view class="time text-gray">{{getLanguage('时间')}}：{{item.create_time}}</view>
					</view>
					<text class="open cuIcon-right"></text>
				</view>
			</view>
			
		</z-paging>
		
		<com-confirm ref="confirm" :content="getLanguage('你确认删除这条记录吗？')" @onCancel="$refs['confirm'].hide()" @onConfirm="remove($event)" />
		
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
					type: 'BROWSE',
					name: this.getLanguage('游戏记录')
				},
				{
					type: 'COLLECT',
					name: this.getLanguage('游戏收藏')
				}
			],
			list:[]
		};
	},
	async onLoad(options) {
		this.type = options.type || 'BROWSE';
		this.current = this.type == 'BROWSE' ? 0 : 1;
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
			let result = await this.userApi.gameRecords({
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
			console.log(e);
			this.type = e.item.type;
			this.$refs.paging.reload();
		},
		// 删除收藏提示
		removeConfirm(index){
			this.$refs['confirm'].show(index);
		},
		// 确认删除
		async remove(index){
			let result = await this.userApi.actionGameCollect({
				id:this.list[index].game_id,
				type:'COLLECT',
				action:'remove'
			});
			this.$refs['confirm'].hide();
			this.showMsg(result.msg);
			if(!result.status) return false;
			this.list.splice(index,1);
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
			image{
				width:100rpx;
				height:100rpx;
				margin-right:20rpx;
				border-radius:12rpx;
			}
			.info{
				flex:1;
				.title{
					display:flex;
					justify-content: flex-start;
					align-items: center;
					font-size:32rpx;
					display: inline-block;
					background-image: linear-gradient(to right bottom, #FDF13C, #FF8133);
					-webkit-background-clip: text;
					color: transparent;
				}
				.time{
					font-size:28rpx;
					margin-top:20rpx;
				}
			}
			.open{
				margin-left:auto;
			}
		}
	}
</style>
