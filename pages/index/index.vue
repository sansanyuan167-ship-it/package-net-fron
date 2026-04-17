<template>
	<view class="page-container" style="padding-bottom:0;">
		<home ref="home" v-show="current == 'home'" @showLoading="showLoading" @hideLoading="hideLoading"
			@showLanguage="showLanguage" />
		<activity ref="activity" v-show="current == 'activity'" @showLoading="showLoading" @hideLoading="hideLoading" />
		<share ref="share" v-show="current == 'share'" @showLoading="showLoading" @hideLoading="hideLoading" />
		<vip ref="vip" v-show="current == 'vip'" @showLoading="showLoading" @hideLoading="hideLoading" />
		<mine ref="mine" v-show="current == 'mine'" @showLoading="showLoading" @hideLoading="hideLoading"
			@showLanguage="showLanguage" />

		<view class="tab-bar">
			<view class="tab-bar-item" :class="{
				'active':current == item.name,
				'center':item.name == 'share'
			}" v-for="(item,index) in tabBar" :key="index" @click="clickTab(index)">
				<view class="image-box">
					<image :src="item.iconPath"></image>
				</view>
				<view>{{item.text}}</view>
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

		<com-page-loading ref="pageLoading" />
	</view>
</template>

<script>
	import home from './home.vue';
	import activity from './activity.vue';
	import share from './share.vue';
	import vip from './vip.vue';
	import mine from './mine.vue';
	export default {

		components: {
			home,
			activity,
			share,
			vip,
			mine
		},
		data() {
			return {
				isFirst:true,
				// 当前页
				current: 'home',
				// 菜单列表
				tabBar: [{
						name: 'home',
						text: this.getLanguage('首页'),
						iconPath: '/static/tab-bar-icon/home.png'
					},
					{
						name: 'activity',
						text: this.getLanguage('活动'),
						iconPath: '/static/tab-bar-icon/activity.png'
					},
					{
						name: 'share',
						text: this.getLanguage('分享赚钱'),
						iconPath: '/static/tab-bar-icon/share-icon.png'
					},
					{
						name: 'vip',
						text: this.getLanguage('vip'),
						iconPath: '/static/tab-bar-icon/vip.png'
					},
					{
						name: 'mine',
						text: this.getLanguage('我的'),
						iconPath: '/static/tab-bar-icon/mine.png'
					}
				],
				// 记录首次打开状态
				tabBarStatus: {
					home: false,
					activity: false,
					share: false,
					vip: false,
					mine: false
				},
				languageKey: null,
				language: []
			};
		},
		async onLoad(options) {
			this.current = options.name || 'home';
			this.$nextTick(() => {
				this.$refs[this.current].pageOnLoad();
				// 更新首次打开状态
				this.tabBarStatus[this.current] = true;
				this.$refs[this.current].pageOnShow();
			});
			this.languageKey = uni.getStorageSync('language') || 'zh-CN';
			let result = await this.baseApi.getLanguageList();
			this.language = result.data;
		},
		onShow() {
			this.$nextTick(() => {
				if (!this.tabBarStatus[this.current]) {
					this.$refs[this.current].pageOnLoad();
					this.tabBarStatus[this.current] = true;
				}
				if(!this.isFirst) this.$refs[this.current].pageOnShow();
				this.isFirst = false;
			});
		},
		methods: {
			// 按键切换
			clickTab(index) {
				let name = this.tabBar[index].name;
				if (this.current == name) return false;
				this.current = name;
				if (!this.tabBarStatus[this.current]) {
					this.$refs[this.current].pageOnLoad();
					this.tabBarStatus[this.current] = true;
				}
				this.$refs[this.current].pageOnShow();
				// 改变路由，不加载页面
				// if(this.current == 'home'){
				// 	history.replaceState({path: '#/'}, '', '#/');
				// }else{
				// 	history.replaceState({path: `#/?name=${this.current}`}, '', `#/?name=${this.current}`);
				// }
			},
			// 显示遮罩加载
			showLoading() {
				this.$nextTick(() => {
					this.$refs['pageLoading'].show();
				});
			},
			// 隐藏遮罩加载
			hideLoading() {
				this.$nextTick(() => {
					this.$refs['pageLoading'].hide();
				});
			},
			// 显示语言弹窗
			showLanguage() {
				this.$refs['changeLanguagePopup'].show();
			},
			// 切换语言
			changeLanguage(item) {
				this.languageKey = item.key;
				this.$refs['changeLanguagePopup'].hide();
				this.showMsg(this.getLanguage('切换语言成功'));
				uni.setStorageSync('language', item.key);
				setTimeout(() => {
					this.goPage('/pages/index/index', 'reLaunch');
				}, 1000);
			}
		}
	};
</script>

<style lang="scss" scoped>
	/**高度160rpx**/
	.tab-bar {
		position: fixed;
		width: 100%;
		left: 0;
		bottom: 0;
		z-index: 100;
		background: url('/static/tab-bar-icon/tab-bar-bg.png') center center no-repeat;
		background-size: 100% 100%;
		display: flex;
		justify-content: space-between;
		padding: 56rpx 0 10rpx 0;
		padding-bottom: calc(10rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(10rpx + env(safe-area-inset-bottom));

		.tab-bar-item {
			width: 100%;
			color: #E3E3E5;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			.image-box {
				position: relative;
				margin: 0 auto;
				width: 52rpx;
				height: 52rpx;

				image {
					display: block;
					width: 100%;
					height: 100%;
					transition: all .1s linear;
					-webkit-transition: all .1s linear;
				}
			}

			view {
				font-size: 24rpx;
				line-height: 40rpx;
				margin-top: 2rpx;
			}

			&.center {
				.image-box {
					width: 40rpx;
					height: 52rpx;

					image {
						position: relative;
						top: -20rpx;
						left: 0;
						border-radius: 100%;
						transform: scale(2);
						-webkit-transform: scale(2);
					}
				}
			}

			&.active {
				color: #BFC9E0;

				image {
					transform: scale(1.2);
					-webkit-transform: scale(1.2);
				}

				view {
					font-weight: 600;
					display: inline-block;
					background-image: linear-gradient(to right bottom, #FDF13C, #FF8133);
					-webkit-background-clip: text;
					color: transparent;
				}

				&.center {
					.image-box {
						image {
							transform: scale(2.2);
							-webkit-transform: scale(2.2);
							top: -25rpx;
						}
					}
				}
			}
		}
	}
	
	@media screen and (min-width: 768px) {
		.tab-bar{
			width:500px !important;
			left:calc((100vw - 500px) / 2) !important;
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