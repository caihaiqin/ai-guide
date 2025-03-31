"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const uni_modules_uniIdPages_init = require("./uni_modules/uni-id-pages/init.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/opening/index.js";
  "./pages/guide/guide.js";
}
const _sfc_main = {
  onLaunch: async function() {
    uni_modules_uniIdPages_init.uniIdPagesInit();
    common_vendor.index.__f__("log", "at App.vue:8", "App Launch");
    if (typeof common_vendor.nr.SSEChannel == "undefined") {
      common_vendor.index.showModal({
        content: "本项目，仅支持HBuilderX 正式版 v3.7.10 或 alpha v3.8.0及以上版本请升级",
        showCancel: false
      });
    }
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:22", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:25", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
