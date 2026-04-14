<template>
	<view>
		<view class="bottom-tabs border-top" :style="{
			color:color,
			background:bgColor,
			borderRadius:`${borderRadius}rpx ${borderRadius}rpx 0 0`
		}">
			<view class="tab-items transition" :class="{selected:i == cur}" :style="{
				color:`${i == cur ? selectColor : color}`
			}" v-for="(v,i) in list" :key="i" @click="clickItem(i)">
				<view class="icon-box">
					<view v-if="v.nums" class="nums dot-nums">{{v.nums <= 99 ? v.nums : '99+'}}</view>
					<view v-if="type == 'fontIcon'" class="icon" :class="i == cur ? v.selectedIcon : v.icon"></view>
					<image v-else class="image" :src="i == cur ? v.selectedIcon : v.icon"></image>
				</view>
				<view class="name">{{v.name}}</view>
			</view>
		</view>
		<view style="height:110rpx;"></view>
	</view>
</template>

<script>
	export default {
		name: 'com-bottom-tab',
		props: {
			//选项列表
			list: {
				type: Array,
				default: () => {
					return [];
				}
			},
			//图标类型
			type: {
				type: String,
				default: 'image'
			},
			//当前位置
			current: {
				type: [Number, String],
				default: 0
			},
			//默认颜色
			color: {
				type: String,
				default: '#B7B9B9'
			},
			//选中颜色
			selectColor: {
				type: String,
				default: '#336BFF'
			},
			//背景颜色
			bgColor: {
				type: String,
				default: '#fff'
			},
			//顶部圆角大小
			borderRadius: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				cur: this.current
			};
		},
		methods: {
			clickItem(index) {
				this.cur = index;
				this.$emit('onClick', index);
			}
		}
	}
</script>

<style lang="scss">
	.bottom-tabs {
		position: fixed;
		width: 100%;
		height: 110rpx;
		z-index: 50;
		left: 0;
		bottom: 0;
		font-size: 26rpx;
		background: #fff;
		color: #B7B9B9;
		text-align: center;
		display: flex;
		justify-content: space-between;

		.tab-items {
			width: 100%;
			margin-top: 10rpx;

			&.selected {
				color: #336BFF;
			}

			.icon-box {
				position: relative;
				width: 52rpx;
				height: 52rpx;
				margin: 0 auto 6rpx;

				.dot-nums {
					z-index: 5;
					top: 2rpx;
					right: -20rpx;
				}

				.icon,
				.image {
					display: block;
					width: 52rpx;
					height: 52rpx;
					line-height: 52rpx;
					font-size: 46rpx;
				}
			}

			.name {
				line-height: 32rpx;
			}
		}
	}
</style>
