<template>
	<view>
		<image :class="['go-top transition',{show:isShow}]" :style="{
			right:`${right}rpx`,
			bottom:`${bottom}rpx`
		}" :src="iconHost('go-top.png')" @click="goPageTop"></image>
	</view>
</template>

<script>
	/*
	使用：<com-go-top ref="goTop" right="30" bottom="30" />
	this.$refs['goTop'].show();
	*/
	export default {
		name: 'com-go-top',
		props: {
			right:{
				type:[String,Number],
				default:30
			},
			bottom:{
				type:[String,Number],
				default:30
			}
		},
		data() {
			return {
				isShow: false
			};
		},
		methods: {
			show() {
				this.isShow = true;
			},
			hide() {
				this.isShow = false;
			}
		}
	}
</script>

<style lang="scss">
	.go-top {
		width: 80rpx;
		height: 80rpx;
		position: fixed;
		bottom: 30rpx;
		right: 30rpx;
		background: #fff;
		box-shadow: 0 0 10rpx 0 #e3e3e3;
		border-radius: 100%;
		opacity: 0.9;
		display: none;
		z-index: 10;
		&.show{
			display:block;
		}
	}
</style>
