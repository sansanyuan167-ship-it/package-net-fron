<template>
	<view class="page-container">
		<com-page-title :title="getLanguage('成为合伙人')" />
		<view class="container" :style="{
			top:`${pageTitleHeight}rpx`,
			height:`calc(100vh - ${pageTitleHeight}rpx)`
		}">
			<view class="content">
				<view class="title-box">
					<view class="title">{{info.title}}</view>
				</view>
				<view class="info">
					{{info.content}}
				</view>
				<com-service />
				<view class="email">Business Email：<text class="text-orange">test888@gmail.com</text></view>
			</view>
		</view>
		<com-page-loading ref="pageLoading" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			pageTitleHeight:96,
			info:{}
		};
	},
	async onLoad(options) {
		this.pageTitleHeight = await this.getPageTitleHeight();
		let result = await this.baseApi.partnerArticle();
		this.info = result.data;
		this.$nextTick(() => {
			this.$refs['pageLoading'].hide();
		});
	},
	onShow(){
		
	},
	methods: {
		
	}
};
</script>

<style lang="scss" scoped>
	.container{
		position:absolute;
		top:96rpx;
		left:0;
		width:100%;
		height:calc(100vh - 96rpx);
		background:url('/static/partnel-bg.jpg') center center no-repeat;
		background-size:100% 100%;
		.content{
			margin-top:500rpx;
			.title-box{
				display:flex;
				justify-content: center;
				align-items: center;
				background:linear-gradient(to right,transparent 0%,rgba(0,0,0,0.6) 50%,transparent 100%);
				padding:30rpx;
				.title{
					font-size:40rpx;
					font-weight:800;
					display: inline-block;
					background-image: linear-gradient(to right bottom, #FDF13C, #FF8133);
					-webkit-background-clip: text;
					color: transparent;
				}
			}
			.info{
				padding:25rpx;
			}
			.email{
				text-align:center;
				margin-top:50rpx;
				text{
					text-decoration: underline;
				}
			}
		}
	}
</style>
