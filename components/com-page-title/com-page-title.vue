<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="com-page-title" :class="{'com-shadow':showShadow}" :style="{background:bgColor,color:color}">
			<view class="com-title-box" :style="{
				paddingTop:`${menuButton.top}px`,
				paddingBottom:'10px',
				height:`${menuButton.height}px`,
				lineHeight:`${menuButton.height}px`
			}">
				<!--START 返回按键-->
				<view :style="{
					height:`${menuButton.height}px`,
					lineHeight:`${menuButton.height}px`,
					textAlign:'center',
					width:`${menuButton.height}px`,
					top:`${menuButton.top}px`,
					left:'10px'
				 }" class="com-back cuIcon-back" @click="goBack()" v-if="showBack && !showHome"></view>
				<!--END 返回按键-->
				<!--START 回首页按键-->
				<view :style="{
					height:`${menuButton.height}px`,
					lineHeight:`${menuButton.height}px`,
					textAlign:'center',
					width:`${menuButton.height}px`,
					top:`${menuButton.top}px`,
					left:'10px'
				 }" class="com-go-home cuIcon-homefill" @click="goHome" v-if="showHome"></view>
				<!--END 回首页按键-->
				<!--START 圆圈按键（商品详情使用的示例，隐藏页面头部是出现）-->
				<view :style="{
					height:`${menuButton.height}px`,
					lineHeight:`${menuButton.height}px`,
					textAlign:'center',
					width:`${menuButton.height}px`,
					top:`${menuButton.top}px`,
					left:'10px'
				 }" class="com-back-circle cuIcon-back" :class="{show:showCircle}" v-if="showBack && !showHome" @click="goBack()"></view>
				 <view :style="{
				 	height:`${menuButton.height}px`,
				 	lineHeight:`${menuButton.height}px`,
				 	textAlign:'center',
				 	width:`${menuButton.height}px`,
				 	top:`${menuButton.top}px`,
				 	left:'10px'
				  }" class="com-back-circle cuIcon-homefill" :class="{show:showCircle}" v-if="showHome" @click="goHome"></view>
				<!--END 圆圈按键（商品详情使用的示例，隐藏页面头部是出现）-->
				<!--START 页面标题-->
				<view class="com-title ell1" v-if="!isSearch">{{title}}</view>
				<!--END 页面标题-->
				<!--START 搜索框-->
				<view :style="{
				 	height:`${menuButton.height}px`,
				 	lineHeight:`${menuButton.height}px`,
				 	textAlign:'center',
					margin:`0 ${menuButton.width + 18}px 0 ${(showBack || showHome) ? (menuButton.height + 15) : 15}px`,
					padding:`0 ${'calc('+menuButton.height + 'px + '+ (showSearchButton ? 92 : 0) +'rpx)'} 0 ${menuButton.height}px`
				}" class="com-input-box" v-if="isSearch" @click="clickSearch">
					<view :style="{
						height:`${menuButton.height}px`,
						lineHeight:`${menuButton.height}px`,
						textAlign:'center',
						width:`${menuButton.height}px`,
						top:`0`,
						left:'0'
					 }" class="com-search-icon cuIcon-search"></view>
					<input class="com-input" type="text" :placeholder="placeholder" :value="keyword" @input="onInput"
						@confirm="onSearch" :disabled="searchUrl !== ''">
					<view :style="{
						height:`${menuButton.height}px`,
						lineHeight:`${menuButton.height}px`,
						textAlign:'center',
						width:`${menuButton.height}px`,
						top:`0`,
						right:`${showSearchButton ? 92 : 0}rpx`
					 }" class="com-clear-icon cuIcon-roundclose" v-if="keyword" @click="clearKeyword"></view>
					<view class="com-button" v-if="showSearchButton" @click="onSearch">搜索</view>
					<view :style="{
						height:`${menuButton.height}px`,
						lineHeight:`${menuButton.height}px`,
						top:`${menuButton.top}px`,
						right:'15px'
					 }" class="right-text" v-if="rightText" @click="$emit('rightTextClick')">{{rightText}}</view>
				</view>
				<!--END 搜索框-->
			</view>
		</view>
		<view class="com-placeholder" :style="{
			height:(menuButton.top + menuButton.height + 10)+'px'
		}"></view>
		<!-- #endif -->
		
		<!-- #ifdef H5 || APP-PLUS -->
		<view class="com-page-title" :class="{'com-shadow':showShadow}" :style="{background:bgColor,color:color}">
			<view class="status_bar">
				<!-- 这里是状态栏 -->
			</view>
			<view class="com-title-box">
				<!--START 返回按键-->
				<view class="com-back cuIcon-back" @click="goBack()" v-if="showBack && !showHome"></view>
				<!--END 返回按键-->
				<!--START 回首页按键-->
				<view class="com-go-home cuIcon-homefill" @click="goHome" v-if="showHome"></view>
				<!--END 回首页按键-->
				<!--START 圆形按键（商品详情使用的示例，隐藏页面头部是出现）-->
				<view class="com-back-circle cuIcon-back" :class="{show:showCircle}" v-if="showBack && !showHome" @click="goBack()"></view>
				<view class="com-back-circle cuIcon-homefill" :class="{show:showCircle}" v-if="showHome" @click="goHome"></view>
				<!--END 圆形按键（商品详情使用的示例，隐藏页面头部是出现）-->
				<!--START 页面标题-->
				<view class="com-title ell1" v-if="!isSearch">{{title}}</view>
				<!--END 页面标题-->
				<!--START 搜索框-->
				<view
				:style="{
					margin:`15rpx 30rpx 15rpx ${(showBack || showHome) ? '100rpx' : '30rpx'}`,
					padding:`0 ${'calc(64rpx + '+ (showSearchButton ? 92 : 0) +'rpx)'} 0 64rpx`
				}" 
				class="com-input-box" v-if="isSearch" @click="clickSearch">
					<view class="com-search-icon cuIcon-search"></view>
					<input class="com-input" type="text" :placeholder="placeholder" :value="keyword" @input="onInput"
						@confirm="onSearch" :disabled="searchUrl !== ''">
					<view
					:style="{
						right:`${showSearchButton ? 92 : 0}rpx`
					}" 
					class="com-clear-icon cuIcon-roundclose" v-if="keyword" @click="clearKeyword"></view>
					<view class="com-button" v-if="showSearchButton" @click="onSearch">搜索</view>
				</view>
				<!--END 搜索框-->
				<view class="right-text" v-if="rightText" @click="$emit('rightTextClick')">{{rightText}}</view>
			</view>
		</view>
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<view class="com-placeholder"></view>
		<!-- #endif -->
	</view>
