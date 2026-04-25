<template>
	<view class="page-container">
		<com-page-title :title="getLanguage('注册')" :showHome="true" :rightText="getLanguage('语言切换')" @rightTextClick="$refs['changeLanguagePopup'].show()" />
		<view class="logo-box">
			<image class="logo" :src="config.platform_logo" mode="widthFix"></image>
			<view class="title bold">{{config.platform_name}}</view>
		</view>
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
			<view class="item">
				<view class="key">
					<text class="icon cuIcon-people"></text>
					<text>{{getLanguage('用户名')}}</text>
				</view>
				<view class="input">
					<input v-model="info.username" type="text" :placeholder="getLanguage('请输入用户名')" placeholder-style="color:#AFAFAF;">
				</view>
			</view>
			<view class="item">
				<view class="key">
					<text class="icon cuIcon-lock"></text>
					<text>{{getLanguage('密码')}}</text>
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
			<view class="item">
				<view class="key">
					<text class="icon cuIcon-friendadd"></text>
					<text>{{getLanguage('邀请码')}}</text>
				</view>
				<view class="input">
					<input v-model="info.invite_code" type="text" :placeholder="getLanguage('请输入邀请码')" placeholder-style="color:#AFAFAF;">
				</view>
			</view>
		</view>
		<view class="btn-block" @click="register">{{getLanguage('立即注册')}}</view>
		<view class="login" @click="goPage('/pages/base/login','redirect')">{{getLanguage('已有账号，去登录')}}</view>
		<view class="agreement" @click="agreement = !agreement">
			<view :class="['select-icon text-gray',{
				'cuIcon-roundcheck':!agreement,
				'cuIcon-roundcheckfill':agreement,
				'text-orange':agreement
			}]"></view>
			<view class="content">
				<text>{{getLanguage('我已阅读并同意')}}</text>
				<text class="link text-orange" @click.stop="goPage('/pages/mine/articles?type=agreement')">《{{getLanguage('用户协议')}}》</text>
				<text>、</text>
				<text class="link text-orange" @click.stop="goPage('/pages/mine/articles?type=privacy')">《{{getLanguage('隐私政策')}}》</text>
			</view>
		</view>
		
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
		
		<!-- START 切换语言弹窗 -->
		<com-popup ref="changeLanguagePopup" model="bottom">
			<view class="change-language-popup panel-bg">
				<text class="close cuIcon-close" @click="$refs['changeLanguagePopup'].hide()"></text>
				<view class="popup-title">{{getLanguage('语言切换')}}</view>
				<scroll-view scroll-y class="list">
					<view class="item" :class="{'active':item.key == languageKey}" v-for="(item,index) in language"
						:key="index" @click="changeLanguage(item)">
						<text>{{item.name}}</text>
					</view>
				</scroll-view>
			</view>
		</com-popup>
		<!-- END 切换语言弹窗 -->
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				buttonText:this.getLanguage('获取验证码'),
				time:60,
				timer:null,
				isDis:false,
				config:{},
				info:{
					code:'1234'
				},
				showPassword:false,
				agreement:true,
				selectedCountry:{},
				countryList:[],
				languageKey: null,
				language: []
			}
		},
		async onLoad(options) {
			await this.getCountryList();
			this.languageKey = uni.getStorageSync('language') || 'zh-CN';
			this.getConfig();
			this.getLanguageList();
		},
		onShow() {
			
		},
		methods: {
			// 获取配置
			async getConfig(){
				let result = await this.baseApi.getConfig({
					key:'platform_name,platform_logo'
				});
				this.config = result.data;
			},
			// 获取语言列表
			async getLanguageList(){
				let result = await this.baseApi.getLanguageList();
				this.language = result.data;
			},
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
			// 切换语言
			changeLanguage(item) {
				this.languageKey = item.key;
				this.$refs['changeLanguagePopup'].hide();
				this.showMsg(this.getLanguage('切换语言成功'));
				setTimeout(() => {
					uni.setStorageSync('language', item.key);
					this.goPage('/pages/base/register', 'reLaunch');
				}, 1000);
			},
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
				if(this.isDis) return false;
				this.isDis = true;
				this.setTime();
				if(!this.selectedCountry.key) return this.showMsg(this.getLanguage('请选择国家'));
				if(!this.info.phone) return this.showMsg(this.getLanguage('请输入手机号'));
				let result = await this.loginApi.getPhoneCode({"phone":this.selectedCountry.code+this.info.phone,"scene":"REGISTER"});
				if(!result.status){
					this.isDis = false;
					this.time = 0;
					this.buttonText = this.getLanguage('获取验证码');
					return this.showMsg(result.msg);
				}
			},
			// 注册
			async register(){
				if(!this.selectedCountry.key) return this.showMsg(this.getLanguage('请选择国家'));
				if(!this.info.phone) return this.showMsg(this.getLanguage('请输入手机号'));
				if(!this.info.code) return this.showMsg(this.getLanguage('请输入手机验证码'));
				if(!this.info.username) return this.showMsg(this.getLanguage('请输入用户名'));
				if(!this.info.password) return this.showMsg(this.getLanguage('请输入登录密码'));
				if(!this.agreement) return this.showMsg(this.getLanguage('请阅读并同意协议和政策')); 
				let register_coin = uni.getStorageSync('register_coin') || 0;
				let result = await this.loginApi.register({
					country_id:this.selectedCountry.id,
					phone:this.info.phone,
					code:this.info.code,
					username:this.info.username,
					password:this.info.password,
					invite_code:this.info.invite_code,
					register_coin:register_coin
				});
				if(!result.status) return this.showMsg(result.msg);
				uni.removeStorageSync('register_coin');
				uni.setStorageSync('token',result.data.token);
				let info = {
					msg:this.getLanguage('注册成功'),
					path:'/pages/index/index'
				};
				this.goPage('/pages/base/success?info=' + encodeURIComponent(JSON.stringify(info)),'redirect');
			},
		}
	}
</script>

<style lang="scss" scoped>
	.logo-box{
		display:flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		.logo{
			display:block;
			width:180rpx;
			margin:40rpx auto 20rpx;
		}
		.title{
			font-size:42rpx;
			display: inline-block;
			background-image: linear-gradient(to right bottom, #FDF13C, #FF8133);
			-webkit-background-clip: text;
			color: transparent;
		}
	}
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
				.input-icon{
					width:60rpx;
					height:60rpx;
					line-height:60rpx;
					text-align:center;
					font-size:32rpx;
				}
			}
		}
	}
	.login{
		text-align:center;
		margin:30rpx auto 0;
		line-height:60rpx;
		font-size:28rpx;
	}
	.agreement{
		padding:50rpx 25rpx 30rpx 25rpx;
		display:flex;
		justify-content: flex-start;
		align-items: flex-start;
		font-size:28rpx;
		.select-icon{
			width:40rpx;
			height:40rpx;
			line-height:40rpx;
			text-align:center;
			font-size:34rpx;
			margin-right:8rpx;
		}
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
	
	.change-language-popup {
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
	
				&.active {
					color: #333333;
					font-weight: 600;
					background: linear-gradient(to right bottom, #EDAD4D 0%, #D68B21 100%);
				}
			}
		}
	}
</style>
