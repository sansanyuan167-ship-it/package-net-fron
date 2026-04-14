<template>
	<view class="refresher-loading">
		<text></text>
		<text></text>
		<text></text>
		<text></text>
		<text></text>
	</view>
</template>

<script>
	export default {
		name: 'com-refresher-loading',
		data() {
			return {
				
			};
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.refresher-loading {
		position: relative;
		display:flex;
		justify-content: center;
		padding:20rpx 30rpx 20rpx 30rpx;
	
		text {
			width: 26rpx;
			height: 26rpx;
			background: #336BFF;
			margin-right:8rpx;
			opacity: 0.5;
			border-radius: 26rpx;
			-webkit-animation: refresher_loading 1s infinite ease-in-out;
			-moz-animation: refresher_loading 1s infinite ease-in-out;
			-ms-animation: refresher_loading 1s infinite ease-in-out;
			-animation: refresher_loading 1s infinite ease-in-out;
	
			&:nth-child(2) {
				left: 20px;
				-webkit-animation-delay: .2s;
				-moz-animation-delay: .2s;
				-ms-animation-delay: .2s;
				animation-delay: .2s;
			}
	
			&:nth-child(3) {
				left: 40px;
				-webkit-animation-delay: .4s;
				-moz-animation-delay: .4s;
				-ms-animation-delay: .4s;
				animation-delay: .4s;
			}
	
			&:nth-child(4) {
				left: 60px;
				-webkit-animation-delay: .6s;
				-moz-animation-delay: .6s;
				-ms-animation-delay: .6s;
				animation-delay: .6s;
			}
	
			&:nth-child(5) {
				margin:0;
				-webkit-animation-delay: .8s;
				-moz-animation-delay: .8s;
				-ms-animation-delay: .8s;
				animation-delay: .8s;
			}
		}
	}
	
	@-webkit-keyframes refresher_loading {
		0% {
			opacity: 0.3;
			-webkit-transform: translateY(0px);
			box-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.15);
		}
	
		50% {
			opacity: 1;
			-webkit-transform: translateY(-10rpx);
			background: #f1c40f;
			box-shadow: 0px 30rpx 6rpx rgba(0, 0, 0, 0.05);
		}
	
		100% {
			opacity: 0.3;
			-webkit-transform: translateY(0px);
			box-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.15);
		}
	}
	
	@-moz-keyframes refresher_loading {
		0% {
			opacity: 0.3;
			-moz-transform: translateY(0px);
			box-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.15);
		}
	
		50% {
			opacity: 1;
			-moz-transform: translateY(-10rpx);
			background: #f1c40f;
			box-shadow: 0px 30rpx 6rpx rgba(0, 0, 0, 0.05);
		}
	
		100% {
			opacity: 0.3;
			-moz-transform: translateY(0px);
			box-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.15);
		}
	}
	
	@-ms-keyframes refresher_loading {
		0% {
			opacity: 0.3;
			-ms-transform: translateY(0px);
			box-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.15);
		}
	
		50% {
			opacity: 1;
			-ms-transform: translateY(-10rpx);
			background: #f1c40f;
			box-shadow: 0px 30rpx 6rpx rgba(0, 0, 0, 0.05);
		}
	
		100% {
			opacity: 0.3;
			-ms-transform: translateY(0px);
			box-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.15);
		}
	}
	
	@keyframes refresher_loading {
		0% {
			opacity: 0.3;
			transform: translateY(0px);
			box-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.15);
		}
	
		50% {
			opacity: 1;
			transform: translateY(-10rpx);
			background: #f1c40f;
			box-shadow: 0px 30rpx 6rpx rgba(0, 0, 0, 0.05);
		}
	
		100% {
			opacity: 0.3;
			transform: translateY(0px);
			box-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.15);
		}
	}
</style>