</template>
<!--
<com-page-title title="自提地址管理" />
<com-page-title title="自提地址管理" :showSearchButton="true" :isSearch="true" v-model="keyworod" @onSearch="search" />
-->
<script>
	export default {
		name:'com-page-title',
		props: {
			//标题
			title: {
				type: String,
				default: ''
			},
			//标题颜色
			color: {
				type: String,
				default: '#F5F7FC'
			},
			//背景颜色
			bgColor: {
				type: String,
				default: '#212F3F'
			},
			//是否显示底部阴影
			showShadow: {
				type: Boolean,
				default: true
			},
			//是否显示返回按键
			showBack: {
				type: Boolean,
				default: true
			},
			//是否显示跳转首页按键
			showHome: {
				type: Boolean,
				default: false
			},
			//是否显示圆圈返回按键
			showCircle: {
				type: Boolean,
				default: false
			},
			//是否搜索框
			isSearch: {
				type: Boolean,
				default: false
			},
			//搜索框默认值
			value: {
				type: String,
				default: ''
			},
			//输入框placeholder
			placeholder: {
				type: String,
				default: '输入关键字搜索'
			},
			//是否显示搜索按键
			showSearchButton: {
				type: Boolean,
				default: false
			},
			//点击搜索跳转页面url
			searchUrl: {
				type: String,
				default: ''
			},
			//右边按钮文字
			rightText: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				menuButton: {
					top: 30,
					height: 35
				},
				keyword: this.value
			}
		},
		async mounted() {
			//获取小程序胶囊按键信息
			// #ifdef MP-WEIXIN
			let menuButtonInfo = uni.getStorageSync('menuButtonInfo');
			if (menuButtonInfo) {
				this.menuButton = menuButtonInfo;
			} else {
				let info = await wx.getMenuButtonBoundingClientRect();
				uni.setStorageSync('menuButtonInfo', info);
				this.menuButton = info;
			}
			// #endif
		},
		//监听父组件值得变化
		watch: {
			value: {
				handler(e) {
					return this.keyword = e
				}
			}
		},
		methods: {
			// 键盘输入的值
			onInput(e) {
				this.$emit('update:modelValue', e.detail.value);
				this.keyword = e.detail.value;
			},
			//清除关键字
			clearKeyword() {
				this.$emit('update:modelValue', '');
				this.keyword = '';
			},
			//搜索
			onSearch() {
				this.$emit('onSearch', this.keyword);
			},
			//点击搜索框
			clickSearch(){
				if(!this.searchUrl) return false;
				this.goPage(this.searchUrl);
			},
			//跳转到首页
			goHome() {
				this.goPage('/pages/index/index','reLaunch');
			}
		}
	}
