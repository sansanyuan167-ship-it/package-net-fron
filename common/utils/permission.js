/**
 * 本模块封装了Android、iOS的应用权限判断、打开应用权限设置界面、以及位置系统服务是否开启
 */
/// -1 = 未请求，1 = 已允许，0 = 拒绝|受限, 2 = 系统未开启

var isIos
// #ifdef APP-PLUS
isIos = (plus.os.name == "iOS")
// #endif

// 判断推送权限是否开启
function judgeIosPermissionPush() {
	var result = 0;
	var UIApplication = plus.ios.import("UIApplication");
	var app = UIApplication.sharedApplication();
	var enabledTypes = 0;
	if (app.currentUserNotificationSettings) {
	    var settings = app.currentUserNotificationSettings();
	    enabledTypes = settings.plusGetAttribute("types");
	    if (enabledTypes == 0) {
	        result = 0;
	        console.log("推送权限没有开启");
	    } else {
	        result = 1;
	        console.log("已经开启推送功能!")
	    }
	    plus.ios.deleteObject(settings);
	} else {
	    enabledTypes = app.enabledRemoteNotificationTypes();
	    if (enabledTypes == 0) {
	        result = 3;
	        console.log("推送权限没有开启!");
	    } else {
	        result = 4;
	        console.log("已经开启推送功能!")
	    }
	}
	plus.ios.deleteObject(app);
	plus.ios.deleteObject(UIApplication);
	return result;
}

// 判断定位权限是否开启
function judgeIosPermissionLocation() {var result = 0;
	var cllocationManger = plus.ios.import("CLLocationManager");
	var enable = cllocationManger.locationServicesEnabled();
	var status = cllocationManger.authorizationStatus();
	if (!enable) {
	    result = 2;
	} else if (status === 0) {
	    result = -1;
	} else if (status === 3 || status === 4) {
	    result = 1;
	} else {
	    result = 0;
	}
	plus.ios.deleteObject(cllocationManger);
	return result;
}

// 判断麦克风权限是否开启
function judgeIosPermissionRecord() {
	var result = null;
	var avaudiosession = plus.ios.import("AVAudioSession");
	var avaudio = avaudiosession.sharedInstance();
	var status = avaudio.recordPermission();
	console.log("permissionStatus:" + status);
	if (status === 1970168948) {
	    result = -1;
	} else if (status === 1735552628) {
	    result = 1;
	} else {
	    result = 0;
	}
	plus.ios.deleteObject(avaudiosession);
	return result;
}

// 判断相机权限是否开启
function judgeIosPermissionCamera() {
	var result = 0;
	var AVCaptureDevice = plus.ios.import("AVCaptureDevice");
	var authStatus = AVCaptureDevice.authorizationStatusForMediaType('vide');
	if (authStatus === 0) {
	    result = -1;
		console.log("相机权限未请求");
	} else if (authStatus == 3) {
	    result = 1;
		console.log("相机权限已经开启");
	} else {
	    result = 0;
		console.log("相机权限没有开启");
	}
	plus.ios.deleteObject(AVCaptureDevice);
	return result;
}

// 判断相册权限是否开启
function judgeIosPermissionPhotoLibrary() {
	var result = 0;
	var PHPhotoLibrary = plus.ios.import("PHPhotoLibrary");
	var authStatus = PHPhotoLibrary.authorizationStatus();
	if (authStatus === 0) {
	    result = -1;
		console.log("相册权限未请求");
	} else if (authStatus == 3) {
	    result = 1;
		console.log("相册权限已经开启");
	} else {
	    result = 0;
		console.log("相册权限没有开启");
	}
	plus.ios.deleteObject(PHPhotoLibrary);
	return result;
}

// 判断通讯录权限是否开启
function judgeIosPermissionContact() {
	var result = 0;
	var CNContactStore = plus.ios.import("CNContactStore");
	var cnAuthStatus = CNContactStore.authorizationStatusForEntityType(0);
	if (cnAuthStatus === 0) {
	    result = -1;
	} else if (cnAuthStatus == 3) {
	    result = 1;
	} else {
	    result = 0;
	}
	plus.ios.deleteObject(CNContactStore);
	return result;
}

// 判断日历权限是否开启
function judgeIosPermissionCalendar() {
	var result = null;
	var EKEventStore = plus.ios.import("EKEventStore");
	var ekAuthStatus = EKEventStore.authorizationStatusForEntityType(0);
	if (ekAuthStatus == 3) {
	    result = 1;
	    console.log("日历权限已经开启");
	} else {
	    console.log("日历权限没有开启");
	}
	plus.ios.deleteObject(EKEventStore);
	return result;
}

