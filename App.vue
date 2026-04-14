<script>
	export default {
		globalData: {
			appName:'Game',
			going:true
		},
		onLaunch() {
			console.log('App Launch');
			let country = uni.getStorageSync('country');
			console.log(country);
			if(!country)
			uni.reLaunch({
				url: '/pages/base/country'
			});
		},
		onShow() {
			console.log('App Show');
		},
		onHide() {
			console.log('App Hide');
		}
	}
</script>

<style lang="scss">
	
	@import "static/css/icon.css";
	@import "static/css/common.scss";
	
	.page-container{
		// width:500px;
	}
	
</style>