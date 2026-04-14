import {
	service
} from '@/common/service.js'

export let activityApi = {
	
	// 获取排行榜
	async rankingList(data = {}) {
		return await service.get({
			url: '/user?cmd=ranking_list',
			data: data
		})
	},
	
	// 获取用户抽奖转盘数据
	async lotteryInfo(data = {}) {
		return await service.get({
			url: '/user?cmd=lottery_info',
			data: data
		})
	},
	
	// 获取奖品列表
	async getLotteryList(data = {}) {
		return await service.get({
			url: '/user?cmd=get_lottery_list',
			data: data
		})
	},
	
	// 获取中奖奖品ID
	async getLotteryId(data = {}) {
		return await service.get({
			url: '/user?cmd=get_lottery_id',
			data: data
		})
	},
	
	// 获取抽奖记录分页
	async lotteryRecordsPage(data = {}) {
		return await service.get({
			url: '/user?cmd=lottery_records_page',
			data: data
		})
	},
	
	// 获取奖励记录分页
	async walletRecordsPage(data = {}) {
		return await service.get({
			url: '/user?cmd=wallet_records_page',
			data: data
		})
	},


}
