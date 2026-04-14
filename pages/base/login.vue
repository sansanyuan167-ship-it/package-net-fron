<template>
	<view class="page-container">
		<com-page-title :title="getLanguage('登录')" :showHome="true" :rightText="getLanguage('语言切换')" @rightTextClick="$refs['changeLanguagePopup'].show()" />
		<view class="logo-box">
			<image class="logo" :src="config.platform_logo" mode="widthFix"></image>
			<view class="title bold">{{config.platform_name}}</view>
		</view>
		<view class="info-box panel-item">
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
		</view>
		<view class="btn-block" @click="login">{{getLanguage('立即登录')}}</view>
		<view class="register" @click="goPage('/pages/base/register','redirect')">{{getLanguage('暂无账号，去注册')}}</view>
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
				agreement:true,
				config:{},
				info:{
					username:'',
					password:''
				},
				showPassword:false,
				languageKey: null,
				language: []
			}
		},
		async onLoad(options) {
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
			// 切换语言
			changeLanguage(item) {
				this.languageKey = item.key;
				this.$refs['changeLanguagePopup'].hide();
				this.showMsg(this.getLanguage('切换语言成功'));
				setTimeout(() => {
					uni.setStorageSync('language', item.key);
					this.goPage('/pages/base/login', 'reLaunch');
				}, 1000);
			},
			// 登录
			async login(){
				if(!this.info.username) return this.showMsg(this.getLanguage('请输入用户名'));
				if(!this.info.password) return this.showMsg(this.getLanguage('请输入登录密码'));
				if(!this.agreement) return this.showMsg(this.getLanguage('请阅读并同意协议和政策')); 
				let result = await this.loginApi.login({
					username:this.info.username,
					password:this.info.password
				});
				this.showMsg(result.msg);
				if(!result.status) return false;
				uni.setStorageSync('token',result.data.token);
				let info = {
					msg:this.getLanguage('登录成功'),
					path:'/pages/index/index'
				};
				this.goPage('/pages/base/success?info=' + encodeURIComponent(JSON.stringify(info)),'redirect');
			}
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
			margin:60rpx auto 30rpx;
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
		margin-top:60rpx;
		.item{
			margin-top:40rpx;
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
				margin-top:20rpx;
				padding:15rpx 25rpx;;
				border-radius:12rpx;
				display:flex;
				justify-content: space-between;
				align-items: center;
				input{
					width:100%;
					height:60rpx;
					flex:1;
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
	.register{
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
