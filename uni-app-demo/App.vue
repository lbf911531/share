<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			const tabs = [{
					"text": "uni.msg.home",
				},
				{
					"text": "uni.msg.about",
				}
			];

			// if (uni.getSystemInfoSync().platform === 'devtools') {
			// 微信小程序不支持pages.json中配置多语言
			// console.log('小程序环境');
			for (let i = 0, len = tabs.length; i < len; i += 1) {
				uni.setTabBarItem({
					index: i,
					text: this.$t(tabs[i].text),
				})
			}
			// }
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>