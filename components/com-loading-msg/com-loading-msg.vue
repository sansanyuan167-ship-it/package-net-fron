<template>
    <view>
		<view class="com-load-msg" v-if="isShow">
			<text class="com-line"></text>
			<view class="com-content">
				<view class="com-icon"></view>
				<view class="com-msg" v-if="msg">{{msg}}</view>
			</view>
		</view>
    </view>
</template>

<script>
	/*
	使用：<com-loading-msg ref="loadingMsg" />
	this.$refs['loadingMsg'].show('获取中');
	*/
	export default {
		name:"com-loading-msg",
	    data() {
	        return {
				msg:'',
	            isShow:false
	        }
	    },
	    methods: {
	        show(msg = ''){
				this.msg = msg;
	        	this.isShow = true;
	        },
	        hide(){
				this.isShow = false;
				this.msg = '';
	        }
	    }
	}
</script>

<style lang="scss">
	@media screen and (min-width: 768px) {
		.com-load-msg{
			width:500px !important;
			left:calc((100vw - 500px) / 2) !important;
		}
	}
	.com-load-msg{
		position:fixed;
		width:100%;
		height:100%;
		left:0;
		bottom:0;
		background:rgba(0,0,0,0.02);
		text-align:center;
		z-index:1000;
		.com-line{
			display:inline-block;
			width:0;
			height:100%;
			vertical-align: middle;
		}
		.com-content{
			display:inline-block;
			vertical-align: middle;
			background:#292929;
			background:rgba(0,0,0,0.6);
			color:#f7f7f7;
			width:60%;
			padding:45rpx 10rpx;
			box-sizing:border-box;
			border-radius:15rpx;
			.com-icon{
			  display: inline-block;
			  width:56rpx;
			  height:56rpx;
			  border-width:4rpx;
			  border-style:solid;
			  border-color:#f7f7f7 #f7f7f7 #f7f7f7 transparent;
			  border-radius:100%;
			  vertical-align: middle;
			  animation:load 1s linear infinite;
			  -webkit-animation:load 1s linear infinite;
			}
			.com-msg{
			  display: inline-block;
			  vertical-align: middle;
			  margin-left:15rpx;
			}
			@keyframes load{
			  0% {
			    transform:rotate(0deg);
			  }
			  100%{
			    transform:rotate(360deg);
			  }
			}
		}
	}
</style>