</script>

<style lang="scss">
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.com-page-title {
		position: fixed;
		width: 100%;
		left: 0;
		top: 0;
		background: #fff;
		color: #333;
		z-index: 1100;
		transition: all .2s linear;
		-webkit-transition: all .2s linear;
		
		&.com-shadow{
			box-shadow: 0 0 10rpx 0 #212F3F;
		}

		.com-title-box {
			&:before {
				content: ' ';
				display: table;
			}

			position:relative;
			text-align: center;
			height: 96rpx;
			line-height: 96rpx;
			font-size: 32rpx;
			box-sizing: content-box;

			.com-back {
				position: absolute;
				width: 96rpx;
				height: 96rpx;
				line-height: 96rpx;
				text-align: center;
				left: 0;
				top: 0;
				font-size: 32rpx;
				box-sizing: border-box;
			}

			.com-go-home {
				position: absolute;
				width: 60rpx;
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				left: 30rpx;
				top: 18rpx;
				font-size: 32rpx;
				box-sizing: border-box;
				background: rgba(0, 0, 0, 0.2);
				border-radius: 100%;
			}
			
			.com-back-circle{
				position: absolute;
				width: 60rpx;
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				left: 30rpx;
				top: 18rpx;
				font-size: 32rpx;
				box-sizing: border-box;
				color:#fff;
				background: rgba(0, 0, 0, 0.2);
				border-radius: 100%;
				opacity: 0;
				pointer-events: none;
				//为了不和原有返回按键切换时重叠
				transition: all 0s linear;
				-webkit-transition: all 0s linear;
				transition-delay: 0s;
				-webkit-transition-delay: 0s;
				&.show{
					//为了不和原有返回按键切换时重叠
					transition: all .2s linear;
					-webkit-transition: all .2s linear;
					transition-delay: .2s;
					-webkit-transition-delay: .2s;
					opacity: 1;
					pointer-events: auto;
				}
				
			}

			.com-title {
				font-size:34rpx;
				width: 70%;
				margin: 0 auto;
			}

			.com-input-box {
				position: relative;
				border:1rpx solid #E5E5E5;
				border-radius: 100rpx;
				height: 66rpx;
				margin: 15rpx 30rpx 15rpx 100rpx;
				box-sizing: border-box;
				padding: 0 70rpx;
				font-size: 28rpx;
				overflow: hidden;

				.com-search-icon {
					position: absolute;
					width: 64rpx;
					height: 64rpx;
					text-align: center;
					line-height: 64rpx;
					left: 0;
					top: 0;
				}

				.com-clear-icon {
					position: absolute;
					width: 64rpx;
					height: 64rpx;
					text-align: center;
					line-height: 64rpx;
					right: 0;
					top: 0;
				}

				.com-input {
					height: 100%;
					width: 100%;
					text-align: left;
					font-size: 28rpx;
				}
				
				.com-button{
					position:absolute;
					top:0;
					right:0;
					background:#E5E5E5;
					height:64rpx;
					line-height:64rpx;
					width:92rpx;
					text-align:center;
				}
			}
			.right-text{
				position:absolute;
				top:0;
				right:25rpx;
				font-size:30rpx;
			}
		}

	}

	.com-placeholder {
		height: 96rpx;
	}
</style>