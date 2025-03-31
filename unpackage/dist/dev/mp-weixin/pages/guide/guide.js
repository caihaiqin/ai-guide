"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {
        nickname: "",
        signature: "",
        birthYear: "1996",
        birthMonth: "11",
        birthDay: "3",
        date: ""
      },
      startDate: "1920-01-01",
      endDate: "2100-12-31",
      years: Array.from({ length: 100 }, (_, i) => ((/* @__PURE__ */ new Date()).getFullYear() - 99 + i).toString()),
      months: Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
      days: Array.from({ length: 31 }, (_, i) => (i + 1).toString())
    };
  },
  methods: {
    navigateBack() {
      common_vendor.index.navigateBack();
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
      common_vendor.index.__f__("log", "at pages/guide/guide.vue:81", "打印用户信息", this.userInfo);
      common_vendor.index.setStorageSync("isFirstTime", true);
      common_vendor.index.setStorageSync("userInfo", this.userInfo);
      common_vendor.index.showToast({
        title: "保存成功",
        icon: "success",
        duration: 1500
      });
      common_vendor.index.__f__("log", "at pages/guide/guide.vue:90", "保存个人信息，跳转到首页");
      setTimeout(() => {
        common_vendor.index.reLaunch({
          url: "/pages/index/index",
          success: function() {
            common_vendor.index.__f__("log", "at pages/guide/guide.vue:97", "成功跳转到首页");
          },
          fail: function(err) {
            common_vendor.index.__f__("error", "at pages/guide/guide.vue:100", "跳转失败:", err);
            common_vendor.index.reLaunch({ url: "/pages/index/index" });
          }
        });
      }, 300);
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      type: "left",
      size: "20"
    }),
    b: common_vendor.o((...args) => $options.navigateBack && $options.navigateBack(...args)),
    c: common_vendor.p({
      type: "more-filled",
      size: "20"
    }),
    d: $data.userInfo.nickname,
    e: common_vendor.o(($event) => $data.userInfo.nickname = $event.detail.value),
    f: $data.userInfo.signature,
    g: common_vendor.o(($event) => $data.userInfo.signature = $event.detail.value),
    h: common_vendor.t($data.userInfo.birthYear),
    i: $data.years,
    j: common_vendor.o((...args) => $options.onYearChange && $options.onYearChange(...args)),
    k: common_vendor.t($data.userInfo.birthMonth),
    l: $data.months,
    m: common_vendor.o((...args) => $options.onMonthChange && $options.onMonthChange(...args)),
    n: common_vendor.t($data.userInfo.birthDay),
    o: $data.days,
    p: common_vendor.o((...args) => $options.onDayChange && $options.onDayChange(...args)),
    q: common_vendor.o((...args) => $options.saveUserInfo && $options.saveUserInfo(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/guide/guide.js.map
