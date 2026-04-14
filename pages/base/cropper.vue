<template>
	<view class="page-container">
		<tui-image-cropper :width="width" :height="height" :lockWidth="true" :lockHeight="true" :scaleRatio="1" :lockRatio="true" :imageUrl="imageUrl" @ready="ready" @cropper="cropper"></tui-image-cropper>
		<com-loading-msg ref="loadingMsg" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			type:'avatar', //裁剪图片的类型
			width:100, //裁剪宽度
			height:100, //裁剪高度
			
			key:'', //记录的字段
			
			
			src: '',
			imageUrl: '' //要裁剪的图片
		};
	},
	onLoad(options) {
		this.type = options.type;
		this.width = parseInt(options.width);
		this.height = parseInt(options.height);
		if(options.key) this.key = options.key;
		this.src = options.src || '';
		//如果从上个页面传值时可显示loading
		this.src &&
			uni.showLoading({
				title: '请稍候...',
				mask: true
			});
	},
	methods: {
		ready() {
			this.imageUrl = this.src;
		},
		cropper(e) {
			//console.log(e.url);
			let that = this;
			let result = e.url;
			//#ifdef MP-WEIXIN
			//图片转换 base64
			that.wx_getFileSystemManager_readFile(result,"base64",function(data){
			    var result = "data:image/jpeg;base64," + data.data;
			    //console.log(result);
				that.upload_image(result);
			})
			//#endif
			//#ifdef H5
			that.upload_image(result);
			//#endif
			//#ifdef APP-PLUS
			const path = plus.io.convertLocalFileSystemURL(result) //绝对路径
			const fileReader = new plus.io.FileReader()
			fileReader.readAsDataURL(path)
			fileReader.onloadend = (res) => { //读取文件成功完成的回调函数
				//console.log(res.target.result) //输出base64内容
				that.upload_image(res.target.result);
			}
			//#endif
		},
		wx_getFileSystemManager_readFile: function (filePath, encoding, callback) {
		    var _this = this;
		    wx.getFileSystemManager().readFile({
				filePath: filePath,
				encoding: encoding,
				success: function (res) {
					callback(res);
				}
		    });
		},
		async upload_image(file) {
			// console.log(file);
			// return false;
			this.$refs['loadingMsg'].show('上传中...');
			let result = await this.baseApi.upload({
				base64_file:file
			});
			this.$refs['loadingMsg'].hide();
			//触发监听的事件
			uni.$emit('cropperFile', {
				type: this.type,
				file: result.data
			});
			this.goBack();
		}
	}
};
</script>

<style></style>
