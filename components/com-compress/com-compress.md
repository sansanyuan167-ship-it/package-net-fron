## 图片压缩

key	       是否必选	 default	说明
src	       必选      	-	    要压缩的图片地址
maxSize	   可选	       900	    最大尺寸
minSize	   可选	       640	    最小尺寸
fileType   可选	      'jpg'	    压缩后文件类型
quality	   可选	       0.7	    压缩质量


```js
uni.chooseImage({
	count: 1,
	sizeType: ['original', 'compressed'],
	sourceType: ['album', 'camera'],
	success: res => {
		const compressParams = {
			src: res.tempFilePaths[0],
			quality: 0.9
		};
		this.$refs['soCompress'].compress(compressParams).then(filePath => {
			console.log(filePath);
			// uni.uploadFile({
			// 	url: baseUrl + '/upload',
			// 	filePath: filePath,
			// 	name: 'file',
			// 	success: (uploadFileRes) => {}
			// })
		})
	},
	fail: res => {
		console.log(res);
	}
});
```