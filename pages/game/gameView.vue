<template>
	<view class="page-container">
		<cover-view class="back-button" @click="goBack()">
			<view class="cuIcon-back"></view>
		</cover-view>
		<view class="main_content">
			<web-view :src="link"></web-view>
		</view>
		<com-page-loading ref="pageLoading" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			id:null,
			link:'' // https://xyule.cyou/
		};
	},
	async onLoad(options) {
		this.id = options.id;
		let result = await this.gameApi.getGameUrl({
			id:this.id
		});
		this.$nextTick(() => {
			this.$refs['pageLoading'].hide();
		});
		if(!result.status) return this.showMsg(result.msg);
		this.link = result.data;
	},
	onShow(){
		
	},
	methods: {
		
	}
};
</script>

<style lang="scss" scoped>
	.back-button{
		width:65rpx;
		height:65rpx;
		line-height:65rpx;
		position:fixed;
		top:30rpx;
		left:30rpx;
		z-index: 1000;
		color:#fff;
		text-align:center;
		background:rgba(0,0,0,0.5);
		box-sizing: border-box;
		border:2rpx solid rgba(255,255,255,0.5);
		font-size:34rpx;
		border-radius:100rpx;
	}
</style>
