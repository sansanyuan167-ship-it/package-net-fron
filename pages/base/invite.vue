<template>
	<view class="page-container">
		<com-page-title title="邀请你来" :showHome="true" />
		
		<com-page-loading ref="pageLoading" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			
		};
	},
	async onLoad(options) {
		this.$nextTick(() => {
			this.$refs['pageLoading'].hide();
		});
	},
	onShow(){
		
	},
	methods: {
		
	}
};
</script>

<style lang="scss" scoped>
	
</style>
