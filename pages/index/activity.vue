<template>
	<view>
		<scroll-view class="scroll-view" scroll-y  @scroll="scroll">
			<view class="is-content">
				<com-page-title :title="getLanguage('活动')" :showBack="false" :bgColor="bgColor" :showShadow="showShadow" />
				<view class="header-bg">
					<image class="bg" src="/static/vip-icons/vip-bg.png" :style="{
						top:`-${pageTitleHeight}rpx`
					}"></image>
				</view>
				<view class="item" :class="{
					'shine-gradient':item.is_hot
				}" v-for="(item,index) in list" :key="index"  @click="index === 0 ? goPage('/pages/mine/recharge') : goPage('/pages/game/activityDetail?id='+item.id)">
					<image class="cover" :src="item.image" mode="aspectFill"></image>
					<image class="hot" src="/static/activity-hot.png" v-if="item.is_hot"></image>
					<view class="title">{{item.title}}</view>
				</view>
				<com-empty ref="empty" />
				<view class="tab-bar-place"></view>
			</view>
		</scroll-view>
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
		};
	},
	async mounted(){
		this.pageTitleHeight = await this.getPageTitleHeight();
	},
	methods: {
		async pageOnLoad(){
			console.log('activity lond');
			this.$emit('showLoading');
			await this.getActivityList();
			this.$emit('hideLoading');
		},
		pageOnShow(){
			console.log('activity show');
		},
		// 获取活动列表
		async getActivityList(){
			let result = await this.baseApi.getActivityList();
			this.list = result.data;
			if(!this.list.length) this.$refs['empty'].show(this.getLanguage('暂时没有任何数据'));
		},
		// 滚动触发
		scroll(e){
			// console.log(e);
			let top = e.detail.scrollTop;
			if(top > 50){
				this.bgColor = '#212F3F';
				this.showShadow = true;
			}else{
				this.bgColor = 'transparent';
				this.showShadow = false;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
	scroll-view{
		height:100vh;
	}
	@media screen and (min-width: 768px) {
		.scroll-view {
			position: relative;
			width: calc(100% + 25px);
			&::-webkit-scrollbar {
				display: none !important;
				width: 0 !important;
				height: 0 !important;
				background: transparent !important;
			}
			.is-content{
				width:500px;
			}
		}
	}
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
	.item{
		position:relative;
		margin:25rpx;
		border-radius:20rpx;
		overflow: hidden;
		.cover{
			width:100%;
			height:200rpx;
			display:block;
		}
		.hot{
			position:absolute;
			top:0;
			left:0;
			width:120rpx;
			height:50rpx;
			opacity: 0.9;
			z-index: 10;
		}
		.title{
			position:absolute;
			bottom:30rpx;
			right:30rpx;
			font-size:34rpx;
			font-weight:600;
			display: inline-block;
			background-image: linear-gradient(to right bottom, #FAF7F2, #FAF0DB);
			-webkit-background-clip: text;
			color: transparent;
		}
	}
</style>
