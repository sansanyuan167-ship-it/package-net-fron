<template>
	<view>
		<view class="com-loading">
			<view class="com-icon" v-if="status == 'loading'"></view>
			<!-- <view class="com-text" v-if="status == 'loading'">加载中...</view> -->
			<view class="com-text" v-if="status == 'load'">上拉加载更多</view>
			<view class="com-text" v-if="status == 'noData'">没有更多数据了</view>
		</view>
	</view>
</template>

<script>
	/*
	使用：<com-data-loading ref="dataLoading" :status="loadStatus" />
	loadStatus:
	loading		 =	 '正在加载'
	load 		 =	 '上拉加载更多'
	noData		 = 	 '没有更多数据了'
	*/
	export default {
		name:'com-data-loading',
		props: {
			status:{
				type:String,
				default:'loading'
			}
		},
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.com-loading {
		line-height: 58rpx;
		padding: 25rpx;
		text-align: center;
		color: #A7A7A7;
		font-size: 28rpx;

		.com-icon {
			display: inline-block;
			width: 58rpx;
			height: 58rpx;
			border-width: 4rpx;
			border-style: solid;
			border-color: #2E3033 transparent #2E3033 transparent;
			border-radius: 100%;
			vertical-align: middle;
			animation: load 1s linear infinite;
			-webkit-animation: load 1s linear infinite;
		}

		.com-text {
			display: inline-block;
			vertical-align: middle;
		}
	}

	@keyframes load {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>
