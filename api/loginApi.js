import {
	service
} from '@/common/service.js'

export let loginApi = {

	// 注册
	async register(data = {}) {
		return await service.post({
			url: '/user?cmd=register',
			data: data
		})
	},
	
	// 登录
	async login(data = {}) {
		return await service.post({
			url: '/user?cmd=login',
			data: data
		})
	},
	async getPhoneCode(data = {}) {
		return await service.post({
			url: '/user?cmd=sms_code&type=PHONE',
			data: data
		})
	},
	async getEmailCode(data = {}) {
		return await service.post({
			url: '/user?cmd=email_code&type=EMAIL',
			data: data
		})
	},
}
