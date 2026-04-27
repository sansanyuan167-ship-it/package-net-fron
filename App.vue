	<script>
	import { baseApi } from '@/api/baseApi.js'
	
	export default {
		globalData: {
			appName:'Game',
			going:true
		},
		async onLaunch() {
			console.log('App Launch');
			
			// 获取并缓存系统语言
			if(!uni.getStorageSync('language')){
				this.setSystemLanguage();
			}
			
			// 检查URL中是否含有code参数
			const code = this.checkUrlForCode();
			console.log('URL code value:', code);
			
			// 如果有code参数，保存邀请码；否则检查是否需要选择国家
			if (code) {
				uni.setStorageSync('invite_code', code);
			} else {
				let country = uni.getStorageSync('country');
				console.log('Country from storage:', country);
				if (!country) {
					// 先请求获取国家列表
					try {
						const result = await baseApi.countryList();
						const countryList = result.data || [];
						
						// 如果只有一个国家选项，直接默认选中
						if (countryList.length === 1) {
							const defaultCountry = countryList[0];
							uni.setStorageSync('country', defaultCountry.key);
							console.log('Auto selected country:', defaultCountry.key);
							// 不需要跳转，继续执行后续逻辑（如果需要的话可以跳转到首页）
						} else {
							// 有多个选项，跳转到选择页面
							uni.reLaunch({
								url: '/pages/base/country'
							});
						}
					} catch (error) {
						console.error('Get country list error:', error);
						// 请求失败时，仍然跳转到选择页面
						uni.reLaunch({
							url: '/pages/base/country'
						});
					}
				}
			}
		},
		onShow() {
			console.log('App Show');
		},
		onHide() {
			console.log('App Hide');
		},
		methods: {
			// 检查URL中是否含有code参数，并返回code值
			checkUrlForCode() {
				try {
					// H5端
					// #ifdef H5
					const urlParams = new URLSearchParams(window.location.search);
					return urlParams.get('code') || null;
					// #endif
					
					// 小程序/APP端
					// #ifndef H5
					const launchOptions = uni.getLaunchOptionsSync();
					const query = launchOptions.query || {};
					return query.code || null;
					// #endif
				} catch (e) {
					console.error('Check URL code error:', e);
					return null;
				}
			},
			// 获取并设置系统语言
			setSystemLanguage() {
				try {
					let language = '';
					
					// H5端使用 navigator.language
					// #ifdef H5
					if (typeof navigator !== 'undefined' && typeof navigator.language === 'string') {
						language = navigator.language;
					}
					// #endif
					
					// 小程序/APP端使用 uni.getSystemInfoSync().language
					// #ifndef H5
					if (!language) {
						try {
							const systemInfo = uni.getSystemInfoSync();
							language = systemInfo.language;
						} catch (e) {
							console.error('Get system info error:', e);
						}
					}
					// #endif
					
					// 如果获取失败，使用默认值
					if (!language) {
						language = 'zh-CN';
					}
					
					// 将各种英语变体统一映射为 'en'
					if (language.startsWith('en')) {
						language = 'en';
					}
					
					// 缓存语言设置
					uni.setStorageSync('language', language);
					console.log('System language set to:', language);
				} catch (e) {
					console.error('Set system language error:', e);
					// 出错时设置默认语言
					uni.setStorageSync('language', 'zh-CN');
				}
			}
		}
	}
</script>

<style lang="scss">
	
	@import "static/css/icon.css";
	@import "static/css/common.scss";
	
	.page-container{
		// width:500px;
	}
	
</style>