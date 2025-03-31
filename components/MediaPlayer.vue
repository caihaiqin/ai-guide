<!-- 
  MediaPlayer.vue - 通用媒体播放组件
  用于播放云端视频和音频
 -->
<template>
  <view class="media-player" :class="{ 'full-screen': isFullScreen }">
    <!-- 视频播放器 -->
    <video
      v-if="mediaType === 'video'"
      :id="videoId"
      class="video-player"
      :src="source"
      :poster="poster"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      :show-play-btn="showControls"
      :show-progress="showControls"
      :controls="showControls"
      :object-fit="objectFit"
      @error="onError"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @timeupdate="onTimeUpdate"
      @waiting="onWaiting"
      @loadedmetadata="onLoadedMetadata"
    ></video>

    <!-- 音频播放器 -->
    <audio
      v-if="mediaType === 'audio'"
      :id="audioId"
      :src="source"
      :autoplay="autoplay"
      :loop="loop"
      @error="onError"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @timeupdate="onTimeUpdate"
    ></audio>

    <!-- 加载指示器 -->
    <view class="loading-indicator" v-if="isLoading && showLoading">
      <view class="spinner"></view>
      <text class="loading-text">{{ loadingText }}</text>
    </view>

    <!-- 错误提示 -->
    <view class="error-message" v-if="hasError && showErrorMessage">
      <text>{{ errorMessage }}</text>
      <button v-if="showRetryButton" @click="retry" class="retry-btn">
        重试
      </button>
    </view>

    <!-- 调试信息 -->
    <view class="debug-info" v-if="showDebugInfo">
      <text>状态: {{ playbackStatus }}</text>
      <text>来源: {{ source }}</text>
      <text>错误: {{ errorMessage }}</text>
      <text>进度: {{ progressText }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "MediaPlayer",
  props: {
    // 媒体类型: 'video' 或 'audio'
    mediaType: {
      type: String,
      default: "video",
      validator: (value) => ["video", "audio"].includes(value),
    },
    // 媒体源URL
    source: {
      type: String,
      required: true,
    },
    // 视频封面图片
    poster: {
      type: String,
      default: "",
    },
    // 是否自动播放
    autoplay: {
      type: Boolean,
      default: false,
    },
    // 是否循环播放
    loop: {
      type: Boolean,
      default: false,
    },
    // 是否静音
    muted: {
      type: Boolean,
      default: false,
    },
    // 是否显示控制条
    showControls: {
      type: Boolean,
      default: true,
    },
    // 是否全屏显示
    isFullScreen: {
      type: Boolean,
      default: false,
    },
    // 视频填充模式
    objectFit: {
      type: String,
      default: "contain",
      validator: (value) => ["contain", "fill", "cover"].includes(value),
    },
    // 是否显示加载指示器
    showLoading: {
      type: Boolean,
      default: true,
    },
    // 是否显示错误信息
    showErrorMessage: {
      type: Boolean,
      default: true,
    },
    // 是否显示重试按钮
    showRetryButton: {
      type: Boolean,
      default: true,
    },
    // 是否显示调试信息
    showDebugInfo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 唯一ID
      videoId: `video-player-${Math.random().toString(36).substr(2, 9)}`,
      audioId: `audio-player-${Math.random().toString(36).substr(2, 9)}`,
      // 播放状态
      isPlaying: false,
      isLoading: true,
      hasError: false,
      // 错误信息
      errorMessage: "",
      // 加载文本
      loadingText: "加载中...",
      // 播放状态
      playbackStatus: "初始化",
      // 播放进度
      currentTime: 0,
      duration: 0,
      // 媒体元素实例
      mediaElement: null,
    };
  },
  computed: {
    // 进度文本
    progressText() {
      if (this.duration === 0) return "0:00 / 0:00";
      const current = this.formatTime(this.currentTime);
      const total = this.formatTime(this.duration);
      return `${current} / ${total}`;
    },
  },
  watch: {
    // 监听源变化，重新加载
    source(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.reset();
        this.initializeMedia();
      }
    },
  },
  mounted() {
    this.initializeMedia();
  },
  beforeDestroy() {
    this.releaseMedia();
  },
  methods: {
    // 初始化媒体元素
    initializeMedia() {
      this.isLoading = true;
      this.hasError = false;
      this.playbackStatus = "初始化";

      setTimeout(() => {
        if (this.mediaType === "video") {
          this.mediaElement = uni.createVideoContext(this.videoId, this);
        } else if (this.mediaType === "audio") {
          this.mediaElement = uni.createInnerAudioContext();
          this.mediaElement.src = this.source;
          this.mediaElement.autoplay = this.autoplay;
          this.mediaElement.loop = this.loop;

          this.mediaElement.onPlay(() => this.onPlay());
          this.mediaElement.onPause(() => this.onPause());
          this.mediaElement.onEnded(() => this.onEnded());
          this.mediaElement.onError((err) => this.onError(err));
          this.mediaElement.onTimeUpdate(() => {
            this.currentTime = this.mediaElement.currentTime;
            this.duration = this.mediaElement.duration;
            this.onTimeUpdate();
          });
          this.mediaElement.onCanplay(() => this.onLoadedMetadata());
          this.mediaElement.onWaiting(() => this.onWaiting());
        }
      }, 100);
    },

    // 释放媒体资源
    releaseMedia() {
      if (this.mediaType === "audio" && this.mediaElement) {
        this.mediaElement.destroy();
      }
    },

    // 重置状态
    reset() {
      this.isPlaying = false;
      this.isLoading = true;
      this.hasError = false;
      this.errorMessage = "";
      this.currentTime = 0;
      this.duration = 0;
      this.playbackStatus = "重置";
      this.releaseMedia();
    },

    // 格式化时间
    formatTime(seconds) {
      if (isNaN(seconds) || seconds === Infinity) return "0:00";
      seconds = Math.floor(seconds);
      const minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    },

    // 播放
    play() {
      if (this.mediaElement) {
        if (this.mediaType === "video") {
          this.mediaElement.play();
        } else {
          this.mediaElement.play();
        }
        this.isPlaying = true;
        this.playbackStatus = "播放中";
      }
    },

    // 暂停
    pause() {
      if (this.mediaElement) {
        if (this.mediaType === "video") {
          this.mediaElement.pause();
        } else {
          this.mediaElement.pause();
        }
        this.isPlaying = false;
        this.playbackStatus = "已暂停";
      }
    },

    // 停止
    stop() {
      if (this.mediaElement) {
        if (this.mediaType === "video") {
          this.mediaElement.stop();
        } else {
          this.mediaElement.stop();
        }
        this.isPlaying = false;
        this.playbackStatus = "已停止";
      }
    },

    // 重试
    retry() {
      this.reset();
      this.initializeMedia();
      this.$emit("retry");
    },

    // --- 事件处理 ---
    onError(e) {
      console.error(`媒体播放错误 [${this.mediaType}]:`, e);
      this.hasError = true;
      this.isLoading = false;
      this.isPlaying = false;
      this.playbackStatus = "出错";

      // 获取错误信息
      const errorDetail = e.detail || e;
      if (errorDetail.errMsg) {
        if (errorDetail.errMsg.includes("MEDIA_ERR_SRC_NOT_SUPPORTED")) {
          this.errorMessage = "不支持的媒体格式";
        } else if (errorDetail.errMsg.includes("MEDIA_ERR_NETWORK")) {
          this.errorMessage = "网络错误，无法加载媒体文件";
        } else if (errorDetail.errMsg.includes("MEDIA_ERR_DECODE")) {
          this.errorMessage = "媒体解码错误";
        } else {
          this.errorMessage = errorDetail.errMsg || "未知错误";
        }
      } else {
        this.errorMessage = "播放失败，请重试";
      }

      this.$emit("error", {
        type: this.mediaType,
        source: this.source,
        error: errorDetail,
        message: this.errorMessage,
      });
    },

    onPlay() {
      this.isPlaying = true;
      this.isLoading = false;
      this.playbackStatus = "播放中";
      this.$emit("play");
    },

    onPause() {
      this.isPlaying = false;
      this.playbackStatus = "已暂停";
      this.$emit("pause");
    },

    onEnded() {
      this.isPlaying = false;
      this.playbackStatus = "已结束";
      this.$emit("ended");
    },

    onTimeUpdate(e) {
      if (this.mediaType === "video") {
        const detail = e?.detail;
        if (detail) {
          this.currentTime = detail.currentTime;
          this.duration = detail.duration;
        }
      }
      this.$emit("timeupdate", {
        currentTime: this.currentTime,
        duration: this.duration,
      });
    },

    onWaiting() {
      this.isLoading = true;
      this.playbackStatus = "缓冲中";
      this.$emit("waiting");
    },

    onLoadedMetadata(e) {
      this.isLoading = false;
      if (this.mediaType === "video" && e?.detail) {
        this.duration = e.detail.duration;
      }
      this.playbackStatus = "已就绪";
      this.$emit("ready", { duration: this.duration });
    },
  },
};
</script>

<style lang="scss">
.media-player {
  position: relative;
  width: 100%;

  &.full-screen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
  }

  .video-player {
    width: 100%;
    height: 100%;
  }

  .loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;

    .spinner {
      width: 40rpx;
      height: 40rpx;
      border: 4rpx solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s ease-in-out infinite;
    }

    .loading-text {
      margin-top: 10rpx;
      color: #fff;
      font-size: 24rpx;
    }
  }

  .error-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.7);
    padding: 20rpx;
    border-radius: 8rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    text {
      color: #fff;
      font-size: 28rpx;
      margin-bottom: 20rpx;
    }

    .retry-btn {
      background-color: #007aff;
      color: #fff;
      font-size: 24rpx;
      padding: 10rpx 20rpx;
      border-radius: 6rpx;
    }
  }

  .debug-info {
    position: absolute;
    bottom: 20rpx;
    left: 20rpx;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 10rpx;
    border-radius: 6rpx;

    text {
      display: block;
      color: #fff;
      font-size: 22rpx;
      line-height: 1.4;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
