<template>
	<view class="uni-pg-about">
		<view class="abt-header">
			<image src="/static/avatar.jpg" class="abt-hd-avatar" mode="aspectFill"></image>
			<view class="abt-hd-textarea">
				<view class="abt-hd-textarea-item">
					<uni-icons type="person" color="white"></uni-icons>
					hello world
				</view>
				<view class="abt-hd-textarea-item">
					VIP
				</view>
			</view>
			<view class="abt-hd-operation">
				<uni-icons type="location" color="white" size="26" @click="onShowDialoag"></uni-icons>
			</view>
		</view>
		<uni-notice-bar show-icon scrollable single text="这是一段测试文本,当前应用仅作初学uni-app demo用" />

		<uni-popup ref="dialog" type="dialog">
			<uni-popup-dialog :title="$t('uni.msg.language.switch')" :cancelText="$t('uni.msg.cancel')"
				:confirmText="$t('uni.msg.confirm')" @confirm="onDiaLogConfirm" @close="onDiaLogClose">
				<uni-data-select :value="language" :localdata="lanuageList"
					@change="onlanguagechange"></uni-data-select>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				defaultLanguage: 'zh-Hans',
				language: 'zh-Hans',
				lanuageList: [{
						value: 'zh-Hans',
						text: this.$t("uni.msg.zh.Hans"),
					},
					{
						value: 'en',
						text: this.$t("uni.msg.en"),
					},
				],
			};
		},
		methods: {
			onShowDialoag() {
				this.$refs.dialog.open();
			},
			onDiaLogConfirm() {
				this.$i18n.locale = this.language;
				this.onChangeTabbarLan();
			},
			onDiaLogClose() {
				this.language = this.defaultLanguage;
			},
			onlanguagechange(value) {
				this.language = value;
			},
			onChangeTabbarLan() {
				const tabs = [{
						"text": "uni.msg.home",
					},
					{
						"text": "uni.msg.about",
					}
				];

				for (let i = 0, len = tabs.length; i < len; i += 1) {
					uni.setTabBarItem({
						index: i,
						text: this.$t(tabs[i].text),
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.uni-pg-about {
		.abt-header {
			height: 100px;
			position: relative;
			display: flex;
			align-items: center;
			padding: 20px 12px 0 12px;
			background: #a4c793;

			.abt-hd-avatar {
				width: 120rpx;
				height: 120rpx;
				margin-right: 48rpx;
				border-radius: 50%;
			}

			.abt-hd-textarea {
				flex: 1;

				.abt-hd-textarea-item {
					color: rgb(255, 255, 255);
					font-size: 1rem;

					&:nth-of-type(2) {
						width: fit-content;
						background-color: #fb7299;
						font-size: 18rpx;
						height: 24rpx;
						padding: 0 12rpx;
						border-radius: 12rpx;
					}

					&:not(:last-of-type) {
						margin-bottom: 24rpx;
					}

					.uni-icons {
						margin-right: 24rpx;
					}
				}
			}

			.abt-hd-operation {
				width: 240rpx;
				text-align: right;
			}
		}
	}
</style>