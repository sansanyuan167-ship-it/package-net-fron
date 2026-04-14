<!--编辑弹窗操作组件-->
<template>
	<view>
		<!--START 确认弹窗-->
		<view :class="[modelClass[model],{show:isShow}]" @touchmove.stop.prevent @click="clickMast">
			<view class="cu-dialog edit-popup" @click.stop="">
				<view class="title hp-bold">{{title}}</view>
				<view class="info">
					<input class="input" type="text" :placeholder="placeholder" @input="input" :value="value">
				</view>
				<view class="btns">
					<view class="cancel" @click.stop="cancel">{{leftButtonText}}</view>
					<view class="confirm" @click.stop="confirm">{{rightButtonText}}</view>
				</view>
			</view>
		</view>
		<!--END 确认弹窗-->
	</view>
</template>

<script>
	/*
	使用：<com-popup-edit model="bottom" ref="popupEdit" title="请输入标题" v-model="content" @onCancel="$refs['popupEdit'].hide()" @onConfirm="confirm" />
	this.$refs['popupEdit'].show(params);
	*/
	export default {
		name:'com-popup-edit',
		props:{
			/*
			弹窗类型
			中间	middle		'cu-modal'
			底部	bottom		'cu-modal bottom-modal'
			*/
			model:{
				type:String,
				default:'middle'
			},
			//标题
			title:{
				type:String,
				default:''
			},
			//输入框placeholder
			placeholder:{
				type:String,
				default:'请输入内容'
			},
			//输入框的值 父级v-model的值
			value:{
				type:[String,Number],
				default:''
			},
			//左边按钮
			leftButtonText:{
				type:String,
				default:'取消'
			},
			//右边按钮
			rightButtonText:{
				type:String,
				default:'确认'
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
				params:null,
				modelClass:{
					middle:'cu-modal',
					bottom:'cu-modal bottom-modal'
				}
			};
		},
		methods: {
		    show(param){
		    	this.param = param;
		    	this.isShow = true;
		    },
		    hide(){
				this.isShow = false;
		    },
			input(e){
				// console.log(e);
				this.$emit('input',e.detail.value);
			},
			cancel(){
				this.$emit('onCancel');
			},
			confirm(){
				this.$emit('onConfirm',this.param);
			},
			clickMast(){
				if(!this.maskClosable) return false;
				this.isShow = false;
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
			border-radius: 0;
			border-radius:30rpx 30rpx 0 0;
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
			background-color: #fff;
			border-radius: 12rpx;
			overflow: hidden;
		}
	}
	
	/*编辑弹窗*/
	.edit-popup {
		padding: 50rpx 30rpx;
		
		&
	
		.title {
			font-size: 34rpx;
			font-weight:800;
		}
	
		.info {
			padding: 50rpx 30rpx 60rpx 30rpx;
			font-size:30rpx;
			.input{
				border:1rpx solid #f5f5f5;
				height:85rpx;
				font-size:32rpx;
			}
		}
	
		.btns {
			display: flex;
			justify-content: space-between;
			font-size:30rpx;
	
			.cancel {
				line-height: 80rpx;
				width: 45%;
				background: #DBDBDB;
				border-radius: 100rpx;
			}
	
			.confirm {
				line-height: 80rpx;
				width: 45%;
				margin: 0;
				background: #336BFF;
				color: #fff;
				border-radius: 100rpx;
				border: none;
	
				&::after {
					display: none;
				}
			}
		}
	}
</style>
