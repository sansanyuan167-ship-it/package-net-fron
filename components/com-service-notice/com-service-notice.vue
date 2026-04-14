<template>
	<view>
		<view class="remark text-gray">
			<view class="title">{{getLanguage('描述说明')}}：</view>
			<view class="content">
				<view>1. {{getLanguage('工作服务时间')}}：08:00 ~ 22:00。</view>
				<view>2. {{getLanguage('如你遇到任何问题，可咨询平台客服')}}。</view>
				<view>3. {{getLanguage('我们将会第一时间协助你解答你的问题')}}。</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'com-service-notice',
		props: {
			info:{
				type:String,
				default:''
			},
		},
		data() {
			return {
				
			};
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	
</style>
