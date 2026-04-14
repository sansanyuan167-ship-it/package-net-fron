import {
	service
} from '@/common/service.js'

export let baseApi = {
	
	// 测试
	async test(data = {}) {
		return await service.post({
			url: '/user?cmd=test',
			data: data
		})
	},
	
	/**
	 * 文件上传
	 */
	async upload(data = {}) {
		return await service.post({
			url: '/user?cmd=upload',
			data: data
		})
	},
	
	// 获取国家列表
	async countryList(data = {}) {
		return await service.get({
			url: '/user?cmd=country_list',
			data: data
		})
	},
	
	// 获取配置
	async getConfig(data = {}) {
		return await service.get({
			url: '/user?cmd=get_config',
			data: data
		})
	},
	
	// 获取首页数据
	async getIndexData(data = {}) {
		return await service.get({
			url: '/user?cmd=get_index_data',
			data: data
		})
	},
	
	// 获取活动统计数据
	async getActivityData(data = {}) {
		return await service.get({
			url: '/user?cmd=get_activity_data',
			data: data
		})
	},
	
	// 获取活动列表
	async getActivityList(data = {}) {
		return await service.get({
			url: '/user?cmd=get_activity_list',
			data: data
		})
	},
	
	// 获取活动详情
	async getActivityDetail(data = {}) {
		return await service.get({
			url: '/user?cmd=get_activity_detail',
			data: data
		})
	},
	
	// 获取语言列表列表
	async getLanguageList(data = {}) {
		return await service.get({
			url: '/user?cmd=get_language_list',
			data: data
		})
	},
	
	// 获取平台协议
	async getAgreement(data = {}) {
		return await service.get({
			url: '/user?cmd=get_agreement',
			data: data
		})
	},
	
	// 常见问题
	async question(data = {}) {
		return await service.get({
			url: '/user?cmd=question',
			data: data
		})
	},
	
	// 合作伙伴文案
	async partnerArticle(data = {}) {
		return await service.get({
			url: '/user?cmd=partner_article',
			data: data
		})
	},


}
