<template>
	<view class="page-container" :class="{
		'has-bottom':info.show_button
	}">
		<com-page-title :title="getLanguage('活动')" />
		<!-- <view class="title bold text-orange">{{info.title}}</view> -->
		<view class="content">
			<rich-text :nodes="info.content"></rich-text>
		</view>
		<view class="bottom-btn" v-if="info.show_button">
			<view @click="goPage(info.button_path)">{{info.button_text}}</view>
		</view>
		<com-page-loading ref="pageLoading" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:null,
				info:{}
			};
		},
		async onLoad(options) {
			this.id = options.id;
			await this.getActivityDetail();
			this.$nextTick(() => {
				this.$refs['pageLoading'].hide();
			});
		},
		onShow() {
			
		},
		methods: {
			// 获取活动详情
			async getActivityDetail(){
				let result = await this.baseApi.getActivityDetail({
					id:this.id
				});
				this.info = result.data;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.title{
		padding:30rpx 25rpx 5rpx 25rpx;
		font-size:34rpx;
		line-height:46rpx;
	}
	.content{
		padding:25rpx;
	}
</style>