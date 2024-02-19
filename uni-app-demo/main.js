import App from './App'
import en from './locale/uni-app.en.json'
import zhHans from './locale/uni-app.zh-Hans.json'
import zhHant from './locale/uni-app.zh-Hans.json'
import VueI18n from 'vue-i18n'

const i18nConfig = {
	locale: uni.getLocale(), // 获取已设置的语言
	messages: {
		en,
		'zh-Hans': zhHans,
		'zh-Hant': zhHant
	}
}

// #ifndef VUE3
import Vue from 'vue'

import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
Vue.use(VueI18n);
const i18n = new VueI18n(i18nConfig);

const app = new Vue({
	i18n,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App);
	app.use(i18n);
	return {
		app
	}
}
// #endif