<template>
	<view class="userinfo-container">
		<view class="header">
			<view class="back-icon" @click="navigateBack">
				<uni-icons type="left" size="20"></uni-icons>
			</view>
			<text class="title">个人信息</text>
			<view class="more-icon">
				<uni-icons type="more-filled" size="20"></uni-icons>
			</view>
		</view>

		<view class="form-container">
			<view class="form-item">
				<text class="label">昵称/姓名</text>
				<input type="text" v-model="userInfo.nickname" placeholder="这里填写你的昵称/姓名~" placeholder-class="input-placeholder" />
			</view>

			<view class="form-item">
				<text class="label">个性签名</text>
				<textarea v-model="userInfo.signature" placeholder="请在这里填写你的个性签名" placeholder-class="input-placeholder" :maxlength="100" />
			</view>

			<view class="form-item birthday-item">
				<text class="label">你的生日</text>
				<view class="birthday-picker">
					<!-- <picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="uni-input">{{ date }}</view>
					</picker> -->
					<picker mode="selector" :range="years" @change="onYearChange">
						<view class="picker-item">{{ userInfo.birthYear }} 年</view>
					</picker>
					<picker mode="selector" :range="months" @change="onMonthChange">
						<view class="picker-item">{{ userInfo.birthMonth }} 月</view>
					</picker>
					<picker mode="selector" :range="days" @change="onDayChange">
						<view class="picker-item">{{ userInfo.birthDay }} 日</view>
					</picker>
				</view>
			</view>
		</view>

		<button class="save-btn" @click="saveUserInfo">保存修改</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: {
				nickname: '',
				signature: '',
				birthYear: '1996',
				birthMonth: '11',
				birthDay: '3',
				date: ''
			},
			startDate: '1920-01-01',
			endDate: '2100-12-31',
			years: Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - 99 + i).toString()),
			months: Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
			days: Array.from({ length: 31 }, (_, i) => (i + 1).toString())
		};
	},
	methods: {
		navigateBack() {
			uni.navigateBack();
		},
		onYearChange(e) {
			this.userInfo.birthYear = this.years[e.detail.value];
		},
		onMonthChange(e) {
			this.userInfo.birthMonth = this.months[e.detail.value];
		},
		onDayChange(e) {
			this.userInfo.birthDay = this.days[e.detail.value];
		},
		saveUserInfo() {
			// Save user information
			console.log('打印用户信息', this.userInfo);
			uni.setStorageSync('isFirstTime', true);
			uni.setStorageSync('userInfo', this.userInfo);
			uni.showToast({
				title: '保存成功',
				icon: 'success',
				duration: 1500
			});

			console.log('保存个人信息，跳转到首页');

			// Add a small delay before navigation to ensure storage is updated
			setTimeout(() => {
				uni.reLaunch({
					url: '/pages/index/index',
					success: function () {
						console.log('成功跳转到首页');
					},
					fail: function (err) {
						console.error('跳转失败:', err);
						// Fallback to reLaunch if switchTab fails
						uni.reLaunch({ url: '/pages/index/index' });
					}
				});
			}, 300);
		}
	}
};
</script>

<style lang="scss">
.userinfo-container {
	min-height: 100vh;
	background-color: #a6bcd5;
	padding: 0 20rpx;

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88rpx;
		padding: 0 20rpx;

		.title {
			font-size: 32rpx;
			font-weight: 500;
		}

		.back-icon,
		.more-icon {
			width: 44rpx;
			height: 44rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.form-container {
		padding: 30rpx;

		.form-item {
			margin-bottom: 40rpx;

			.label {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 20rpx;
				display: block;
			}

			input,
			textarea {
				width: 100%;
				background: #ffffff;
				border: 2rpx solid #e5e5e5;
				border-radius: 12rpx;
				padding: 20rpx;
				font-size: 28rpx;
			}

			textarea {
				height: 160rpx;
			}

			.input-placeholder {
				color: #999;
				font-size: 28rpx;
			}
		}

		.birthday-item {
			.birthday-picker {
				display: flex;
				justify-content: space-between;

				.picker-item {
					flex: 1;
					text-align: center;
					background: #ffffff;
					border: 2rpx solid #e5e5e5;
					border-radius: 12rpx;
					padding: 20rpx;
					margin: 0 10rpx;
					font-size: 28rpx;

					&:first-child {
						margin-left: 0;
					}

					&:last-child {
						margin-right: 0;
					}
				}
			}
		}
	}

	.save-btn {
		width: 90%;
		height: 88rpx;
		background: #95d13c;
		border-radius: 44rpx;
		color: #ffffff;
		font-size: 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 60rpx auto;
		border: none;

		&:active {
			opacity: 0.8;
		}
	}
}
</style>
