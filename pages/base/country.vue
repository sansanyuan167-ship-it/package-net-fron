<template>
	<view class="page-container has-bottom">
		<com-page-title :title="getLanguage('请选择国家')" :showBack="false" />
		<view class="country-box">
			<view class="item" :class="{active:selectedCountry.key == item.key}" v-for="(item,index) in list" :key="index" @click="selectedCountry = item">
				<view class="flag-box">
					<image :src="item.flag" mode="widthFix"></image>
				</view>
				<view class="name">{{item.name}}</view>
			</view>
		</view>
		<view class="bottom-btn">
			<view @click="confirm">{{getLanguage('确认选择')}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectedCountry:{},
				list:[]
			}
		},
		async onLoad(options) {
			let result = await this.baseApi.countryList();
			this.list = result.data;
		},
		onShow() {
			
		},
		methods: {
			// 确认选择
			confirm(){
				if(!this.selectedCountry.key) return this.showMsg(this.getLanguage('请选择国家'));
				uni.setStorageSync('country',this.selectedCountry.key);
				this.goPage('/pages/index/index','redirect');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.country-box{
		margin:30rpx 25rpx;
		display:flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
		gap:25rpx;
		text-align:center;
		.item{
			width:calc((100% - 50rpx) / 3 - 2rpx);
			padding:20rpx;
			box-sizing: border-box;
			background:#2C2F3E;
			border-radius:20rpx;
			box-sizing: border-box;
			.flag-box{
				width:100%;
				min-height:130rpx;
				display:flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				image{
					display:block;
					width:100%;
					
				}
			}
			.name{
				font-size:28rpx;
				margin-top:15rpx;
				display: inline-block;
				background-image: linear-gradient(to right bottom, #FDF13C, #FF8133);
				-webkit-background-clip: text;
				color: transparent;
			}
			&.active{
				box-shadow: 4rpx 4rpx 16rpx #F0E327;;
				background:#522490;
				background: linear-gradient(to right bottom, #81409D 0%, #522490 100%);
				.name{
					font-weight:600;
				}
			}
		}
	}
</style>