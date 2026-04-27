import {
	IMG_HOST
} from '@/common/config';


import Vue from 'vue';


//导入权限判断工具
//#ifdef APP-PLUS
import permision from "@/common/utils/permission.js";
//#endif


/*
 * 页面跳转函数
 * url  =>  跳转地址
 * type =>  跳转方式  navigate  redirect  switchTab  reLaunch  navigateBack
 */
Vue.prototype.goPage = function(url, type) {
	//type 不传默认navigate跳转
	type = type || 'navigate';
	//避免跳转两次
	if (getApp().globalData.going) {
		getApp().globalData.going = false;
		switch (type) {
			case 'navigate':
				uni.navigateTo({
					url: url
				});
				break;
			case 'redirect':
				uni.redirectTo({
					url: url
				});
				break;
			case 'switchTab':
				uni.switchTab({
					url: url
				});
				break;
			case 'reLaunch':
				uni.reLaunch({
					url: url
				});
				break;
			case 'navigateBack':
				uni.navigateBack({
					delta: 1
				});
				break;
		}
		setTimeout(function() {
			getApp().globalData.going = true;
		}, 1000);
	} else {
		console.log('重复点击了');
	}
}


/*
 *反馈弹窗提示
 * msg       =>  提示信息
 * duration  =>  弹窗时间
 * icon      =>  弹窗图标 none success loading
 */
Vue.prototype.showMsg = function(msg, duration, icon) {
	//duration 不传默认1s
	duration = duration || 1000;
	//icon 不传默认none
	icon = icon || 'none'
	uni.showToast({
		title: msg,
		duration: duration,
		icon: icon
	});
}

/*
 * 获取用户TOKEN
 */
Vue.prototype.getToken = function() {
	return uni.getStorageSync('token');
}

/*
 * 获取对应语言文字
 */
Vue.prototype.getLanguage = function(key,replace) {
	let languageKey = uni.getStorageSync('language') || 'zh-CN';
	let str = this.languageText[languageKey][key];
	if(replace && str) str = str.replace('@REPLACE@',replace);
	return str;
}


/*
 * 返回上级页面
 * num => 返回num级
 */
Vue.prototype.goBack = function(num) {
	num = num || 1;
	uni.navigateBack({
		delta: num
	});
}


/*
 * 回到页面顶部
 */
Vue.prototype.goPageTop = function() {
	uni.pageScrollTo({
		scrollTop: 0,
		duration: 150
	});
}


/*
 * 图片预览
 */
Vue.prototype.previewImage = function(current, list) {
	if (!current) return false;
	list = list || [current];
	uni.previewImage({
		urls: list,
		current: current
	});
}


/*
 * 获取图片URL 拼接HOST
 */
Vue.prototype.iconHost = function(path) {
	return IMG_HOST + path;
}


/*
 * 复制
 * text => 复制的内容
 * msg  => 复制成功后提示的内容
 */
Vue.prototype.copyText = function(text, msg) {
	let that = this;
	//#ifdef APP-PLUS || MP-WEIXIN
	uni.setClipboardData({
		data: text,
		success: function() {
			that.showMsg(msg || this.getLanguage('复制成功'));
		},
		fail: function() {
			that.showMsg(this.getLanguage('复制失败'));
		}
	});
	//#endif
	//#ifdef H5 
	let textarea = document.createElement("textarea");
	textarea.value = text;
	textarea.readOnly = "readOnly";
	document.body.appendChild(textarea);
	textarea.select(); // 选中文本内容
	textarea.setSelectionRange(0, text.length);
	let result = document.execCommand("copy");
	textarea.remove();
	if (result) {
		that.showMsg(msg || this.getLanguage('复制成功'));
	} else {
		that.showMsg(this.getLanguage('复制失败'));
	}
	//#endif
}


/*
 * 获取页面头部高度
 */
Vue.prototype.getPageTitleHeight = async function() {
	// #ifdef H5 || APP-PLUS
	let info = await uni.getSystemInfoSync();
	let barHeight = info.statusBarHeight / (uni.upx2px(100) / 100);
	return barHeight + 96;
	// #endif
	// #ifdef MP-WEIXIN
	let info = uni.getStorageSync('menuButtonInfo') || await wx.getMenuButtonBoundingClientRect();
	let value = info.top + info.height + 10;
	return value / (uni.upx2px(100) / 100);
	// #endif
}


/*
 * rpx与px的转换
 * value => 转换前的值
 * type  => 需要转换的目标单位名称 px或rpx
 */
Vue.prototype.getUnit = function(value, type) {
	if (type === 'px') {
		return uni.upx2px(value);
	} else if (type === 'rpx') {
		return value / (uni.upx2px(100) / 100);
	}
}


/*
 * 选择图片上传
 */
