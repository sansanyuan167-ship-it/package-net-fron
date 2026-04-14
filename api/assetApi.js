import {
	service
} from '@/common/service.js'

export let assetApi = {

	async rechargeCards(data = {}) {
		return await service.get({
			url: '/user?cmd=invite_recharge_cards',
			data: data
		})
	},
	// 获取充值选项列表
	async rechargeItems(data = {}) {
		return await service.get({
			url: '/user?cmd=recharge_items',
			data: data
		})
	},
	
	// 获取首次充值优惠列表
	async firstRechargeItems(data = {}) {
		return await service.get({
			url: '/user?cmd=first_recharge_items',
			data: data
		})
	},
	
	// 用户充值
	async recharge(data = {}) {
		return await service.post({
			url: '/user?cmd=recharge',
			data: data
		})
	},
	
	// 用户提现
	async withdraw(data = {}) {
		return await service.post({
			url: '/user?cmd=withdraw',
			data: data
		})
	},
	// 获取用户设置的提现银行信息
	async bankInfo(data = {}) {
		return await service.get({
			url: '/user?cmd=withdraw_bank_info',
			data: data
		})
	},
	// 获取用户充值提现列表
	async ordersRecords(data = {}) {
		return await service.get({
			url: '/user?cmd=orders_records',
			data: data
		})
	},
	
	// 获取用户余额明细
	async userCoinRecords(data = {}) {
		return await service.get({
			url: '/user?cmd=user_coin_records',
			data: data
		})
	}


}
