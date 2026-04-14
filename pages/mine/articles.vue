<template>
	<view class="page-container">
		<com-page-title :title="title" />
		<view class="content">
			<rich-text :nodes="content"></rich-text>
		</view>
		<com-empty ref="empty" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:'',
				title:'',
				content:''
			}
		},
		async onLoad(options) {
			this.type = options.type || '';
			if(this.type == 'agreement'){
				this.title = this.getLanguage('用户协议');
			}else if(this.type == 'privacy'){
				this.title = this.getLanguage('隐私政策');
			}else{
				this.title = this.getLanguage('关于我们');
			}
			//设置H5页面标题
			uni.setNavigationBarTitle({
				title:this.title
			});
			let result = await this.baseApi.getAgreement({
				key:this.type
			});
			if(!result.data) return this.$refs['empty'].show(this.getLanguage('暂时没有任何数据'));
			this.content = result.data.content;
		},
		onShow() {
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding:25rpx;
	}
</style>
