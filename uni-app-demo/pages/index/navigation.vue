<template>
	<view class="home-navigation">
		<image src="/static/tabbar.png" class="hm-nav-banner" mode="aspectFill"></image>
		<view class="hm-nav-content">
			<image src='/static/avatar.jpg' class="hm-nav-avatar"></image>
			<uni-easyinput prefixIcon="search" class="hm-nav-search"></uni-easyinput>
			<view class="hm-nav-operation">
				<uni-icons type="color" size="24" color="white" @click="dispatchChangeTheme"></uni-icons>
				<uni-icons type="plusempty" size="24" color="white" @click="dispatchAdd"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'home-navigation',
		data() {
			return {

			};
		},
		methods: {
			dispatchAdd() {
				this.$emit('add');
			},
			dispatchChangeTheme() {
				this.$emit('theme');
			}
		}
	}
</script>

<style lang="scss">
	.home-navigation {
		position: relative;
		--width: 750rpx;
		--height: 100px;

		.hm-nav-banner {
			width: var(--width);
			height: var(--height);
			position: relative;

			&:before {
				content: '';
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				backdrop-filter: blur(5rpx);
			}
		}

		.hm-nav-content {
			position: absolute;
			bottom: 0;
			left: 0;
			top: 0;
			right: 0;
			display: flex;
			align-items: center;
			box-sizing: border-box;
			padding: 0 8px;
			padding-top: 20px;
			background: linear-gradient(rgba(255, 255, 255, 0.2) 10%, $uni-primary-color);

			.hm-nav-avatar {
				width: 64rpx;
				height: 64rpx;
				margin-right: 12px;
				border-radius: 50%;
			}

			.hm-nav-search {
				flex: 1;
			}

			.hm-nav-operation {
				width: 200rpx;
				text-align: right;
				margin-left: 12px;

				.uni-icons {
					margin: 0 8px;
				}
			}
		}
	}
</style>