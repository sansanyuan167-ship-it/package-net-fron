import Vue from 'vue';
import App from './App';

Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
	...App
});
app.$mount();

import '@/common/function.js';

// 语言
import {
	languageText
} from "@/common/language.js";
Vue.prototype.languageText = languageText;

// 公共接口
import {
	baseApi
} from "@/api/baseApi.js";
Vue.prototype.baseApi = baseApi;

// 登录接口
import {
	loginApi
} from "@/api/loginApi.js";
Vue.prototype.loginApi = loginApi;

// 用户接口
import {
	userApi
} from "@/api/userApi.js";
Vue.prototype.userApi = userApi;

// 游戏接口
import {
	gameApi
} from "@/api/gameApi.js";
Vue.prototype.gameApi = gameApi;

// 资产接口
import {
	assetApi
} from "@/api/assetApi.js";
Vue.prototype.assetApi = assetApi;

// 活动接口
import {
	activityApi
} from "@/api/activityApi.js";
Vue.prototype.activityApi = activityApi;