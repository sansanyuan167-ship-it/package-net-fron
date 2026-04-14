<!--弹窗组件-->
<template>
	<view>
		<!--START 弹窗-->
		<view :class="[modelClass[model],{show:isShow}]" @touchmove.stop.prevent @click="clickMast">
			<view class="cu-dialog" @click.stop="">
				<slot></slot>
			</view>
		</view>
		<!--END 弹窗-->
	</view>
</template>

<script>
	export default {
		name: "popup",
		props: {
			/*
			弹窗类型
			中间	middle		'cu-modal'
			底部	bottom		'cu-modal bottom-modal'
			左边	left		'cu-modal drawer-modal justify-start'
			右边	right		'cu-modal drawer-modal justify-end'
			*/
			model: {
				type: String,
				default: 'middle'
			},
			//是否显示
			showModal: {
				type: Boolean,
				default: false
			},
			//是否点击遮罩层关闭
			maskClosable: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				isShow: this.showModal,
				modelClass: {
					middle: 'cu-modal',
					bottom: 'cu-modal bottom-modal',
					left: 'cu-modal drawer-modal justify-start',
					right: 'cu-modal drawer-modal justify-end'
				}
			};
		},
		watch: {
			showModal: {
				handler(e) {
					return this.isShow = e;
				}
			}
		},
		methods: {
			cancel() {
				this.$emit('onCancel');
			},
			confirm() {
				this.$emit('onConfirm');
			},
			show(param) {
				this.isShow = true;
			},
			hide() {
				this.isShow = false;
				this.$emit('onClose',true);
			},
			clickMast() {
				if (!this.maskClosable) return false;
				this.isShow = false;
				this.$emit('onClose',true);
			}
		}
	}
</script>

<style lang="scss">
	.cu-modal {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 110;
		opacity: 0;
		outline: 0;
		text-align: center;
		-ms-transform: scale(1.185);
		transform: scale(1.185);
		backface-visibility: hidden;
		perspective: 2000upx;
		background: rgba(0, 0, 0, 0.6);
		transition: all 0.3s ease-in-out 0s;
		pointer-events: none;

		&::before {
			content: "\200B";
			display: inline-block;
			height: 100%;
			vertical-align: middle;
		}

		&.show {
			opacity: 1;
			transition-duration: 0.3s;
			-ms-transform: scale(1);
			transform: scale(1);
			overflow-x: hidden;
			overflow-y: auto;
			pointer-events: auto;
		}

		&.bottom-modal::before {
			vertical-align: bottom;
		}

		&.bottom-modal .cu-dialog {
			width: 100%;
			border-radius: 30rpx 30rpx 0 0;
		}

		&.bottom-modal {
			margin-bottom: -1000upx;
		}

		&.bottom-modal.show {
			margin-bottom: 0;
		}

		&.drawer-modal {
			transform: scale(1);
			display: flex;
		}

		&.drawer-modal .cu-dialog {
			height: 100%;
			border-radius: 0;
			margin: initial;
			transition-duration: 0.3s;
		}

		&.drawer-modal.justify-start .cu-dialog {
			transform: translateX(-100%);
			margin-right: 30%;
		}

		&.drawer-modal.justify-end .cu-dialog {
			transform: translateX(100%);
			margin-left: 30%;
		}

		&.drawer-modal.show .cu-dialog {
			transform: translateX(0%);
		}

		.cu-dialog>.cu-bar:first-child .action {
			min-width: 100rpx;
			margin-right: 0;
			min-height: 100rpx;
		}

		.cu-dialog {
			position: relative;
			display: inline-block;
			vertical-align: middle;
			margin-left: auto;
			margin-right: auto;
			width: 80%;
			max-width: 100%;
			box-sizing: border-box;
			// background-color: #fff;
			border-radius: 25rpx;
			// overflow: hidden;
		}
	}
</style>