// 判断备忘录权限是否开启
function judgeIosPermissionMemo() {
	var result = null;
	var EKEventStore = plus.ios.import("EKEventStore");
	var ekAuthStatus = EKEventStore.authorizationStatusForEntityType(1);
	if (ekAuthStatus == 3) {
	    result = 1;
	    console.log("备忘录权限已经开启");
	} else {
	    console.log("备忘录权限没有开启");
	}
	plus.ios.deleteObject(EKEventStore);
	return result;
}

// Android权限查询
function requestAndroidPermission(permissionID) {
	return new Promise((resolve, reject) => {
		plus.android.requestPermissions(
			[permissionID], // 理论上支持多个权限同时查询，但实际上本函数封装只处理了一个权限的情况。有需要的可自行扩展封装
			function(resultObj) {
				var result = 0;
				for (var i = 0; i < resultObj.granted.length; i++) {
					var grantedPermission = resultObj.granted[i];
					console.log('已获取的权限：' + grantedPermission);
					result = 1
				}
				for (var i = 0; i < resultObj.deniedPresent.length; i++) {
					var deniedPresentPermission = resultObj.deniedPresent[i];
					console.log('拒绝本次申请的权限：' + deniedPresentPermission);
					result = 0
				}
				for (var i = 0; i < resultObj.deniedAlways.length; i++) {
					var deniedAlwaysPermission = resultObj.deniedAlways[i];
					console.log('永久拒绝申请的权限：' + deniedAlwaysPermission);
					result = -1
				}
				resolve(result);
				// 若所需权限被拒绝,则打开APP设置界面,可以在APP设置界面打开相应权限
				// if (result != 1) {
				// gotoAppPermissionSetting()
				// }
			},
			function(error) {
				console.log('申请权限错误：' + error.code + " = " + error.message);
				resolve({
					code: error.code,
					message: error.message
				});
			}
		);
	});
}

// 使用一个方法，根据参数判断权限
function judgeIosPermission(permissionID) {
	if (permissionID == "location") {
		return judgeIosPermissionLocation()
	} else if (permissionID == "camera") {
		return judgeIosPermissionCamera()
	} else if (permissionID == "photoLibrary") {
		return judgeIosPermissionPhotoLibrary()
	} else if (permissionID == "record") {
		return judgeIosPermissionRecord()
	} else if (permissionID == "push") {
		return judgeIosPermissionPush()
	} else if (permissionID == "contact") {
		return judgeIosPermissionContact()
	} else if (permissionID == "calendar") {
		return judgeIosPermissionCalendar()
	} else if (permissionID == "memo") {
		return judgeIosPermissionMemo()
	}
	return false;
}

// 跳转到**应用**的权限页面
function gotoAppPermissionSetting() {
	if (isIos) {
		var UIApplication = plus.ios.import("UIApplication");
		var application2 = UIApplication.sharedApplication();
		var NSURL2 = plus.ios.import("NSURL");
		// var setting2 = NSURL2.URLWithString("prefs:root=LOCATION_SERVICES");		
		var setting2 = NSURL2.URLWithString("app-settings:");
		application2.openURL(setting2);

		plus.ios.deleteObject(setting2);
		plus.ios.deleteObject(NSURL2);
		plus.ios.deleteObject(application2);
	} else {
		// console.log(plus.device.vendor);
		var Intent = plus.android.importClass("android.content.Intent");
		var Settings = plus.android.importClass("android.provider.Settings");
		var Uri = plus.android.importClass("android.net.Uri");
		var mainActivity = plus.android.runtimeMainActivity();
		var intent = new Intent();
		intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
		var uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
		intent.setData(uri);
		mainActivity.startActivity(intent);
	}
}

// 检查系统的设备服务是否开启
// var checkSystemEnableLocation = async function () {
function checkSystemEnableLocation() {
	if (isIos) {
		var result = false;
		var cllocationManger = plus.ios.import("CLLocationManager");
		var result = cllocationManger.locationServicesEnabled();
		console.log("系统定位开启:" + result);
		plus.ios.deleteObject(cllocationManger);
		return result;
	} else {
		var context = plus.android.importClass("android.content.Context");
		var locationManager = plus.android.importClass("android.location.LocationManager");
		var main = plus.android.runtimeMainActivity();
		var mainSvr = main.getSystemService(context.LOCATION_SERVICE);
		var result = mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER);
		console.log("系统定位开启:" + result);
		return result
	}
}

module.exports = {
	judgeIosPermission: judgeIosPermission,
	requestAndroidPermission: requestAndroidPermission,
	checkSystemEnableLocation: checkSystemEnableLocation,
	gotoAppPermissionSetting: gotoAppPermissionSetting
}
