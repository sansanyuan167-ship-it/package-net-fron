import {
	BASE_URL
} from '@/common/config';
export let service = {
	request(options = {}, method = 'GET') {
		//uni.request请求参数
		let params = {};
		//获取用户token
		let token = uni.getStorageSync('token');
		// 获取当前选择语言
		let language = uni.getStorageSync('language') || 'zh-CN';
		// 获取当前选择国家
		let country = uni.getStorageSync('country') || 'China';
		//拼接请求地址
		params.url = BASE_URL + options.url;
		//设置请求类型
		params.method = method;
		//设置请求参数
		params.data = options.data;
		//配置请求头
		params.header = {
			'Content-type': options.header || 'application/json',
			'user-token': token,
			'user-language': language,
			'user-country': country
		};
		return new Promise((resolved, rejected) => {
			//成功
			params.success = (res) => {
				// console.log(res.header);
				if(res.data.status === -1){
					// 未登录
					uni.removeStorageSync('token');
					uni.reLaunch({
						url: '/pages/base/login'
					});
					return false;
				}
				if(res.header['new-token']) uni.setStorageSync('token',res.header['new-token']);
				resolved(res.data);
			};
			//错误
			params.fail = (err) => {
				rejected(err); //错误
			};
			uni.request(params);
		}).catch((e) => {
			return e;
		});
	},
	//GET请求
	async get(options = {}) {
		return await this.request(options, 'GET');
	},
	//POST请求
	async post(options = {}) {
		return await this.request(options, 'POST');
	}
}

/*
在api中使用：
async getIndexData(data = {}) {
	return await service.post({
		url: '/mobile/index/index',
		data
	})
},
async getIndexData(data = {}) {
	return await service.post({
		url: '/mobile/index/index',
		data,
		header:'application/x-www-form-urlencoded'
	})
},
*/
