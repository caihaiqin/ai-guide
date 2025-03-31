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
    animationType: {
      type: String,
      default: "video"
      // 'video' or 'svg'
    },
    autoHide: {
      type: Boolean,
      default: true
    },
    duration: {
      type: Number,
      default: 6e3
      // 6秒
    },
    showDebugInfo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      zodiacSign: null,
      videoSrc: "",
      isHidden: false,
      backgroundColor: "#000000",
      loadingStatus: "初始化",
      currentType: "video",
      // 当前实际显示的类型
      videoError: false,
      errorInfo: "",
      tryCount: 0,
      videoTimeout: null
    };
  },
  created() {
    this.zodiacSign = utils_zodiac.getZodiacSign(this.birthMonth, this.birthDay);
    common_vendor.index.__f__("log", "at components/ZodiacAnimation.vue:105", "星座信息:", this.zodiacSign);
    if (this.zodiacSign) {
      const element = utils_zodiac.getZodiacElement(this.zodiacSign.engName);
      this.backgroundColor = element.color;
    }
    this.currentType = this.animationType;
    if (this.currentType === "video") {
      this.setVideoSource();
    }
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
      let videoPath = "";
      if (this.tryCount === 1) {
        videoPath = `../static/zodiac/${zodiacName}.mp4`;
      } else if (this.tryCount === 2) {
        videoPath = `../../static/zodiac/${zodiacName}.mp4`;
      } else {
        videoPath = `static/zodiac/${zodiacName}.mp4`;
      }
      this.videoSrc = videoPath;
      this.videoError = false;
      this.loadingStatus = `加载中(${this.tryCount}/3): ${videoPath}`;
      common_vendor.index.__f__("log", "at components/ZodiacAnimation.vue:158", `尝试加载视频: ${videoPath}`);
      clearTimeout(this.videoTimeout);
      this.videoTimeout = setTimeout(() => {
        if (this.loadingStatus.includes("加载中")) {
          common_vendor.index.__f__("warn", "at components/ZodiacAnimation.vue:164", "视频加载超时");
          this.onVideoError({ error: "timeout", errMsg: "加载超时" });
        }
      }, 5e3);
    },
    onVideoEnded() {
      common_vendor.index.__f__("log", "at components/ZodiacAnimation.vue:170", "视频播放完成");
      this.loadingStatus = "播放完成";
      this.$emit("animationComplete");
      if (this.autoHide) {
        this.hideAnimation();
      }
    },
    onVideoError(e) {
      common_vendor.index.__f__("error", "at components/ZodiacAnimation.vue:178", "视频播放错误:", e);
      const errorDetail = e.detail || e;
      this.errorInfo = JSON.stringify(errorDetail);
      this.loadingStatus = "播放出错";
      this.videoError = true;
      let errorMessage = "";
      if (errorDetail.errMsg && errorDetail.errMsg.includes("MEDIA_ERR_SRC_NOT_SUPPORTED")) {
        errorMessage = "视频格式不支持";
        common_vendor.index.__f__("error", "at components/ZodiacAnimation.vue:191", "视频格式不支持，请参考格式要求：");
        common_vendor.index.__f__("error", "at components/ZodiacAnimation.vue:192", "1. 格式：MP4（H.264编码，AAC音频）");
        common_vendor.index.__f__("error", "at components/ZodiacAnimation.vue:193", "2. 分辨率：建议不超过720p");
        common_vendor.index.__f__("error", "at components/ZodiacAnimation.vue:194", "3. 帧率：30fps");
        common_vendor.index.__f__("error", "at components/ZodiacAnimation.vue:195", "4. 比特率：不超过1.5Mbps");
        common_vendor.index.__f__("error", "at components/ZodiacAnimation.vue:196", "5. 大小：不超过10MB");
      } else {
        errorMessage = "视频播放异常";
      }
      this.$emit("videoError", {
        ...errorDetail,
        videoPath: this.videoSrc,
        errorMessage
      });
      if (this.tryCount < 3) {
        common_vendor.index.__f__("log", "at components/ZodiacAnimation.vue:210", `尝试其他路径(${this.tryCount}/3)`);
        this.setVideoSource();
      } else {
        common_vendor.index.__f__("warn", "at components/ZodiacAnimation.vue:213", "视频加载多次失败，切换到SVG");
        this.currentType = "svg";
      }
    },
    onVideoWaiting() {
      common_vendor.index.__f__("log", "at components/ZodiacAnimation.vue:218", "视频缓冲中...");
      this.loadingStatus = "缓冲中";
    },
    onVideoTimeUpdate(e) {
      if (this.loadingStatus !== "播放中") {
        common_vendor.index.__f__("log", "at components/ZodiacAnimation.vue:223", "视频开始播放");
        this.loadingStatus = "播放中";
      }
    },
    hideAnimation() {
      this.isHidden = true;
      this.$emit("animationComplete");
    }
  }
};
if (!Array) {
  const _component_svg_animation = common_vendor.resolveComponent("svg-animation");
  _component_svg_animation();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c;
  return common_vendor.e({
    a: $props.animationType === "video"
  }, $props.animationType === "video" ? common_vendor.e({
    b: !$data.videoError && $data.videoSrc
  }, !$data.videoError && $data.videoSrc ? {
    c: $data.backgroundColor,
    d: common_vendor.o((...args) => $options.onVideoEnded && $options.onVideoEnded(...args)),
    e: common_vendor.o((...args) => $options.onVideoError && $options.onVideoError(...args)),
    f: common_vendor.o((...args) => $options.onVideoWaiting && $options.onVideoWaiting(...args)),
    g: common_vendor.o((...args) => $options.onVideoTimeUpdate && $options.onVideoTimeUpdate(...args))
  } : {
    h: common_vendor.p({
      zodiac: ((_a = $data.zodiacSign) == null ? void 0 : _a.engName) || "default"
    }),
    i: common_vendor.t($data.zodiacSign ? $data.zodiacSign.name : ""),
    j: $data.backgroundColor
  }) : {
    k: common_vendor.p({
      zodiac: ((_b = $data.zodiacSign) == null ? void 0 : _b.engName) || "default"
    }),
    l: common_vendor.t($data.zodiacSign ? $data.zodiacSign.name : ""),
    m: $data.backgroundColor
  }, {
    n: $props.showDebugInfo
  }, $props.showDebugInfo ? common_vendor.e({
    o: common_vendor.t($data.videoSrc),
    p: common_vendor.t($data.loadingStatus),
    q: common_vendor.t((_c = $data.zodiacSign) == null ? void 0 : _c.name),
    r: $data.errorInfo
  }, $data.errorInfo ? {
    s: common_vendor.t($data.errorInfo)
  } : {}) : {}, {
    t: $data.isHidden ? "none" : "flex"
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/ZodiacAnimation.js.map
