<template>
	<view class="page-container">
		<com-page-title :title="getLanguage('修改提现信息')" />
		<view class="info-box panel-item">
			<view class="item" @click="$refs['changeCountryPopup'].show()">
				<view class="key">
					<text class="icon cuIcon-edit"></text>
					<text>{{getLanguage('开户国家编码')}}</text>
				</view>
				<view class="input">
					<view class="value" :class="{
					'text-placeholder':!bankCountryCodeName
				}">{{bankCountryCodeName || getLanguage('开户国家编码')}}</view>
					<text class="open cuIcon-right"></text>
				</view>
			</view>
		</view>
		<view class="info-box panel-item">
			<view class="item" @click="openBankCodeSelect">
				<view class="key">
					<text class="icon cuIcon-shop"></text>
					<text>{{getLanguage('开户银行编码')}}</text>
				</view>
				<view class="input">
					<view class="value" :class="{
					'text-placeholder':!bankCodeName
				}">{{bankCodeName || getLanguage('开户银行编码')}}</view>
					<text class="open cuIcon-right"></text>
				</view>
			</view>
		</view>
		<view class="info-box panel-item">
			<view class="item">
				<view class="key">
					<text class="icon cuIcon-card"></text>
					<text>{{getLanguage('开户银行卡号')}}</text>
				</view>
				<view class="input">
					<input v-model="bankNumber" type="text" :placeholder="getLanguage('开户银行卡号')" placeholder-style="color:#AFAFAF;">
				</view>
			</view>
			<view class="item">
				<view class="key">
					<text class="icon cuIcon-people"></text>
					<text>{{getLanguage('开户银行姓名')}}</text>
				</view>
				<view class="input">
					<input v-model="bankName" type="text" :placeholder="getLanguage('开户银行姓名')" placeholder-style="color:#AFAFAF;">
				</view>
			</view>
