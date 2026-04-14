<template>
    <view>
    	<view class="k-ball-holder3" v-if="isShow">
    		<text class="vertical-line"></text>
    		<view class="box">
    			<view class="k-ball7a"></view>
    			<view class="k-ball7b"></view>
    			<view class="k-ball7c"></view>
    			<view class="k-ball7d"></view>
    		</view>
    	</view>
    </view>
</template>

<script>
	export default {
		name:"com-page-loading",
	    data() {
	        return {
	            isShow:true
	        }
	    },
	    methods: {
	        show(){
				this.isShow = true;
			},
			hide(){
				this.isShow = false;
			}
	    }
	}
</script>

<style>
	.k-ball-holder3 {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		text-align: center;
		z-index: 60;
	}
	
	.k-ball-holder3 .vertical-line {
		display: inline-block;
		height: 100%;
		width: 0;
		vertical-align: middle;
	}
	
	.k-ball-holder3 .box {
		width:70rpx;
		height:70rpx;
		display: inline-block;
		vertical-align: middle;
		text-align: center;
	}
	
	@keyframes k-loadingO {
		0%,
		100% {
			transform: translate(0)
		}
	
		25% {
			transform: translate(210%)
		}
	
		50% {
			transform: translate(210%, 210%)
		}
	
		75% {
			transform: translate(0, 210%)
		}
	}
	
	.k-ball7a {
		border: 0;
		margin: 0;
		width: 25rpx;
		height: 25rpx;
		position: absolute;
		border-radius: 50%;
		animation: k-loadingO 2s ease infinite;
		background: #19A68C;
		animation-delay: -1.5s
	}
	
	.k-ball7b {
		border: 0;
		margin: 0;
		width: 25rpx;
		height: 25rpx;
		position: absolute;
		border-radius: 50%;
		animation: k-loadingO 2s ease infinite;
		background: #F63D3A;
		animation-delay: -1s
	}
	
	.k-ball7c {
		border: 0;
		margin: 0;
		width: 25rpx;
		height: 25rpx;
		position: absolute;
		border-radius: 50%;
		animation: k-loadingO 2s ease infinite;
		background: #FDA543;
		animation-delay: -0.5s
	}
	
	.k-ball7d {
		border: 0;
		margin: 0;
		width: 25rpx;
		height: 25rpx;
		position: absolute;
		border-radius: 50%;
		animation: k-loadingO 2s ease infinite;
		background: #193B48
	}
</style>
