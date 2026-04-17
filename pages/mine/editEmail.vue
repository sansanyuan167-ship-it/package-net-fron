<template>
	<view class="page-container">
		<com-page-title :title="email ? getLanguage('修改邮箱') : getLanguage('绑定邮箱')" />
		<view class="info-box panel-item">
			<view class="item">
				<view class="key">
					<text class="icon cuIcon-mail"></text>
					<text>{{getLanguage('邮箱')}}</text>
				</view>
				<view class="input">
					<input v-model="info.email" type="text" :placeholder="getLanguage('请输入邮箱地址')" placeholder-style="color:#AFAFAF;">
					<view :class="['button',{dis:isDis}]" @click="getCode">{{buttonText}}</view>
				</view>
			</view>
			<view class="item">
				<view class="key">
					<text class="icon cuIcon-safe"></text>
					<text>{{getLanguage('邮箱验证码')}}</text>
				</view>
				<view class="input">
					<input v-model="info.code" type="text" :placeholder="getLanguage('请输入验证码')" placeholder-style="color:#AFAFAF;">
				</view>
			</view>
		</view>
		<view class="info-box panel-item" v-if="email">
			<view class="item">
				<view class="key">
					<text class="icon cuIcon-lock"></text>
					<text>{{getLanguage('登录密码')}}</text>
				</view>
				<view class="input" v-if="showPassword">
					<input v-model="info.password" type="text" :placeholder="getLanguage('请输入登录密码')" placeholder-style="color:#AFAFAF;">
					<text class="input-icon" :class="{
						'cuIcon-attentionforbid':!showPassword,
						'cuIcon-attention':showPassword
					}" @click="showPassword = !showPassword"></text>
				</view>
				<view class="input" v-else>
					<input v-model="info.password" type="password" :placeholder="getLanguage('请输入登录密码')" placeholder-style="color:#AFAFAF;">
					<text class="input-icon" :class="{
						'cuIcon-attentionforbid':!showPassword,
						'cuIcon-attention':showPassword
					}" @click="showPassword = !showPassword"></text>
				</view>
			</view>
		</view>
		<view class="btn-block" @click="submit">{{getLanguage('确认提交')}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showPassword:false,
				email:'',
				info:{
					email:'',
					code:'1234',
					password:''
				},
				buttonText:this.getLanguage('获取验证码'),
				time:60,
				timer:null,
				isDis:false
			}
		},
		async onLoad(options) {
			this.email = this.info.email = options.email ? decodeURIComponent(options.email) : '';
		},
		onShow() {
			
		},
		methods: {
			// 倒计时
			setTime(){
				this.time = 60;
				this.buttonText = `${this.time}`;
				this.timer = setInterval(() => {
					this.time--;
					if(this.time <= 0){
						this.buttonText = this.getLanguage('获取验证码');
						this.isDis = false;
						clearInterval(this.timer);
					}else{
						this.buttonText = `${this.time}`;
					}
				},1000);
			},
			// 获取验证码
			async getCode(){
				if(!this.info.email) return this.showMsg(this.getLanguage('请输入邮箱地址'));
				let result = await this.loginApi.getEmailCode({"email":this.info.email,"scene":"EDIT_EMAIL"});
				if(this.isDis) return false;
				this.isDis = true;
				this.setTime();
			},
			// 提交
			async submit(){
				if(!this.info.email) return this.showMsg(this.getLanguage('请输入邮箱地址'));
				if(!this.info.code) return this.showMsg(this.getLanguage('请输入验证码'));
				if(this.email && !this.info.password) return this.showMsg(this.getLanguage('请输入登录密码'));
				let result = await this.userApi.editEmail({
					email:this.info.email,
					code:this.info.code,
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
</style>
