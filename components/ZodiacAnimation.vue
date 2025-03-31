<template>
  <view
    class="zodiac-animation"
    :style="{ display: isHidden ? 'none' : 'flex' }"
  >
    <!-- 视频播放 -->
    <block v-if="animationType === 'video'">
      <!-- 尝试MP4格式 -->
      <video
        v-if="!videoError && videoSrc"
        src="https://mp-51f2d98b-a71a-4395-aaef-36c69c9fa62b.cdn.bspapp.com/video/opening-video.mp4"
        autoplay="true"
        loop="true"
        class="zodiac-video"
        :style="{ backgroundColor: backgroundColor }"
        @ended="onVideoEnded"
        @error="onVideoError"
        @waiting="onVideoWaiting"
        @timeupdate="onVideoTimeUpdate"
        object-fit="cover"
        :loop="false"
        :controls="false"
        :enable-progress-gesture="false"
        id="zodiacVideo"
      ></video>
      <!-- 当视频加载失败时切换到SVG -->
      <view
        v-else
        class="zodiac-animation-svg"
        :style="{ backgroundColor: backgroundColor }"
      >
        <svg-animation
          :zodiac="zodiacSign?.engName || 'default'"
        ></svg-animation>
        <view class="zodiac-name">{{ zodiacSign ? zodiacSign.name : "" }}</view>
      </view>
    </block>
    <!-- SVG动画 -->
    <view
      v-else
      class="zodiac-animation-svg"
      :style="{ backgroundColor: backgroundColor }"
    >
      <svg-animation :zodiac="zodiacSign?.engName || 'default'"></svg-animation>
      <view class="zodiac-name">{{ zodiacSign ? zodiacSign.name : "" }}</view>
    </view>

    <!-- 调试信息 -->
    <view v-if="showDebugInfo" class="debug-info">
      <text>视频路径: {{ videoSrc }}</text>
      <text>加载状态: {{ loadingStatus }}</text>
      <text>星座: {{ zodiacSign?.name }}</text>
      <text v-if="errorInfo">错误: {{ errorInfo }}</text>
    </view>
  </view>
</template>

<script>
import { getZodiacSign, getZodiacElement } from "@/utils/zodiac.js";

export default {
  props: {
    birthMonth: {
      type: [Number, String],
      default: 1,
    },
    birthDay: {
      type: [Number, String],
      default: 1,
    },
    animationType: {
      type: String,
      default: "video", // 'video' or 'svg'
    },
    autoHide: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      default: 6000, // 6秒
    },
    showDebugInfo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      zodiacSign: null,
      videoSrc: "",
      isHidden: false,
      backgroundColor: "#000000",
      loadingStatus: "初始化",
      currentType: "video", // 当前实际显示的类型
      videoError: false,
      errorInfo: "",
      tryCount: 0,
      videoTimeout: null,
    };
  },
  created() {
    // 获取星座信息
    this.zodiacSign = getZodiacSign(this.birthMonth, this.birthDay);
    console.log("星座信息:", this.zodiacSign);

    // 获取星座元素信息（背景色）
    if (this.zodiacSign) {
      const element = getZodiacElement(this.zodiacSign.engName);
      this.backgroundColor = element.color;
    }

    // 根据动画类型设置
    this.currentType = this.animationType;
    if (this.currentType === "video") {
      this.setVideoSource();
    }

    // 如果自动隐藏，设置定时器
    if (this.autoHide) {
      setTimeout(() => {
        this.hideAnimation();
      }, this.duration);
    }
  },
  methods: {
    setVideoSource() {
      const zodiacName = this.zodiacSign.engName;
      this.tryCount += 1;

      // 根据不同平台，尝试不同的路径
      let videoPath = "";

      // #ifdef H5
      if (this.tryCount === 1) {
        videoPath = `/static/zodiac/${zodiacName}.mp4`;
      } else if (this.tryCount === 2) {
        videoPath = `./static/zodiac/${zodiacName}.mp4`;
      } else {
        videoPath = `../static/zodiac/${zodiacName}.mp4`;
      }
      // #endif

      // #ifdef MP-WEIXIN
      if (this.tryCount === 1) {
        videoPath = `../static/zodiac/${zodiacName}.mp4`;
      } else if (this.tryCount === 2) {
        videoPath = `../../static/zodiac/${zodiacName}.mp4`;
      } else {
        videoPath = `static/zodiac/${zodiacName}.mp4`;
      }
      // #endif

      // 尝试多种格式
      this.videoSrc = videoPath;
      this.videoError = false;
      this.loadingStatus = `加载中(${this.tryCount}/3): ${videoPath}`;
      console.log(`尝试加载视频: ${videoPath}`);

      // 如果短时间内无法播放，则设置超时
      clearTimeout(this.videoTimeout);
      this.videoTimeout = setTimeout(() => {
        if (this.loadingStatus.includes("加载中")) {
          console.warn("视频加载超时");
          this.onVideoError({ error: "timeout", errMsg: "加载超时" });
        }
      }, 5000);
    },
    onVideoEnded() {
      console.log("视频播放完成");
      this.loadingStatus = "播放完成";
      this.$emit("animationComplete");
      if (this.autoHide) {
        this.hideAnimation();
      }
    },
    onVideoError(e) {
      console.error("视频播放错误:", e);
      const errorDetail = e.detail || e;
      this.errorInfo = JSON.stringify(errorDetail);
      this.loadingStatus = "播放出错";
      this.videoError = true;

      // 检查是否是格式不支持的错误
      let errorMessage = "";
      if (
        errorDetail.errMsg &&
        errorDetail.errMsg.includes("MEDIA_ERR_SRC_NOT_SUPPORTED")
      ) {
        errorMessage = "视频格式不支持";
        console.error("视频格式不支持，请参考格式要求：");
        console.error("1. 格式：MP4（H.264编码，AAC音频）");
        console.error("2. 分辨率：建议不超过720p");
        console.error("3. 帧率：30fps");
        console.error("4. 比特率：不超过1.5Mbps");
        console.error("5. 大小：不超过10MB");
      } else {
        errorMessage = "视频播放异常";
      }

      // 发送错误事件到父组件
      this.$emit("videoError", {
        ...errorDetail,
        videoPath: this.videoSrc,
        errorMessage: errorMessage,
      });

      // 如果尝试次数少于3次，则尝试其他格式或路径
      if (this.tryCount < 3) {
        console.log(`尝试其他路径(${this.tryCount}/3)`);
        this.setVideoSource();
      } else {
        console.warn("视频加载多次失败，切换到SVG");
        this.currentType = "svg";
      }
    },
    onVideoWaiting() {
      console.log("视频缓冲中...");
      this.loadingStatus = "缓冲中";
    },
    onVideoTimeUpdate(e) {
      if (this.loadingStatus !== "播放中") {
        console.log("视频开始播放");
        this.loadingStatus = "播放中";
      }
    },
    hideAnimation() {
      this.isHidden = true;
      this.$emit("animationComplete");
    },
  },
};
</script>

<style lang="scss">
.zodiac-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transition: opacity 0.5s ease;

  .zodiac-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .zodiac-animation-svg {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .zodiac-name {
    position: absolute;
    bottom: 50px;
    font-size: 48rpx;
    color: #ffffff;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  .debug-info {
    position: absolute;
    top: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    font-size: 24rpx;
    max-width: 70%;
    z-index: 1000;

    text {
      display: block;
      margin-bottom: 5px;
    }
  }
}
</style>
