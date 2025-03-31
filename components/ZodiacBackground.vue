<template>
  <view class="zodiac-background" :style="backgroundStyle">
    <!-- 背景视频组件 -->
    <view class="bg-video-container" :style="{ opacity: bgVideoOpacity }">
      <video
        v-if="showBackgroundVideo"
        class="bg-video"
        src="https://mp-51f2d98b-a71a-4395-aaef-36c69c9fa62b.cdn.bspapp.com/video/backgroud-video/backgroud-video-1.mp4"
        :loop="true"
        :controls="false"
        :muted="true"
        :autoplay="true"
        object-fit="cover"
        @error="onVideoError"
        id="bgVideo"
        ref="bgVideo"
      ></video>
    </view>

    <!-- 背景音乐 -->
    <audio
      v-if="internalPlayMusic"
      src="https://mp-51f2d98b-a71a-4395-aaef-36c69c9fa62b.cdn.bspapp.com/music/backgroud-music/backgroud-music-1.MP3"
      :autoplay="true"
      :loop="true"
      id="bgMusic"
      ref="bgMusic"
    ></audio>

    <!-- 星座符号装饰 -->
    <view v-if="showSymbols" class="zodiac-symbols">
      <view
        v-for="(symbol, index) in symbols"
        :key="index"
        class="symbol"
        :style="{
          left: symbol.x + '%',
          top: symbol.y + '%',
          opacity: symbol.opacity,
          transform: `scale(${symbol.scale}) rotate(${symbol.rotate}deg)`,
          animationDelay: symbol.delay + 's',
        }"
      >
        <view class="symbol-inner"></view>
      </view>
    </view>

    <!-- 动态粒子效果 -->
    <view v-if="showParticles" class="particles">
      <view
        v-for="(particle, index) in particles"
        :key="index"
        class="particle"
        :class="[elementClass]"
        :style="{
          left: particle.x + '%',
          top: particle.y + '%',
          width: particle.size + 'px',
          height: particle.size + 'px',
          opacity: particle.opacity,
          animationDuration: particle.duration + 's',
          animationDelay: particle.delay + 's',
        }"
      ></view>
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
    showSymbols: {
      type: Boolean,
      default: true,
    },
    showParticles: {
      type: Boolean,
      default: true,
    },
    symbolsCount: {
      type: Number,
      default: 12,
    },
    particlesCount: {
      type: Number,
      default: 30,
    },
    showBackgroundVideo: {
      type: Boolean,
      default: true,
    },
    playBackgroundMusic: {
      type: Boolean,
      default: true, // 默认播放背景音乐
    },
  },
  data() {
    return {
      zodiacSign: null,
      backgroundStyle: {},
      elementClass: "",
      symbols: [],
      particles: [],
      bgVideoOpacity: 0.6, // 控制视频透明度
      internalPlayMusic: false, // 内部音乐播放状态
      bgAudioManager: null, // 背景音频管理器引用
    };
  },
  created() {
    // 获取星座信息
    this.zodiacSign = getZodiacSign(this.birthMonth, this.birthDay);

    // 初始化内部状态
    this.internalPlayMusic = this.playBackgroundMusic;

    // 获取星座元素信息
    if (this.zodiacSign) {
      const element = getZodiacElement(this.zodiacSign.engName);
      this.elementClass = element.type;

      // 设置背景样式
      this.setBackgroundStyle(element.color);

      // 生成符号和粒子
      if (this.showSymbols) {
        this.generateSymbols();
      }

      if (this.showParticles) {
        this.generateParticles();
      }
    }

    // 尝试初始化背景音乐播放
    this.initBackgroundMusic();
  },
  watch: {
    // 监听props变化，更新内部状态
    playBackgroundMusic(newVal) {
      this.internalPlayMusic = newVal;
    },
  },
  mounted() {
    // 在mounted阶段再次尝试初始化音乐，以应对不同平台
    setTimeout(() => {
      this.initBackgroundMusic();
      this.initBackgroundVideo();
    }, 1000);
  },
  methods: {
    onVideoError(e) {
      console.error("背景视频播放错误:", e);
      // 视频播放错误时，可以调整样式或显示备用内容
    },
    toggleBackgroundMusic(forcePlay) {
      // 修改内部状态而不是直接修改props
      if (this.internalPlayMusic && !forcePlay) {
        // 如果当前正在播放，尝试停止背景音乐
        // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
        if (this.bgAudioManager) {
          this.bgAudioManager.pause();
        }
        // #endif

        // #ifdef H5
        const bgMusic = this.$refs.bgMusic;
        if (bgMusic) {
          bgMusic.pause();
        }
        // #endif

        this.internalPlayMusic = false;
        // 通知父组件状态变化
        this.$emit("update:playBackgroundMusic", false);
      } else {
        // 如果当前未播放，尝试播放背景音乐
        this.internalPlayMusic = true;
        // 通知父组件状态变化
        this.$emit("update:playBackgroundMusic", true);

        // 在小程序环境中，使用uni.getBackgroundAudioManager来播放音频
        // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
        try {
          if (!this.bgAudioManager) {
            this.bgAudioManager = uni.getBackgroundAudioManager();
            this.bgAudioManager.title = "背景音乐";
            this.bgAudioManager.src =
              "https://mp-51f2d98b-a71a-4395-aaef-36c69c9fa62b.cdn.bspapp.com/music/backgroud-music/backgroud-music-1.MP3";
          }
          this.bgAudioManager.play();
        } catch (err) {
          console.error("小程序音频播放失败:", err);
        }
        // #endif

        // 在H5环境中，使用DOM API播放音频
        // #ifdef H5
        setTimeout(() => {
          const bgMusic = this.$refs.bgMusic;
          if (bgMusic) {
            const playPromise = bgMusic.play();
            if (playPromise) {
              playPromise.catch((err) => {
                console.warn("H5自动播放失败，可能需要用户交互:", err);
              });
            }
          }
        }, 100);
        // #endif
      }
    },
    setBackgroundStyle(baseColor) {
      // 根据星座元素设置不同的背景样式
      if (this.zodiacSign) {
        switch (this.elementClass) {
          case "fire":
            this.backgroundStyle = {
              background: `linear-gradient(to bottom, ${baseColor}, #8B2500)`,
            };
            break;
          case "earth":
            this.backgroundStyle = {
              background: `linear-gradient(to bottom, ${baseColor}, #556B2F)`,
            };
            break;
          case "air":
            this.backgroundStyle = {
              background: `linear-gradient(to bottom, ${baseColor}, #00688B)`,
            };
            break;
          case "water":
            this.backgroundStyle = {
              background: `linear-gradient(to bottom, ${baseColor}, #27408B)`,
            };
            break;
          default:
            this.backgroundStyle = {
              background: `linear-gradient(to bottom, ${baseColor}, #333333)`,
            };
        }
      }
    },
    generateSymbols() {
      // 生成星座符号装饰
      this.symbols = Array.from({ length: this.symbolsCount }, () => {
        return {
          x: Math.random() * 100,
          y: Math.random() * 100,
          opacity: 0.1 + Math.random() * 0.5,
          scale: 0.5 + Math.random() * 1,
          rotate: Math.random() * 360,
          delay: Math.random() * 5,
        };
      });
    },
    generateParticles() {
      // 生成粒子效果
      this.particles = Array.from({ length: this.particlesCount }, () => {
        return {
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 3 + Math.random() * 10,
          opacity: 0.1 + Math.random() * 0.7,
          duration: 10 + Math.random() * 20,
          delay: Math.random() * 5,
        };
      });
    },
    initBackgroundMusic() {
      // 初始化背景音乐播放
      this.toggleBackgroundMusic(true);
    },
    // 初始化背景视频
    initBackgroundVideo() {
      // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
      // 小程序环境中，使用uni.createVideoContext来控制视频
      try {
        const videoContext = uni.createVideoContext("bgVideo", this);
        if (videoContext) {
          videoContext.play();
        }
      } catch (err) {
        console.error("小程序视频播放失败:", err);
      }
      // #endif

      // #ifdef H5
      // H5环境中，使用DOM API播放视频
      setTimeout(() => {
        const bgVideo = this.$refs.bgVideo;
        if (bgVideo) {
          const playPromise = bgVideo.play();
          if (playPromise) {
            playPromise.catch((err) => {
              console.warn("H5视频自动播放失败，可能需要用户交互:", err);
            });
          }
        }
      }, 200);
      // #endif
    },
  },
};
</script>

