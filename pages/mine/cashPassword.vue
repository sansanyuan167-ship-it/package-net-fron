<template>
	<view class="page-container">
		<com-page-title :title="getLanguage('修改资金密码')" />
		<view class="info-box panel-item">
			<view class="item">
				<view class="key">
					<text class="icon cuIcon-lock"></text>
					<text>{{getLanguage('原密码')}}</text>
				</view>
				<view class="input" v-if="showOld">
					<input v-model="info.oldPassword" type="text" :placeholder="getLanguage('请输入原密码')" placeholder-style="color:#AFAFAF;">
					<text class="input-icon" :class="{
						'cuIcon-attentionforbid':!showOld,
						'cuIcon-attention':showOld
					}" @click="showOld = !showOld"></text>
				</view>
				<view class="input" v-else>
					<input v-model="info.oldPassword" type="password" :placeholder="getLanguage('请输入原密码')" placeholder-style="color:#AFAFAF;">
					<text class="input-icon" :class="{
						'cuIcon-attentionforbid':!showOld,
						'cuIcon-attention':showOld
					}" @click="showOld = !showOld"></text>
				</view>
			</view>
		</view>
		<view class="explain text-red" v-if="cash_password">{{getLanguage('初始密码')}}：123456</view>
		<view class="info-box panel-item">
			<view class="item">
				<view class="key">
					<text class="icon cuIcon-lock"></text>
					<text>{{getLanguage('新密码')}}</text>
				</view>
				<view class="input" v-if="showPassword">
					<input v-model="info.password" type="text" :placeholder="getLanguage('请输入新密码')" placeholder-style="color:#AFAFAF;">
					<text class="input-icon" :class="{
						'cuIcon-attentionforbid':!showPassword,
						'cuIcon-attention':showPassword
					}" @click="showPassword = !showPassword"></text>
				</view>
				<view class="input" v-else>
					<input v-model="info.password" type="password" :placeholder="getLanguage('请输入新密码')" placeholder-style="color:#AFAFAF;">
					<text class="input-icon" :class="{
						'cuIcon-attentionforbid':!showPassword,
						'cuIcon-attention':showPassword
					}" @click="showPassword = !showPassword"></text>
				</view>
			</view>
			<view class="item">
				<view class="key">
					<text class="icon cuIcon-lock"></text>
					<text>{{getLanguage('确认新密码')}}</text>
				</view>
				<view class="input" v-if="showConfirm">
					<input v-model="info.confirmPassword" type="text" :placeholder="getLanguage('请确认新密码')" placeholder-style="color:#AFAFAF;">
					<text class="input-icon" :class="{
						'cuIcon-attentionforbid':!showConfirm,
						'cuIcon-attention':showConfirm
					}" @click="showConfirm = !showConfirm"></text>
				</view>
				<view class="input" v-else>
					<input v-model="info.confirmPassword" type="password" :placeholder="getLanguage('请确认新密码')" placeholder-style="color:#AFAFAF;">
					<text class="input-icon" :class="{
						'cuIcon-attentionforbid':!showConfirm,
						'cuIcon-attention':showConfirm
					}" @click="showConfirm = !showConfirm"></text>
				</view>
			</view>
		</view>
		<view class="explain text-red">{{getLanguage('密码长度为6位数字')}}</view>
		<view class="btn-block" @click="submit">{{getLanguage('确认提交')}}</view>
		<view class="find-password text-gray">
			<view @click="goPage('/pages/mine/findPassword?type=cash','redirect')">{{getLanguage('找回资金密码')}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showOld: false,
				showPassword: false,
				showConfirm: false,
				info:{
					oldPassword:'',
					password:'',
					confirmPassword:''
				},
				cash_password:false
			}
		},
		async onLoad() {
			
		},
		onShow() {
			this.getUserInfo();
		},
		methods: {
			// 获取用户信息
			async getUserInfo(){
				let result = await this.userApi.getUserInfo();
				this.cash_password = result.data.cash_password;
			},
			// 提交
			async submit(){
				if(!this.info.oldPassword) return this.showMsg(this.getLanguage('请输入原密码'));
				if(!this.info.password) return this.showMsg(this.getLanguage('请输入新密码'));
				if(!this.info.confirmPassword) return this.showMsg(this.getLanguage('请确认新密码'));
				if(this.info.password !== this.info.confirmPassword) return this.showMsg(this.getLanguage('两次密码不一致'));
				let result = await this.userApi.cashPassword({
					old_password:this.info.oldPassword,
					password:this.info.password
				});
				this.showMsg(result.msg);
				if(!result.status) return false;
				setTimeout(() => {
					this.goBack();
				},1000);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.info-box{
		padding:25rpx;
		margin-top:40rpx;
		.item{
			margin-top:30rpx;
			&:first-child{
				margin-top:0;
			}
			.key{
				display:flex;
				justify-content: flex-start;
				align-items: center;
				.icon{
					width:50rpx;
					height:50rpx;
					line-height:50rpx;
					font-size:40rpx;
					text-align:center;
					margin-right:15rpx;
					display: inline-block;
					background-image: linear-gradient(to right bottom, #F5EDE0, #FF8133);
					-webkit-background-clip: text;
					color: transparent;
				}
			}
			.input{
				background:#212434;
				margin-top:15rpx;
				padding:15rpx 25rpx;;
				border-radius:12rpx;
				display:flex;
				justify-content: space-between;
				align-items: center;
				.flag{
					width:80rpx;
					height:50rpx;
					margin-right:15rpx;
					border-radius:10rpx;
				}
				.select-text{
					line-height:60rpx;
					flex:1;
				}
				.phone-code{
					margin-right:15rpx;
				}
				input{
					width:100%;
					height:60rpx;
					flex:1;
				}
				.button{
					line-height:60rpx;
					background:#F2E027;
					border-radius:100rpx;
					padding:0 20rpx;
					font-size:24rpx;
					color:#333;
					z-index: 50;
					&.dis{
						background:#C6C6C6;
						color:#626262;
					}
				}
			}
		}
	}
	.explain{
		font-size:28rpx;
		margin:25rpx;
	}
	.find-password{
		display:flex;
		justify-content: center;
		align-items: center;
		margin-top:60rpx;
	}
	.input-icon{
		width:60rpx;
		height:60rpx;
		line-height:60rpx;
		text-align:center;
		font-size:32rpx;
	}
</style>
