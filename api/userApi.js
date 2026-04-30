import {
	service
} from '@/common/service.js'

export let userApi = {
	async getUserInviteReward(data = {}) {
		return await service.get({
			url: '/user?cmd=invite_reward',
			data: data
		})
	},
	// 获取用户信息
	async getUserInfo(data = {}) {
		return await service.get({
			url: '/user?cmd=get_user_info',
			data: data
		})
	},
	
	/**
	 * 保存用户信息
	 */
	async saveUserInfo(data = {}) {
		return await service.post({
			url: '/user?cmd=save_user_info',
			data: data
		})
	},
	
	// 获取游戏记录
	async gameRecords(data = {}) {
		return await service.get({
			url: '/user?cmd=game_records',
			data: data
		})
	},
	
	// 操作游戏收藏
	async actionGameCollect(data = {}) {
		return await service.post({
			url: '/user?cmd=action_game_collect',
			data: data
		})
	},
	
	// 获取邀请信息
	async inviteData(data = {}) {
		return await service.get({
			url: '/user?cmd=invite_data',
			data: data
		})
	},
	
	// 获取邀请好友列表分页
	async userFriends(data = {}) {
		return await service.get({
			url: '/user?cmd=user_friends',
			data: data
		})
	},
	
	// 修改邮箱
	async editEmail(data = {}) {
		return await service.post({
			url: '/user?cmd=edit_email',
			data: data
		})
	},
	
	// 修改登录密码
	async editPassword(data = {}) {
		return await service.post({
			url: '/user?cmd=edit_password',
			data: data
		})
	},
	
	// 修改资金密码
	async cashPassword(data = {}) {
		return await service.post({
			url: '/user?cmd=cash_password',
			data: data
		})
	},
	
	// 找回登录密码
	async findPassword(data = {}) {
		return await service.post({
			url: '/user?cmd=find_password',
			data: data
		})
	},
	
	// 获取VIP列表
	async getVipList(data = {}) {
		return await service.get({
			url: '/user?cmd=get_uvip_list',
			data: data
		})
	},
	
	// 获取俱乐部列表
	async getClubList(data = {}) {
		return await service.get({
			url: '/user?cmd=get_club_list',
			data: data
		})
	},

	// 修改银行信息
	async editBankInfo(data = {}) {
		return await service.post({
			url: '/user?cmd=edit_bank_info',
			data: data
		})
	},
}