<style lang="scss">
.zodiac-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  overflow: hidden;

  .bg-video-container {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;

    .bg-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .zodiac-symbols {
    position: absolute;
    width: 100%;
    height: 100%;

    .symbol {
      position: absolute;
      width: 30px;
      height: 30px;
      animation: float 8s ease-in-out infinite;

      .symbol-inner {
        width: 100%;
        height: 100%;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
      }
    }
  }

  .particles {
    position: absolute;
    width: 100%;
    height: 100%;

    .particle {
      position: absolute;
      border-radius: 50%;
      animation: rise 15s linear infinite;

      &.fire {
        background: radial-gradient(
          circle,
          rgba(255, 165, 0, 0.8),
          rgba(255, 0, 0, 0.4)
        );
        box-shadow: 0 0 10px rgba(255, 165, 0, 0.6);
      }

      &.earth {
        background: radial-gradient(
          circle,
          rgba(139, 105, 20, 0.8),
          rgba(85, 107, 47, 0.4)
        );
        box-shadow: 0 0 10px rgba(139, 105, 20, 0.6);
      }

      &.air {
        background: radial-gradient(
          circle,
          rgba(178, 223, 238, 0.8),
          rgba(135, 206, 250, 0.4)
        );
        box-shadow: 0 0 10px rgba(178, 223, 238, 0.6);
      }

      &.water {
        background: radial-gradient(
          circle,
          rgba(30, 144, 255, 0.8),
          rgba(0, 0, 139, 0.4)
        );
        box-shadow: 0 0 10px rgba(30, 144, 255, 0.6);
      }
    }
  }
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

@keyframes rise {
  0% {
    transform: translateY(120%) translateX(0);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-20%) translateX(20px);
    opacity: 0;
  }
}
</style>
