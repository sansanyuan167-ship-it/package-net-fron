<template>
	<view class="page-container">
		<com-page-title :title="getLanguage('常见问题')" />
		<view class="item panel-item" v-for="(v,i) in list" :key="i">
			<view class="title">{{v.title}}</view>
			<view class="content text-gray">
				<rich-text :nodes="v.content"></rich-text>
			</view>
		</view>
		<com-empty ref="empty" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			list:[]
		};
	},
	async onLoad(options) {
		let result = await this.baseApi.question();
		this.list = result.data;
		if(!this.list.length) this.$refs['empty'].show(this.getLanguage('暂时没有任何数据'));
	},
	onShow(){
		
	},
	methods: {
		
	}
};
</script>

<style lang="scss" scoped>
	.item{
		padding:30rpx 25rpx;
		.title{
			font-size:32rpx;
			display: inline-block;
			background-image: linear-gradient(to right bottom, #FDF13C, #FF8133);
			-webkit-background-clip: text;
			color: transparent;
		}
		.content{
			margin-top:10rpx;
			font-size:28rpx;
			view{
				padding:8rpx 0;
			}
		}
	}
</style>
