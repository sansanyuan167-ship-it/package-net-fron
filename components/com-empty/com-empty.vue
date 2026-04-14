<template>
	<view>
		<view class="com-empty" v-if="isShow">
			<image :src="imageUrl"></image>
			<text>{{msg}}</text>
		</view>
	</view>
</template>

<script>
	/*
	使用：<com-empty ref="empty" />
	this.$refs['empty'].show('空空如也',this.iconHost('empty-icons/data.png'));
	*/
	export default {
		name: 'com-empty',
		data() {
			return {
				imageUrl: this.iconHost('empty-icons/data.png'),
				msg: '',
				isShow: false
			};
		},
		methods: {
			show(msg = '', imageUrl = this.iconHost('empty-icons/data.png')) {
				this.msg = msg;
				this.imageUrl = imageUrl;
				this.isShow = true;
			},
			hide() {
				this.isShow = false;
				this.msg = '';
				this.imageUrl = this.iconHost('empty-icons/data.png');
			}
		}
	}
</script>

<style lang="scss">
	.com-empty {
		position:relative;
		text-align: center;
		color: #BCC6D6;
		padding: 80rpx 30rpx 30rpx 30rpx;
		opacity: 0.6;

		image {
			display: block;
			width: 360rpx;
			height: 360rpx;
			margin: 0 auto 5rpx;
		}
	}
</style>
