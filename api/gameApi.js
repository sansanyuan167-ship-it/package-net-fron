import {
	service
} from '@/common/service.js'

export let gameApi = {
	
	// 获取游戏URL
	async getGameUrl(data = {}) {
		return await service.post({
			url: '/user?cmd=get_game_url',
			data: data
		})
	},

	// 获取厂商列表
	async getSupplier(data = {}) {
		return await service.post({
			url: '/user?cmd=get_supplier',
			data: data
		})
	},
	
	// 获取分类列表
	async getCategories(data = {}) {
		return await service.post({
			url: '/user?cmd=get_categories',
			data: data
		})
	},
	
	// 获取游戏列表分页
	async getGamePage(data = {}) {
		return await service.post({
			url: '/user?cmd=get_game_page',
			data: data
		})
	},


}
