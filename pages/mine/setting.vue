<template>
	<view class="page-container">
		<com-page-title :title="getLanguage('通用设置')" />
		<view class="menu-list panel-item">
			<view class="item" @click="goPage('/pages/mine/editEmail?email=' + encodeURIComponent(info.email))">
				<text class="icon cuIcon-mail"></text>
				<view class="key" v-if="info.email">{{getLanguage('修改邮箱')}}</view>
				<view class="key" v-if="info.email === ''">{{getLanguage('绑定邮箱')}}</view>
				<text class="open cuIcon-right"></text>
			</view>
			<view class="item" @click="goPage('/pages/mine/editPassword')">
				<text class="icon cuIcon-lock"></text>
				<view class="key">{{getLanguage('修改登录密码')}}</view>
				<text class="open cuIcon-right"></text>
			</view>
			<view class="item" @click="goPage('/pages/mine/cashPassword')">
				<text class="icon cuIcon-lock"></text>
				<view class="key">{{getLanguage('修改资金密码')}}</view>
				<text class="open cuIcon-right"></text>
			</view>
			<view class="item" @click="goPage('/pages/mine/editWithdraw')">
				<text class="icon cuIcon-pay"></text>
				<view class="key">{{getLanguage('修改提现信息')}}</view>
				<text class="open cuIcon-right"></text>
			</view>
		</view>
		<view class="menu-list panel-item">
			<view class="item" @click="goPage('/pages/mine/articles?type=agreement')">
				<text class="icon cuIcon-people"></text>
				<view class="key">{{getLanguage('用户协议')}}</view>
				<text class="open cuIcon-right"></text>
			</view>
			<view class="item" @click="goPage('/pages/mine/articles?type=privacy')">
				<text class="icon cuIcon-command"></text>
				<view class="key">{{getLanguage('隐私政策')}}</view>
				<text class="open cuIcon-right"></text>
			</view>
			<view class="item" @click="goPage('/pages/mine/articles?type=about_us')">
				<text class="icon cuIcon-activity"></text>
				<view class="key">{{getLanguage('关于我们')}}</view>
				<text class="open cuIcon-right"></text>
			</view>
		</view>
		<view class="menu-list panel-item">
			<view class="item">
				<text class="icon cuIcon-vip"></text>
				<view class="key">{{getLanguage('应用版本号')}}</view>
				<text class="right-text">1.0.1</text>
			</view>
		</view>
		<view class="btn-block" @click="$refs['confirm'].show()">
			<text class="icon cuIcon-exit"></text>
			<text>{{getLanguage('退出登录')}}</text>
		</view>
		<com-confirm ref="confirm" :content="getLanguage('你确认退出登录吗？')" @onCancel="$refs['confirm'].hide()" @onConfirm="logout" />
		<com-page-loading ref="pageLoading" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			info:{}
		};
	},
	async onLoad(options) {
		
	},
	async onShow(){
		await this.getUserInfo();
		this.$nextTick(() => {
			this.$refs['pageLoading'].hide();
		});
	},
	methods: {
		// 获取用户信息
		async getUserInfo(){
			let result = await this.userApi.getUserInfo();
			this.info = result.data;
		},
		// 退出登录
		logout(){
			this.$refs['confirm'].hide();
			uni.removeStorageSync('token');
			this.goPage('/pages/index/index','reLaunch');
		}
	}
};
</script>

<style lang="scss" scoped>
	.menu-list{
		padding:5rpx 25rpx;
		.item{
			position:relative;
			display:flex;
			justify-content: flex-start;
			align-items: center;
			padding:30rpx 0;
			&::after{
				content:'';
				display:block;
				width:100%;
				height:2rpx;
				background:linear-gradient(to right,transparent 0%,#212434 50%,transparent 100%);
				position:absolute;
				bottom:-1rpx;
				left:0;
			}
			&:last-child::after{
				display:none;
			}
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
			.open{
				margin-left:auto;
			}
			.right-text{
				margin-left:auto;
			}
		}
	}
</style>
