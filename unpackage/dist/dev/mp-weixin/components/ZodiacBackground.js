"use strict";
const common_vendor = require("../common/vendor.js");
const utils_zodiac = require("../utils/zodiac.js");
const _sfc_main = {
  props: {
    birthMonth: {
      type: [Number, String],
      default: 1
    },
    birthDay: {
      type: [Number, String],
      default: 1
    },
    showSymbols: {
      type: Boolean,
      default: true
    },
    showParticles: {
      type: Boolean,
      default: true
    },
    symbolsCount: {
      type: Number,
      default: 12
    },
    particlesCount: {
      type: Number,
      default: 30
    },
    showBackgroundVideo: {
      type: Boolean,
      default: true
    },
    playBackgroundMusic: {
      type: Boolean,
      default: true
      // 默认播放背景音乐
    }
  },
  data() {
    return {
      zodiacSign: null,
      backgroundStyle: {},
      elementClass: "",
      symbols: [],
      particles: [],
      bgVideoOpacity: 0.6,
      // 控制视频透明度
      internalPlayMusic: false,
      // 内部音乐播放状态
      bgAudioManager: null
      // 背景音频管理器引用
    };
  },
  created() {
    this.zodiacSign = utils_zodiac.getZodiacSign(this.birthMonth, this.birthDay);
    this.internalPlayMusic = this.playBackgroundMusic;
    if (this.zodiacSign) {
      const element = utils_zodiac.getZodiacElement(this.zodiacSign.engName);
      this.elementClass = element.type;
      this.setBackgroundStyle(element.color);
      if (this.showSymbols) {
        this.generateSymbols();
      }
      if (this.showParticles) {
        this.generateParticles();
      }
    }
    this.initBackgroundMusic();
  },
  watch: {
    // 监听props变化，更新内部状态
    playBackgroundMusic(newVal) {
      this.internalPlayMusic = newVal;
    }
  },
  mounted() {
    setTimeout(() => {
      this.initBackgroundMusic();
      this.initBackgroundVideo();
    }, 1e3);
  },
  methods: {
    onVideoError(e) {
      common_vendor.index.__f__("error", "at components/ZodiacBackground.vue:162", "背景视频播放错误:", e);
    },
    toggleBackgroundMusic(forcePlay) {
      if (this.internalPlayMusic && !forcePlay) {
        if (this.bgAudioManager) {
          this.bgAudioManager.pause();
        }
        this.internalPlayMusic = false;
        this.$emit("update:playBackgroundMusic", false);
      } else {
        this.internalPlayMusic = true;
        this.$emit("update:playBackgroundMusic", true);
        try {
          if (!this.bgAudioManager) {
            this.bgAudioManager = common_vendor.index.getBackgroundAudioManager();
            this.bgAudioManager.title = "背景音乐";
            this.bgAudioManager.src = "https://mp-51f2d98b-a71a-4395-aaef-36c69c9fa62b.cdn.bspapp.com/music/backgroud-music/backgroud-music-1.MP3";
          }
          this.bgAudioManager.play();
        } catch (err) {
          common_vendor.index.__f__("error", "at components/ZodiacBackground.vue:202", "小程序音频播放失败:", err);
        }
      }
    },
    setBackgroundStyle(baseColor) {
      if (this.zodiacSign) {
        switch (this.elementClass) {
          case "fire":
            this.backgroundStyle = {
              background: `linear-gradient(to bottom, ${baseColor}, #8B2500)`
            };
            break;
          case "earth":
            this.backgroundStyle = {
              background: `linear-gradient(to bottom, ${baseColor}, #556B2F)`
            };
            break;
          case "air":
            this.backgroundStyle = {
              background: `linear-gradient(to bottom, ${baseColor}, #00688B)`
            };
            break;
          case "water":
            this.backgroundStyle = {
              background: `linear-gradient(to bottom, ${baseColor}, #27408B)`
            };
            break;
          default:
            this.backgroundStyle = {
              background: `linear-gradient(to bottom, ${baseColor}, #333333)`
            };
        }
      }
    },
    generateSymbols() {
      this.symbols = Array.from({ length: this.symbolsCount }, () => {
        return {
          x: Math.random() * 100,
          y: Math.random() * 100,
          opacity: 0.1 + Math.random() * 0.5,
          scale: 0.5 + Math.random() * 1,
          rotate: Math.random() * 360,
          delay: Math.random() * 5
        };
      });
    },
    generateParticles() {
      this.particles = Array.from({ length: this.particlesCount }, () => {
        return {
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 3 + Math.random() * 10,
          opacity: 0.1 + Math.random() * 0.7,
          duration: 10 + Math.random() * 20,
          delay: Math.random() * 5
        };
      });
    },
    initBackgroundMusic() {
      this.toggleBackgroundMusic(true);
    },
    // 初始化背景视频
    initBackgroundVideo() {
      try {
        const videoContext = common_vendor.index.createVideoContext("bgVideo", this);
        if (videoContext) {
          videoContext.play();
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at components/ZodiacBackground.vue:293", "小程序视频播放失败:", err);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.showBackgroundVideo
  }, $props.showBackgroundVideo ? {
    b: common_vendor.o((...args) => $options.onVideoError && $options.onVideoError(...args))
  } : {}, {
    c: $data.bgVideoOpacity,
    d: $data.internalPlayMusic
  }, $data.internalPlayMusic ? {} : {}, {
    e: $props.showSymbols
  }, $props.showSymbols ? {
    f: common_vendor.f($data.symbols, (symbol, index, i0) => {
      return {
        a: index,
        b: symbol.x + "%",
        c: symbol.y + "%",
        d: symbol.opacity,
        e: `scale(${symbol.scale}) rotate(${symbol.rotate}deg)`,
        f: symbol.delay + "s"
      };
    })
  } : {}, {
    g: $props.showParticles
  }, $props.showParticles ? {
    h: common_vendor.f($data.particles, (particle, index, i0) => {
      return {
        a: index,
        b: particle.x + "%",
        c: particle.y + "%",
        d: particle.size + "px",
        e: particle.size + "px",
        f: particle.opacity,
        g: particle.duration + "s",
        h: particle.delay + "s"
      };
    }),
    i: common_vendor.n($data.elementClass)
  } : {}, {
    j: common_vendor.s($data.backgroundStyle)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/ZodiacBackground.js.map
