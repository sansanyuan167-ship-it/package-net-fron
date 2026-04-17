<!--确认弹窗操作组件-->
<template>
	<view>
		<!--START 确认弹窗-->
		<view class="cu-modal" :class="isShow ? 'show' : ''" @touchmove.stop.prevent @click="clickMast">
			<view class="cu-dialog confirm-popup" @click.stop="">
				<view class="title hp-bold">{{title || getLanguage('温馨提示')}}</view>
				<view class="info">
					{{content || getLanguage('确认执行该操作吗？')}}
				</view>
				<view class="btns">
					<view class="cancel" @click.stop="cancel">{{leftButtonText || getLanguage('取消')}}</view>
					<view class="confirm" @click.stop="confirm">{{rightButtonText || getLanguage('确认')}}</view>
				</view>
			</view>
		</view>
		<!--END 确认弹窗-->
	</view>
</template>

<script>
	/*
	<com-confirm ref="confirm" @onCancel="$refs['confirm'].hide()" @onConfirm="confirm" />
	this.$refs['confirm'].show(params);
	*/
	export default {
		name:"com-confirm",
		props: {
			//标题
			title:{
				type:String,
				default:''
			},
			//内容
			content:{
				type:String,
				default:''
			},
			//左边按钮
			leftButtonText:{
				type:String,
				default:''
			},
			//右边按钮
			rightButtonText:{
				type:String,
				default:''
			},
			//是否点击遮罩层关闭
			maskClosable:{
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				isShow:false,
				param:null
			};
		},
		methods:{
			cancel(){
				this.$emit('onCancel');
			},
			confirm(){
				this.$emit('onConfirm',this.param);
			},
			show(param){
				this.param = param;
				this.isShow = true;
			},
			hide(){
				this.isShow = false;
			},
			clickMast(){
				if(!this.maskClosable) return false;
				this.isShow = false;
			}
		}
	}
</script>

<style lang="scss">
	
	@media screen and (min-width: 768px) {
		.cu-modal {
		    max-width: 500px !important;
			left:calc((100vw - 500px) / 2) !important;
		}
	}
	
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
			border-radius: 0;
		}
		
		&.bottom-modal {
			margin-bottom: -1000upx;
		}
		
		&.bottom-modal.show {
			margin-bottom: 0;
		}
		
		.cu-dialog {
			position: relative;
			display: inline-block;
			vertical-align: middle;
			margin-left: auto;
			margin-right: auto;
			width: 80%;
			box-sizing: border-box;
			background-color: #212F3F;
			background: linear-gradient(to right bottom, #212F3F 0%, #172434 100%);
			border-radius: 12rpx;
			overflow: hidden;
		}
	}
	
	/*确认弹窗*/
	.confirm-popup {
		padding: 50rpx 30rpx;
	
		.title {
			font-size: 34rpx;
			font-weight:800;
		}
	
		.info {
			padding: 50rpx 30rpx 60rpx 30rpx;
			font-size:30rpx;
		}
	
		.btns {
			display: flex;
			justify-content: space-between;
			font-size:30rpx;
	
			.cancel {
				line-height: 80rpx;
				width: 45%;
				background: #394858;
				border-radius: 100rpx;
			}
	
			.confirm {
				line-height: 80rpx;
				width: 45%;
				margin: 0;
				background: #FBE82F;
				background: linear-gradient(to right bottom, #FBE82F 0%, #E5D31A 100%);
				color: #333;
				border-radius: 100rpx;
				border: none;
	
				&::after {
					display: none;
				}
			}
		}
	}
</style>
