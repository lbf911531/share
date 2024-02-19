<template>
	<view class="uni-page-home">
		<home-navigation @add="dispatchAddEvt" @theme="dispatchChangeThemeEvt"></home-navigation>
		<bill :list="list" @itemclick="onDeleteValue"></bill>
		<uni-popup ref="dialog" type="dialog">
			<uni-popup-dialog mode="base" :cancelText="$t('uni.msg.cancel')" :confirmText="$t('uni.msg.confirm')"
				:title="$t('uni.msg.bill.add')" @confirm="onDiaLogConfirm" @close="onDiaLogClose" before-close>
				<uni-forms :rules="rules" class="append-bill-dialog" ref="form" :modelValue="formData">
					<uni-forms-item :label="$t('uni.msg.item')" name="name" labelAlign="right">
						<uni-easyinput type="text" :placeholder="$t('uni.msg.please.enter')" v-model="formData.name" />
					</uni-forms-item>
					<uni-forms-item :label="$t('uni.msg.amount')" name="amount" labelAlign="right">
						<uni-easyinput type="number" :placeholder="$t('uni.msg.please.enter')"
							v-model="formData.amount" />
					</uni-forms-item>
				</uni-forms>
			</uni-popup-dialog>
		</uni-popup>

		<uni-popup ref="msg" type="message">
			<uni-popup-message type="warning" message="暂未实现" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	import HomeNavigation from './navigation';
	import Bill from './bill';

	export default {
		components: {
			HomeNavigation,
			Bill,
		},
		data() {
			return {
				formData: {},
				list: [],
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: '请输入',
						}]
					},
					amount: {
						rules: [{
							required: true,
							errorMessage: '请输入',
						}]
					},
				}
			}
		},
		onLoad() {
			const that = this;
			uni.getStorage({
				key: 'bills',
				success(res) {
					that.list = res.data;
				}
			})
		},
		onReady() {},
		methods: {
			dispatchAddEvt() {
				this.$refs.dialog.open();
			},
			formatTime(time) {
				const year = time.getFullYear();
				const month = time.getMonth();
				const date = time.getDate();

				return `${year}/${month}/${date}`;
			},
			onDiaLogConfirm() {
				const hideLoading = this.showLoading();
				this.$refs.form.validate().then((value) => {
					this.onDiaLogClose();
					const time = new Date();
					this.onSaveStorage({
						...value,
						id: time.getTime(),
						time: this.formatTime(time),
					}, hideLoading);

				})
			},
			onDiaLogClose() {
				this.formData = {};
				this.$refs.form.clearValidate();
				this.$refs.dialog.close();
			},
			dispatchChangeThemeEvt() {
				this.$refs.msg.open();
			},
			onSaveStorage(value, next) {
				this.list.push(value);
				uni.setStorage({
					key: 'bills',
					data: this.list,
					success() {
						next();
					}
				})
			},
			showLoading() {
				uni.showLoading({
					title: this.$t('uni.msg.loading')
				});
				return uni.hideLoading;
			},
			onDeleteValue(id) {
				const index = this.list.findIndex(item => item.id === id);
				if (index >= 0) {
					const hideLoading = this.showLoading();
					this.list.splice(index, 1);
					uni.setStorage({
						key: 'bills',
						data: this.list,
						success() {
							hideLoading();
						}
					})
				}
			},
		}
	}
</script>

<style>
	.uni-page-home {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.append-bill-dialog .uni-forms-item {
		width: 400rpx;
	}
</style>