Vue.prototype.chooseImageFun = async function(type, callback, count) {
	let that = this;
	that.modal = null;
	count = count || 1;
	//#ifdef H5 || MP-WEIXIN
	uni.chooseImage({
		count: count,
		sizeType: ['original', 'compressed'],
		sourceType: [type],
		success: res => {
			const tempFilePaths = res.tempFilePaths[0];
			callback(tempFilePaths);
		},
		fail: res => {

		}
	});
	//#endif
	//#ifdef APP-PLUS
	let result = 1;
	if (getApp().globalData.app_type == 1) { //安卓
		result = await permision.requestAndroidPermission(type == 'camera' ? 'android.permission.CAMERA' :
			'android.permission.READ_EXTERNAL_STORAGE');
		if (result == 1) {
			uni.chooseImage({
				count: count,
				sizeType: ['original', 'compressed'],
				sourceType: [type],
				success: res => {
					const tempFilePaths = res.tempFilePaths[0];
					callback(tempFilePaths);
				},
				fail: res => {

				}
			});
		}
		if (result == -1) {
			let msg = type == 'camera' ? '你需要开启手机拍照权限，去开启吗？' : '你需要开启手机相册权限，去开启吗？';
			uni.showModal({
				title: '温馨提示',
				content: msg,
				cancelText: '拒绝',
				confirmText: '同意',
				success: function(res) {
					if (res.confirm) {
						permision.gotoAppPermissionSetting();
					} else if (res.cancel) {
						//console.log('用户点击取消');
					}
				}
			});
		}
	} else { //苹果
		result = await permision.judgeIosPermission(type == 'camera' ? 'camera' : 'photoLibrary');
		if (result == 1 || result == -1) {
			uni.chooseImage({
				count: count,
				sizeType: ['original', 'compressed'],
				sourceType: [type],
				success: res => {
					const tempFilePaths = res.tempFilePaths[0];
					callback(tempFilePaths);
				},
				fail: res => {

				}
			});
		}
		if (result == 0) {
			let msg = type == 'camera' ? '你需要开启手机拍照权限，去开启吗？' : '你需要开启手机相册权限，去开启吗？';
			uni.showModal({
				title: '温馨提示',
				content: msg,
				cancelText: '拒绝',
				confirmText: '同意',
				success: function(res) {
					if (res.confirm) {
						permision.gotoAppPermissionSetting();
					} else if (res.cancel) {
						//console.log('用户点击取消');
					}
				}
			});
		}
	}
	//#endif
}


/*
 * 保存图片
 */
Vue.prototype.saveImage = async function(url) {
	let that = this;
	if (!url) return that.showMsg('暂无图片保存');
	//#ifdef H5
	return that.showMsg('H5请长按图片保存');
	//#endif
	// #ifdef MP-WEIXIN
	uni.getSetting({
		success: (res) => {
			let authStatus = false;
			authStatus = res.authSetting['scope.writePhotosAlbum'];
			console.log(res.authSetting);
			if (authStatus === false) {
				uni.showModal({
					title: '温馨提示',
					content: '你需要开启手机相册权限，去开启吗？',
					success: function(res) {
						if (res.confirm) {
							uni.openSetting();
						} else if (res.cancel) {
							//console.log('用户点击取消');
						}
					}
				});
			} else {
				that.loading_msg = '保存中...';
				uni.downloadFile({
					url: url,
					success: (res) => {
						if (res.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function(res) {
									that.loading_msg = '';
									that.showMsg('已保存到手机相册');
									that.modal = null;
								},
								fail: function(res) {
									that.loading_msg = '';
								}
							});
						}
					}
				})
			}
		}
	})
	// #endif
	//#ifdef APP-PLUS
	let result = 1;
	if (getApp().globalData.app_type == 1) { //安卓
		result = await permision.requestAndroidPermission('android.permission.WRITE_EXTERNAL_STORAGE');
		if (result == 1) {
			that.loading_msg = '保存中...';
			uni.downloadFile({
				url: url,
				success: (res) => {
					if (res.statusCode === 200) {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function(res) {
								that.loading_msg = '';
								that.showMsg('已保存到手机相册');
								that.modal = null;
							},
							fail: function(res) {
								that.loading_msg = '';
							}
						});
					}
				}
			})
		}
		if (result == -1) {
			uni.showModal({
				title: '温馨提示',
				content: '你需要开启手机相册权限，去开启吗？',
				cancelText: '拒绝',
				confirmText: '同意',
				success: function(res) {
					if (res.confirm) {
						permision.gotoAppPermissionSetting();
					} else if (res.cancel) {
						//console.log('用户点击取消');
					}
				}
			});
		}
	} else { //苹果
		result = await permision.judgeIosPermission('photoLibrary');
		if (result == 1 || result == -1) {
			that.loading_msg = '保存中...';
			uni.downloadFile({
				url: url,
				success: (res) => {
					if (res.statusCode === 200) {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function(res) {
								that.loading_msg = '';
								that.showMsg('已保存到手机相册');
								that.modal = null;
							},
							fail: function(res) {
								that.loading_msg = '';
							}
						});
					}
				}
			})
		}
		if (result == 0) {
			uni.showModal({
				title: '温馨提示',
				content: '你需要开启手机相册权限，去开启吗？',
				cancelText: '拒绝',
				confirmText: '同意',
				success: function(res) {
					if (res.confirm) {
						permision.gotoAppPermissionSetting();
					} else if (res.cancel) {
						//console.log('用户点击取消');
					}
				}
			});
		}
	}
	//#endif
}

/*
 * 保留小数 不四舍五入
 */
Vue.prototype.retainDecimals = function(number,num) {
	let str = '';
	for (let i = 0; i < num; i++) {
		str += '0';
	}
	str = '1' + str;
	let int = parseInt(str);
	let temp = number * int;
	number = Math.floor(temp);
	return number / int;
}