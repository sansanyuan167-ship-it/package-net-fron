<template>
	<view class="page-container">
		<com-page-title v-if="type=='login'" :title="getLanguage('找回登录密码')" />
		<com-page-title v-if="type=='cash'" :title="getLanguage('找回资金密码')" />
		<view class="info-box panel-item">
			<view class="item" @click="$refs['countryPopup'].show()">
				<view class="key">
					<text class="icon cuIcon-activity"></text>
					<text>{{getLanguage('国家')}}</text>
				</view>
				<view class="input">
					<image class="flag" mode="heightFix" :src="selectedCountry.flag" v-if="selectedCountry.key"></image>
					<view class="select-text" :class="{
						'text-placeholder':!selectedCountry.key
					}">{{selectedCountry.key || getLanguage('请选择国家')}}</view>
					<text class="open cuIcon-right"></text>
				</view>
			</view>
			<view class="item">
				<view class="key">
					<text class="icon cuIcon-mobile"></text>
					<text>{{getLanguage('手机号')}}</text>
				</view>
				<view class="input">
					<view class="phone-code text-orange" v-if="selectedCountry.code">{{selectedCountry.code}}</view>
					<input v-model="info.phone" type="text" :placeholder="getLanguage('请输入手机号')" placeholder-style="color:#AFAFAF;">
				</view>
			</view>
			<view class="item">
				<view class="key">
					<text class="icon cuIcon-safe"></text>
					<text>{{getLanguage('手机验证码')}}</text>
				</view>
				<view class="input">
					<input v-model="info.code" type="text" :placeholder="getLanguage('请输入手机验证码')" placeholder-style="color:#AFAFAF;">
					<view :class="['button',{dis:isDis}]" @click="getCode">{{buttonText}}</view>
				</view>
			</view>
		</view>
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
		<view class="explain text-red" v-if="type=='login'">登录密码长度为6~12位，每位为数字或字母大小写</view>
		<view class="explain text-red" v-if="type=='cash'">{{getLanguage('密码长度为6位数字')}}</view>
		<view class="btn-block" @click="submit">{{getLanguage('确认提交')}}</view>
		
		<!-- START 选择国家弹窗 -->
		<com-popup ref="countryPopup" model="bottom">
			<view class="country-popup panel-bg">
				<text class="close cuIcon-close" @click="$refs['countryPopup'].hide()"></text>
				<view class="popup-title">{{getLanguage('请选择国家')}}</view>
				<scroll-view scroll-y class="list">
					<view class="item" :class="{'active':item.key == selectedCountry.key}" v-for="(item,index) in countryList"
						:key="index" @click="selectCountry(item)">
						<view class="name">{{item.name}}</view>
						<image class="flag" mode="heightFix" :src="item.flag"></image>
					</view>
				</scroll-view>
			</view>
		</com-popup>
		<!-- END 选择国家弹窗 -->
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectedCountry:{},
				countryList:[],
				info:{
					code:'1234'
				},
				buttonText:'获取验证码',
				time:60,
				timer:null,
				isDis:false,
				type:'login',
				showPassword:false,
				showConfirm:false
			}
		},
		async onLoad(options) {
			if(options.type == 'cash'){
				this.type = 'cash';
			}
			await this.getCountryList();
			this.languageKey = uni.getStorageSync('language') || 'zh-CN';
			let result = await this.baseApi.getLanguageList();
			this.language = result.data;
		},
		onShow() {
			
		},
		methods: {
			// 获取国家列表
			async getCountryList(){
				let result = await this.baseApi.countryList();
				this.countryList = result.data;
			},
			// 选择国家
			selectCountry(item){
				this.selectedCountry = item;
				this.$refs['countryPopup'].hide();
			},
			// 倒计时
			setTime(){
				this.time = 60;
				this.buttonText = `${this.time} 秒后再获取`;
				this.timer = setInterval(() => {
					this.time--;
					if(this.time <= 0){
						this.buttonText = `获取验证码`;
						this.isDis = false;
						clearInterval(this.timer);
					}else{
						this.buttonText = `${this.time} 秒后再获取`;
					}
				},1000);
			},
			// 获取验证码
			async getCode(){
				if(!this.info.phone) return this.showMsg(this.getLanguage('请输入手机号'));
				let result = await this.loginApi.getPhoneCode({"phone":this.info.phone,"scene":"FIND_PASSWORD"});
				if(this.isDis) return false;
				this.isDis = true;
				this.setTime();
			},
			// 提交
			async submit(){
				if(!this.selectedCountry.key) return this.showMsg(this.getLanguage('请选择国家'));
				if(!this.info.phone) return this.showMsg(this.getLanguage('请输入手机号'));
				if(!this.info.code) return this.showMsg(this.getLanguage('请输入手机验证码'));
				if(!this.info.password) return this.showMsg(this.getLanguage('请输入新密码'));
				if(!this.info.confirmPassword) return this.showMsg(this.getLanguage('请确认新密码'));
				if(this.info.password !== this.info.confirmPassword) return this.showMsg(this.getLanguage('两次密码不一致'));
				let result = await this.userApi.findPassword({
					type:this.type,
					country_id:this.selectedCountry.id,
					phone:this.info.phone,
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
	.explain{
		font-size:28rpx;
		margin:25rpx;
	}
	.country-popup {
		position: relative;
		border-radius: 30rpx 30rpx 0 0;
		padding: 30rpx;
		padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
	
		.close {
			position: absolute;
			top: 10rpx;
			right: 10rpx;
			z-index: 10;
			width: 60rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
		}
	
		.popup-title {
			position: relative;
			font-size: 32rpx;
			padding-bottom: 30rpx;
	
			&::after {
				content: '';
				display: block;
				width: 100%;
				height: 2rpx;
				background: linear-gradient(to right, transparent 0%, #3E4355 50%, transparent 100%);
				position: absolute;
				bottom: -1rpx;
				left: 0;
			}
		}
	
		.list {
			margin-top: 30rpx;
			max-height: 600rpx;
	
			.item {
				border: 1rpx solid #3E4355;
				border-radius: 20rpx;
				margin-bottom: 20rpx;
				line-height: 80rpx;
				padding:0 30rpx;
				display:flex;
				justify-content: space-between;
				align-items: center;
				
				.flag{
					width:80rpx;
					height:50rpx;
				}
	
				&.active {
					color: #333333;
					font-weight: 600;
					background: linear-gradient(to right bottom, #EDAD4D 0%, #D68B21 100%);
				}
			}
		}
	}
</style>
