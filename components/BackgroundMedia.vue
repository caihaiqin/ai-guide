<!-- 
  BackgroundMedia.vue - 背景媒体管理组件
  用于管理页面的背景视频和背景音乐
 -->
<template>
	<view class="background-media">
		<!-- 背景视频 -->
		<view class="bg-video-container" :style="{ opacity: bgVideoOpacity }">
			<media-player
				v-if="backgroundVideo"
				ref="bgVideoPlayer"
				mediaType="video"
				source="https://mp-51f2d98b-a71a-4395-aaef-36c69c9fa62b.cdn.bspapp.com/video/backgroud-video/backgroud-video-1.mp4"
				:autoplay="true"
				:loop="true"
				:muted="!enableSound"
				:showControls="false"
				objectFit="cover"
				:showLoading="false"
				:showErrorMessage="false"
				:showDebugInfo="showDebugInfo"
				@error="onBgVideoError"
				@play="onBgVideoPlay"
				@ended="onBgVideoEnded"
			/>
		</view>

		<!-- 音频控制器 -->
		<view class="audio-controller" v-if="showAudioControls">
			<view class="audio-btn" @click="toggleBgMusic">
				<image :src="bgMusicPlaying ? '/static/icons/volume.png' : '/static/icons/volume-mute.png'" mode="aspectFit"></image>
			</view>
		</view>

		<!-- 背景音乐 (不可见) -->
		<media-player
			v-if="backgroundMusic"
			ref="bgMusicPlayer"
			mediaType="audio"
			:source="backgroundMusic.url"
			:autoplay="autoplayMusic"
			:loop="true"
			:showDebugInfo="showDebugInfo"
			@error="onBgMusicError"
			@play="onBgMusicPlay"
			@pause="onBgMusicPause"
		/>

		<!-- 开场视频 -->
		<view class="opening-video" v-if="showOpeningVideo">
			<media-player
				ref="openingVideoPlayer"
				mediaType="video"
				:source="openingVideo.url"
				:autoplay="true"
				:loop="false"
				:muted="false"
				:showControls="false"
				objectFit="contain"
				:isFullScreen="true"
				@ended="onOpeningVideoEnded"
				@error="onOpeningVideoError"
			/>
		</view>
	</view>
</template>

<script>
import MediaPlayer from './MediaPlayer.vue';
import { OPENING_VIDEO, getRandomBackgroundVideo, getRandomBackgroundMusic } from '../config/media.js';

export default {
	name: 'BackgroundMedia',
	components: {
		MediaPlayer
	},
	props: {
		// 是否自动播放背景音乐
		autoplayMusic: {
			type: Boolean,
			default: true
		},
		// 是否启用声音
		enableSound: {
			type: Boolean,
			default: true
		},
		// 是否显示音频控制器
		showAudioControls: {
			type: Boolean,
			default: true
		},
		// 是否显示开场视频
		showOpeningVideo: {
			type: Boolean,
			default: true
		},
		// 是否随机选择背景媒体
		randomBackground: {
			type: Boolean,
			default: true
		},
		// 指定背景视频URL（如不随机）
		backgroundVideoUrl: {
			type: String,
			default: ''
		},
		// 指定背景音乐URL（如不随机）
		backgroundMusicUrl: {
			type: String,
			default: ''
		},
		// 是否显示调试信息
		showDebugInfo: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			// 开场视频
			openingVideo: OPENING_VIDEO,
			// 背景视频
			backgroundVideo: null,
			// 背景音乐
			backgroundMusic: null,
			// 背景视频透明度
			bgVideoOpacity: 0,
			// 背景音乐是否正在播放
			bgMusicPlaying: false
		};
	},
	created() {
		// 初始化背景媒体
		this.initBackgroundMedia();
	},
	methods: {
		/**
		 * 初始化背景媒体
		 */
		initBackgroundMedia() {
			// 设置背景视频
			if (this.randomBackground) {
				this.backgroundVideo = getRandomBackgroundVideo();
			} else if (this.backgroundVideoUrl) {
				this.backgroundVideo = {
					id: 'custom-bg-video',
					name: '自定义背景视频',
					url: this.backgroundVideoUrl
				};
			} else {
				this.backgroundVideo = getRandomBackgroundVideo();
			}

			// 设置背景音乐
			if (this.randomBackground) {
				this.backgroundMusic = getRandomBackgroundMusic();
			} else if (this.backgroundMusicUrl) {
				this.backgroundMusic = {
					id: 'custom-bg-music',
					name: '自定义背景音乐',
					url: this.backgroundMusicUrl
				};
			} else {
				this.backgroundMusic = getRandomBackgroundMusic();
			}

			console.log('背景视频:', this.backgroundVideo);
			console.log('背景音乐:', this.backgroundMusic);
		},

		/**
		 * 切换背景音乐播放状态
		 */
		toggleBgMusic() {
			const musicPlayer = this.$refs.bgMusicPlayer;
			if (!musicPlayer) return;

			if (this.bgMusicPlaying) {
				musicPlayer.pause();
			} else {
				musicPlayer.play();
			}
		},

		/**
		 * 淡入背景视频
		 */
		fadeInBackgroundVideo() {
			this.bgVideoOpacity = 0;
			const fadeInterval = setInterval(() => {
				this.bgVideoOpacity += 0.05;
				if (this.bgVideoOpacity >= 1) {
					this.bgVideoOpacity = 1;
					clearInterval(fadeInterval);
				}
			}, 50);
		},

		/**
		 * 开场视频结束事件处理
		 */
		onOpeningVideoEnded() {
			this.showOpeningVideo = false;
			this.fadeInBackgroundVideo();
			this.$emit('openingVideoEnded');
		},

		/**
		 * 开场视频错误事件处理
		 */
		onOpeningVideoError(e) {
			console.error('开场视频播放错误:', e);
			this.showOpeningVideo = false;
			this.fadeInBackgroundVideo();
			this.$emit('openingVideoError', e);
		},

		/**
		 * 背景视频播放事件处理
		 */
		onBgVideoPlay() {
			this.fadeInBackgroundVideo();
			this.$emit('bgVideoPlay');
		},

		/**
		 * 背景视频结束事件处理
		 */
		onBgVideoEnded() {
			this.$emit('bgVideoEnded');
		},

		/**
		 * 背景视频错误事件处理
		 */
		onBgVideoError(e) {
			console.error('背景视频播放错误:', e);
			this.$emit('bgVideoError', e);
		},

		/**
		 * 背景音乐播放事件处理
		 */
		onBgMusicPlay() {
			this.bgMusicPlaying = true;
			this.$emit('bgMusicPlay');
		},

		/**
		 * 背景音乐暂停事件处理
		 */
		onBgMusicPause() {
			this.bgMusicPlaying = false;
			this.$emit('bgMusicPause');
		},

		/**
		 * 背景音乐错误事件处理
		 */
		onBgMusicError(e) {
			console.error('背景音乐播放错误:', e);
			this.bgMusicPlaying = false;
			this.$emit('bgMusicError', e);
		}
	}
};
</script>

<style lang="scss">
.background-media {
	position: relative;
	width: 100%;
	height: 100%;

	.bg-video-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		overflow: hidden;
		transition: opacity 0.5s ease;
	}

	.audio-controller {
		position: absolute;
		bottom: 30rpx;
		right: 30rpx;
		z-index: 10;

		.audio-btn {
			width: 60rpx;
			height: 60rpx;
			background-color: rgba(0, 0, 0, 0.4);
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;

			image {
				width: 36rpx;
				height: 36rpx;
			}
		}
	}

	.opening-video {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 999;
		background-color: #000;
	}
}
</style>