<!-- 			<view class="item" @click="$refs['phoneCountryPopup'].show()">
				<view class="key">
					<text class="icon cuIcon-activity"></text>
					<text>{{getLanguage('开户银行手机号归属国家')}}</text>
				</view>
				<view class="input">
					<image class="flag" mode="heightFix" :src="selectedPhoneCountry.flag" v-if="selectedPhoneCountry.key"></image>
					<view class="select-text" :class="{
						'text-placeholder':!selectedPhoneCountry.key
					}">{{selectedPhoneCountry.key || getLanguage('开户银行手机号归属国家')}}</view>
					<text class="open cuIcon-right"></text>
				</view>
			</view> -->
			<view class="item">
				<view class="key">
					<text class="icon cuIcon-phone"></text>
					<text>{{getLanguage('开户银行手机号')}}</text>
				</view>
				<view class="input">
					<view class="open cuIcon-mobile text-red" style="padding-right:8px" @click="$refs['phoneCountryPopup'].show()">{{phoneCountry||getLanguage('国际区号')}}</view>
					<input v-model="bankPhone" type="text" :placeholder="getLanguage('开户银行手机号')" placeholder-style="color:#AFAFAF;">
				</view>
			</view>
			<view class="item">
				<view class="key">
					<text class="icon cuIcon-mail"></text>
					<text>{{getLanguage('开户银行邮箱')}}</text>
				</view>
				<view class="input">
					<input v-model="bankEmail" type="text" :placeholder="getLanguage('开户银行邮箱')" placeholder-style="color:#AFAFAF;">
				</view>
			</view>
			<view class="item">
				<view class="key">
					<text class="icon cuIcon-lock"></text>
					<text>{{getLanguage('登录密码')}}</text>
				</view>
				<view class="input">
					<input v-model="password" type="text" :placeholder="getLanguage('请输入登录密码')" placeholder-style="color:#AFAFAF;">
				</view>
			</view>
		</view>


		<view class="btn-block" @click="submit">{{getLanguage('确认提交')}}</view>

		
		<!-- START 选择开户国家编码弹窗 -->
		<com-popup ref="changeCountryPopup" model="bottom">
			<view class="change-country-popup panel-bg">
				<text class="close cuIcon-close" @click="$refs['changeCountryPopup'].hide()"></text>
				<view class="popup-title">{{getLanguage('开户国家编码')}}</view>
				<scroll-view scroll-y class="list">
					<view class="item" :class="{'active':item.id == countryCodes.id}" v-for="(item,index) in countryCodes" :key="index" @click="changeCountryCode(item)">
						<text>{{item.name}}</text>
					</view>
				</scroll-view>
			</view>
		</com-popup>
		<!-- START 选择开户银行编码 -->
		<com-popup ref="changeBankPopup" model="bottom">
			<view class="change-country-popup panel-bg">
				<text class="close cuIcon-close" @click="$refs['changeBankPopup'].hide()"></text>
				<view class="popup-title">{{getLanguage('开户银行编码')}}</view>
				<scroll-view scroll-y class="list">
					<view class="item" :class="{'active':item.id == bankCodeOptions.id}" v-for="(item,index) in bankCodeOptions" :key="index" @click="changeBankCode(item)">
						<text>{{item.name}}</text>
					</view>
				</scroll-view>
			</view>
		</com-popup>
		<!-- START 开户银行手机号归属国家 -->
		<com-popup ref="phoneCountryPopup" model="bottom">
			<view class="phone-country-popup panel-bg">
				<text class="close cuIcon-close" @click="$refs['phoneCountryPopup'].hide()"></text>
				<view class="popup-title">{{getLanguage('开户银行手机号归属国家')}}</view>
				<scroll-view scroll-y class="list">
					<view class="item" :class="{'active':item.key == selectedPhoneCountry.key}" v-for="(item,index) in phoneCountryList"
						:key="index" @click="selectPhoneCountry(item)">
						<view class="name">{{item.name}}</view>
						<image class="flag" mode="heightFix" :src="item.flag"></image>
					</view>
				</scroll-view>
			</view>
		</com-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				password:'',
				// 国家编码
				bankCountryCode:'',
				bankCountryCodeName:'',
				// 银行编码
				bankCodeOptions:[],
				bankCodeName:'',
				bankCode:'',
				bankNumber:'',
				bankName:'',
				bankEmail:'',
				bankPhone:'',
				phoneCountry:'',
				phoneCountryList:[],
				selectedPhoneCountry:{},
				// 定义的银行信息,数据来源https://www.showdoc.com.cn/1409614331381609/11558562542158902
				countryCodes:[
				  {"id": "27", "name": "South Africa"},
				  {"id": "221", "name": "Sénégal"},
				  {"id": "223", "name": "Mali"},
				  {"id": "225", "name": "Côte d’Ivoire"},
				  {"id": "226", "name": "Burkina Faso"},
				  {"id": "228", "name": "Togo"},
				  {"id": "229", "name": "Benin"},
				  {"id": "233", "name": "Ghana"},
				  {"id": "234", "name": "Nigeria"},
				  {"id": "237", "name": "Cameroun"},
				  {"id": "243", "name": "Congo"},
				  {"id": "254", "name": "Kenya"},
				  {"id": "255", "name": "Tanzania"},
				  {"id": "256", "name": "Uganda"}
				],
				bankCodes:{
					// Sénégal
					"221":[
					  {"id": "1", "name": "orange"},
					  {"id": "4", "name": "FreeSn"},
					  // {"id": "5", "name": "Expresso(暂时不能用)"},
					  {"id": "6", "name": "Wave"}
					],
					// Mali
					"223":[
					  {"id": "1", "name": "orange"},
					  {"id": "3", "name": "moov"}
					],
					// Côte d’Ivoire
					"225":[
					  {"id": "1", "name": "orange"},
					  {"id": "2", "name": "momo(mtn)"},
					  {"id": "3", "name": "moov"},
					  {"id": "6", "name": "Wave"}
					],
					// Burkina Faso
					"226":[
					  {"id": "1", "name": "orange"},
					  {"id": "3", "name": "moov"},
					  {"id": "12", "name": "telecel"}
					],
					// Togo 
					"228":[
					  {"id": "3", "name": "moov"},
					  {"id": "7", "name": "Tmoney"}
					],
					// Benin
					"229":[
					  {"id": "3", "name": "moov"},
					  {"id": "2", "name": "momo(mtn)"}
					],
					// Cameroun
					"237":[
					  {"id": "1", "name": "orange"},
					  {"id": "2", "name": "momo(mtn)"}
					],
					// Ghana
					"233":[
					  {"id": "9", "name": "AirtelTigo MONEY (AIR-钱包)"},
					  {"id": "2", "name": "MTN MOBILE MONEY (MTN-钱包)"},
					  {"id": "8", "name": "M-Pesa"}
					],
					// Congo
					"243":[
					  {"id": "8", "name": "M-Pesa"},
					  {"id": "9", "name": "Airtel"},
					  {"id": "1", "name": "orange"}
					],
					// kenya
					"254":[
					  {
						"id": "Airtel",
						"name": "Airtel"
					  },
					  {
						"id": "M-Pesa",
						"name": "M-Pesa"
					  }
					],
					// Tanzania
					"255":[
					  {
						"id": "M-Pesa",
						"name": "8"
					  },
					  {
						"id": "Airtel",
						"name": "9"
					  }
					],
					// Uganda
					"256":[
					  {
						"id": "9",
						"name": "Airtel"
					  },
					  {
						"id": "2",
						"name": "MTN MOBILE MONEY (MTN-钱包)"
					  }
					],
					// South Africa
					"27":[
						{"id":"632005","name":"ABSA"},
						{"id":"430000","name":"African Bank"},
						{"id":"800000","name":"Albaraka Bank"},
						{"id":"888000","name":"Bank Zero"},
						{"id":"462005","name":"Bidvest Bank"},
						{"id":"470010","name":"Capitec Bank"},
						{"id":"350005","name":"CitiBank"},
						{"id":"679000","name":"Discovery Bank"},
						{"id":"250655","name":"FNB"},
						{"id":"587000","name":"HSBC Bank"},
						{"id":"580105","name":"Investec"},
						{"id":"198765","name":"Nedbank"},
						{"id":"250655","name":"RMB"},
						{"id":"683000","name":"Sasfin Bank"},
						{"id":"051001","name":"Standard Bank"},
						{"id":"730020","name":"Standard Chartered Bank"},
						{"id":"678910","name":"TymeBank"},
						{"id":"431010","name":"Ubank Limited"}
					]
				}
			}
		},
		async onLoad() {
			await this.getPhoneCountryList();
			await this.getUserInfo();
		},
		onShow() {
			
		},
		methods: {
			// 获取用户信息
			async getUserInfo(){
				let result = await this.userApi.getUserInfo();
				if(result){
					let data=result?.data;
					this.bankCountryCode=data?.bank_country_code;
					this.bankCountryCodeName=data?.bank_country_code_name;
					this.bankCodeOptions =this.bankCodes[this.bankCountryCode]
					this.bankCodeName=data?.bank_code_name;
					this.bankCode=data?.bank_code;
					this.bankNumber=data?.bank_number;
					this.bankName=data?.bank_name;
					this.bankEmail=data?.bank_email;
					if(data?.bank_phone){
						let tmp=data?.bank_phone.split(' ');
						this.bankPhone=tmp[1];
						this.phoneCountry=tmp[0];
					}

				}
			},
			// 获取国家列表
			async getPhoneCountryList(){
				let result = await this.baseApi.countryList();
				this.phoneCountryList = result.data;
				// console.log(this.phoneCountryList)
			},
			// 选择国家
			selectPhoneCountry(item){
				// console.log(item)
				this.selectedPhoneCountry = item;
				this.phoneCountry=item.code;
				this.$refs['phoneCountryPopup'].hide();
			},
			changeCountryCode(item){
				this.bankCountryCode = item.id;
				this.bankCountryCodeName = item.name;
				this.bankCodeOptions =this.bankCodes[item.id]
				// 清空原来的开户银行编码信息
				this.bankCode = "";
				this.bankCodeName = "";
				this.$refs['changeCountryPopup'].hide();
			},
			openBankCodeSelect(){
				if(this.bankCodeOptions.length<=0){
					return this.showMsg(this.getLanguage('请首先选择开户国家编码'));
				}
				this.$refs['changeBankPopup'].show();
			},
			changeBankCode(item){
				this.bankCode = item.id;
				this.bankCodeName = item.name;
				this.$refs['changeBankPopup'].hide();
			},
			// 提交
			async submit(){
				if(!this.bankCountryCode || !this.bankCountryCodeName) return this.showMsg(this.getLanguage('请填写开户国家编码'));
				if(!this.bankCode || !this.bankCodeName) return this.showMsg(this.getLanguage('请填写开户银行编码'));
				if(!this.bankNumber) return this.showMsg(this.getLanguage('请填写开户银行卡号'));
				if(!this.bankName) return this.showMsg(this.getLanguage('请填写开户银行姓名'));
				if(!this.bankEmail) return this.showMsg(this.getLanguage('请填写开户银行邮箱'));
				if(!this.bankPhone) return this.showMsg(this.getLanguage('请填写开户银行手机号'));
				if(!this.phoneCountry) return this.showMsg(this.getLanguage('请填写开户银行手机号区号'));
				
				let result = await this.userApi.editBankInfo({
					bankCountryCode:this.bankCountryCode,
					bankCountryCodeName:this.bankCountryCodeName,
					bankCodeName:this.bankCodeName,
					bankCode:this.bankCode,
					bankNumber:this.bankNumber,
					bankName:this.bankName,
					bankEmail:this.bankEmail,
					bankPhone:this.bankPhone,
					phoneCountry:this.phoneCountry,
					password:this.password
				});
				this.showMsg(result.msg);
				if(!result.status) return false;
				setTimeout(() => {
					this.goBack();
				},1000);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.info-box{
		padding:25rpx;
		margin-top:40rpx;
		.item{
			margin-top:30rpx;
			&:first-child{
				margin-top:0;
			}
			.key{
				display:flex;
				justify-content: flex-start;
				align-items: center;
				.icon{
					width:50rpx;
					height:50rpx;
					line-height:50rpx;
					font-size:40rpx;
					text-align:center;
					margin-right:15rpx;
					display: inline-block;
					background-image: linear-gradient(to right bottom, #F5EDE0, #FF8133);
					-webkit-background-clip: text;
					color: transparent;
				}
			}
			.input{
				background:#212434;
				margin-top:15rpx;
				padding:15rpx 25rpx;;
				border-radius:12rpx;
				display:flex;
				justify-content: space-between;
				align-items: center;
				.flag{
					width:80rpx;
					height:50rpx;
					margin-right:15rpx;
					border-radius:10rpx;
				}
				.select-text{
					line-height:60rpx;
					flex:1;
				}
				.phone-code{
					margin-right:15rpx;
				}
				input{
					width:100%;
					height:60rpx;
					flex:1;
				}
				.button{
					line-height:60rpx;
					background:#F2E027;
					border-radius:100rpx;
					padding:0 20rpx;
					font-size:24rpx;
					color:#333;
					z-index: 50;
					&.dis{
						background:#C6C6C6;
						color:#626262;
					}
				}
			}
		}
	}
	.explain{
		font-size:28rpx;
		margin:25rpx;
	}
	.find-password{
		display:flex;
		justify-content: center;
		align-items: center;
		margin-top:60rpx;
	}
	.change-country-popup{
		position:relative;
		border-radius:30rpx 30rpx 0 0;
		padding:30rpx;
		padding-bottom:calc(30rpx + constant(safe-area-inset-bottom));
		padding-bottom:calc(30rpx + env(safe-area-inset-bottom));
		.close{
			position:absolute;
			top:10rpx;
			right:10rpx;
			z-index: 10;
			width:60rpx;
			height:60rpx;
			line-height:60rpx;
			text-align:center;
		}
		.popup-title{
			position:relative;
			font-size:32rpx;
			padding-bottom:30rpx;
			&::after{
				content:'';
				display:block;
				width:100%;
				height:2rpx;
				background:linear-gradient(to right,transparent 0%,#3E4355 50%,transparent 100%);
				position:absolute;
				bottom:-1rpx;
				left:0;
			}
		}
		.list{
			margin-top:30rpx;
			max-height:600rpx;
			.item{
				border:1rpx solid #3E4355;
				border-radius:20rpx;
				margin-bottom:20rpx;
				line-height:80rpx;
				&.active{
					color:#333333;
					font-weight:600;
					background:linear-gradient(to right bottom,#EDAD4D 0%,#D68B21 100%);
				}
			}
		}
	}
	.phone-country-popup {
		position: relative;
		border-radius: 30rpx 30rpx 0 0;
		padding: 30rpx;
		padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
	
		.close {
			position: absolute;
			top: 10rpx;
			right: 10rpx;
			z-index: 10;
			width: 60rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
		}
	
		.popup-title {
			position: relative;
			font-size: 32rpx;
			padding-bottom: 30rpx;
	
			&::after {
				content: '';
				display: block;
				width: 100%;
				height: 2rpx;
				background: linear-gradient(to right, transparent 0%, #3E4355 50%, transparent 100%);
				position: absolute;
				bottom: -1rpx;
				left: 0;
			}
		}
	
		.list {
			margin-top: 30rpx;
			max-height: 600rpx;
	
			.item {
				border: 1rpx solid #3E4355;
				border-radius: 20rpx;
				margin-bottom: 20rpx;
				line-height: 80rpx;
				padding:0 30rpx;
				display:flex;
				justify-content: space-between;
				align-items: center;
				
				.flag{
					width:80rpx;
					height:50rpx;
				}
	
				&.active {
					color: #333333;
					font-weight: 600;
					background: linear-gradient(to right bottom, #EDAD4D 0%, #D68B21 100%);
				}
			}
		}
	}
</style>
