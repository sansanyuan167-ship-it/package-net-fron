<template>
	<view class="page-container">
		<com-page-title :title="getLanguage('个人信息')" />
		<view class="avatar-box panel-item" @click="$refs['popup'].show();">
			<image :src="info.avatar" @click.stop="previewImage(info.avatar)"></image>
			<text>{{getLanguage('点击更换头像')}}</text>
			<text class="open text-gray cuIcon-right"></text>
		</view>
		<view class="info-box panel-item">
			<view class="item">
				<view class="key">{{getLanguage('用户昵称')}}</view>
				<input v-model="info.nickname" type="text" :placeholder="getLanguage('请输入你的昵称')" placeholder-style="color:#AFAFAF;">
			</view>
		</view>
		<view class="btn-block" @click="save">{{getLanguage('点击保存')}}</view>
		<!--上传相册类型弹窗-->
		<com-popup ref="popup" model="bottom">
			<view class="add-pic-box panel-bg">
				<view class="items">
					<view class="item border-bottom" @click="upload('camera')"><text class="cuIcon-cameraadd"></text>手机拍照</view>
					<view class="item border-bottom" @click="upload('album')"><text class="cuIcon-album"></text>相册选择</view>
				</view>
				<view class="cancel text-red" @click="$refs['popup'].hide();">取消</view>
			</view>
		</com-popup>
		<!--END 上传相册类型弹窗-->
		<com-page-loading ref="pageLoading" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			info:{
				avatar:''
			}
		};
	},
	async onLoad(options) {
		//创建事件监听
		uni.$on('cropperFile', async (e) => {
			//判断类型
			if (e.type == 'avatar'){
				let result = await this.userApi.saveUserInfo({
					key:'avatar',
					value:e.file
				});
				this.showMsg(result.msg);
				if(!result.status) return false;
				this.info.avatar = e.file;
			}
		});
	},
	onUnload() {
		//取消监听
		uni.$off('cropperFile');
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
		// 选择头像图片
		upload(type) {
			this.$refs['popup'].hide();
			this.chooseImageFun(type,(res) => {
				this.goPage('/pages/base/cropper?src=' + res + '&type=avatar&width=300&height=300');
			});
		},
		// 保存
		async save(){
			if(!this.info.nickname) return this.showMsg(this.getLanguage('请输入你的昵称'));
			let result = await this.userApi.saveUserInfo({
				key:'nickname',
				value:this.info.nickname
			});
			this.showMsg(result.msg);
			if(!result.status) return false;
			setTimeout(() => {
				this.goBack();
			},1000);
		}
	}
};
</script>

<style lang="scss" scoped>
	.avatar-box{
		padding:25rpx;
		display:flex;
		justify-content: flex-start;
		align-items: center;
		gap:20rpx;
		font-size:30rpx;
		image{
			width:100rpx;
			height:100rpx;
			border-radius:100rpx;
			border:2rpx solid rgba(224,162,44,0.8);
		}
		.open{
			margin-left:auto;
		}
	}
	
	.info-box{
		padding:5rpx 25rpx;
		.item{
			position:relative;
			line-height:50rpx;
			display:flex;
			justify-content: flex-start;
			align-items: center;
			padding:25rpx 0;
			.key{
				
			}
			input{
				height:50rpx;
				text-align:right;
				flex:1;
			}
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
		}
	}
	
	.add-pic-box {
		.items{
			.item {
				padding: 25rpx;
				
				text {
					font-size: 34rpx;
					padding-right: 10rpx;
				}
			}
		}
		.cancel {
			padding: 25rpx;
		}
	}
</style>
