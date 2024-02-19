<template>
	<view class="bills">
		<uni-table :border="false" stripe :emptyText="$t('uni.msg.no.more')" class="cus-uni-table">
			<!-- 表头行 -->
			<uni-tr>
				<uni-th>{{$t("uni.msg.item")}}</uni-th>
				<uni-th>{{$t("uni.msg.amount")}}</uni-th>
				<uni-th>{{$t("uni.msg.time")}}</uni-th>
				<uni-th align="right"> </uni-th>
			</uni-tr>
			<!-- 表格数据行 -->
			<uni-tr v-for="item in list" :key="item.id">
				<uni-td>{{item.name}}</uni-td>
				<uni-td>{{item.amount}}</uni-td>
				<uni-th>{{item.time}}</uni-th>
				<uni-td>
					<uni-icons type="trash-filled" @click="dispatchItemClick(item.id)"></uni-icons>
				</uni-td>
			</uni-tr>

		</uni-table>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				require: true,
			}
		},
		data() {
			return {

			};
		},
		methods: {
			dispatchItemClick(id) {
				const that = this;
				uni.showModal({
					content: that.$t("uni.msg.remove.wraning"),
					success: function(res) {
						if (res.confirm) {
							that.$emit('itemclick', id)
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.bills {
		box-sizing: border-box;
		padding: 24rpx;
		width: 750rpx;

		::v-deep .uni-table {
			min-width: initial !important;
		}
	}
</style>