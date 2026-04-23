<template>
	<view class="page-container">
		<com-page-title :title="getLanguage('游戏分类')" />
		<view class="category">
			<scroll-view scroll-x scroll-with-animation class="scroll-box" :scroll-into-view="`id-${currentCategoryId}`">
				<view :class="{active:currentCategoryId == item.id}" :id="`id-${item.id}`" v-for="(item,index) in categoryList" :key="index" @click="changeCategory(item)">{{item.name}}</view>
			</scroll-view>
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
		}" :default-page-no="1" :default-page-size="32" v-model="list" @query="queryList" :use-custom-refresher="true"
			@refresherStatusChange="refresherStatusChange" @onRefresh="refresh" @scroll="scrollFun">
			
			<view slot="top" :style="{
				height:`${pageTitleHeight + 100}rpx`
			}"></view>
			
			<view slot="refresher" class="refresher-container">
				<image class="image" src="/static/icon.png"></image>
				<text>{{refresherStatusText}}</text>
			</view>
			
			<view class="game-list">
				<view class="item" v-for="(item,index) in list" :key="index" @click="goPageCheck('/pages/game/gameView?id='+item.game_id,true)">
					<view class="image-box">
						<image class="image-bg" :src="item.cover" mode="aspectFill"></image>
						<view class="collect text-gray cuIcon-likefill" :class="{'text-red':item.is_collect}" @click.stop="actionGameCollect(index)"></view>
					</view>
					<view class="name bold ell1">{{item.name}}</view>
				</view>
			</view>
			
		</z-paging>
		<com-login-popup ref="loginPopup" @onCancel="$refs['loginPopup'].hide()" @onConfirm="goPage('/pages/base/login','reLaunch')" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			pageTitleHeight:96,
			isRefresh:true, //用于记录是否整个页面数据加载刷新
			refresherStatusText: this.getLanguage('继续下拉刷新'),
			currentCategoryId:0,
			categoryList:[],
			list:[]
		};
	},
	async onLoad(options) {
		this.currentCategoryId = options.id || 0;
		this.pageTitleHeight = await this.getPageTitleHeight();
	},
	onShow(){
		
	},
	methods: {
		// 获取分类列表
		async getCategories(){
			let result = await this.gameApi.getCategories();
			result.data.unshift({id:0,name:this.getLanguage('全部')});
			this.categoryList = result.data;
		},
		//加载数据
		async queryList(pageNo, pageSize) {
			if(this.isRefresh){
				// console.log('整页面刷新');
				await this.getCategories();
			}else{
				// console.log('仅列表加载');
			}
			let result = await this.gameApi.getGamePage({
				category_id:this.currentCategoryId,
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
		// 切换分类
		changeCategory(item){
			this.currentCategoryId = item.id;
			this.$refs.paging.reload();
		},
		// 操作收藏
		async actionGameCollect(index){
			if(!this.getToken()) return this.$refs['loginPopup'].show();
			let status = this.list[index].is_collect;
			let action = status ? 'remove' : 'add';
			let result = await this.userApi.actionGameCollect({
				id:this.list[index].game_id,
				type:'COLLECT',
				action:action
			});
			this.list[index].is_collect = !status;
		},
		// 跳转验证
		goPageCheck(url,type){
			if(type && !this.getToken()) return this.$refs['loginPopup'].show();
			this.goPage(url);
		}
	}
};
</script>

<style lang="scss" scoped>
	.category{
		padding:20rpx 25rpx;
		height:62rpx;
		overflow: hidden;
		position:relative;
		z-index: 10;
		.scroll-box{
			white-space: nowrap;
			overflow-x: scroll;
			view{
				font-size:28rpx;
				background:#2C2F3E;
				display:inline-block;
				line-height:60rpx;
				margin-right:25rpx;
				padding:0 25rpx;
				border-radius:100rpx;
				margin-bottom:50rpx;
				&:last-child{
					margin-right:0;
				}
				&.active{
					color:#333;
					background: #FBE82F;
					background: linear-gradient(to right bottom, #FBE82F 0%, #E5D31A 100%);
				}
			}
		}
	}
	.game-list{
		display:flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		padding:0 25rpx;
		gap:20rpx 20rpx;
		.item{
			width:calc((100% - 60rpx) / 4);
			margin-top:10rpx;
			.image-box{
				position:relative;
				width:100%;
				height:165rpx;
				border-radius:20rpx;
				overflow: hidden;
				image{
					display:block;
					width:100%;
					height:100%;
				}
				.collect{
					position:absolute;
					width:60rpx;
					height:60rpx;
					text-align:center;
					line-height:60rpx;
					font-size:34rpx;
					bottom:0;
					right:0;
					text-shadow: 0 0 16rpx #000;
				}
			}
			.name{
				font-size:26rpx;
				margin-top:15rpx;
				background-image: linear-gradient(to right bottom, #FDF13C, #FF8133);
				-webkit-background-clip: text;
				color: transparent;
			}
		}
	}
</style>
