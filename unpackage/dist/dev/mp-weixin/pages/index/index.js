"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const common_unicloudCoTask = require("../../common/unicloud-co-task.js");
const pages_index_SliceMsgToLastMsg = require("./SliceMsgToLastMsg.js");
const ZodiacAnimation = () => "../../components/ZodiacAnimation.js";
const ZodiacBackground = () => "../../components/ZodiacBackground.js";
let uniCoTaskList = [];
uniCoTaskList.clear = function() {
  uniCoTaskList.forEach((task) => task.abort());
  uniCoTaskList.slice(0, uniCoTaskList.length);
};
const { adpid } = config.config;
let sseChannel = false;
const _sfc_main = {
  components: {
    ZodiacAnimation,
    ZodiacBackground
  },
  data() {
    return {
      // 使聊天窗口滚动到指定元素id的值
      scrollIntoView: "",
      // 消息列表数据
      msgList: [],
      // 通讯请求状态
      requestState: 0,
      //0发送中 100发送成功 -100发送失败
      // 本地对话是否因积分不足而终止
      insufficientScore: false,
      //个人信息
      userInfo: "",
      // 输入框的消息内容
      content: '参考用户个人信息和今日天气情况，生成一个今日指引，包括个人信息包括年龄（用户年龄给一个幽默的修饰词）、星座、天气情况、着装建议，谈事情的时间，感情、会客时间等等。让我心理更有依据和信息去完成每日的工作生活。输出内容不要写"玄学"二字。天气如下：',
      // 记录流式响应次数
      sseIndex: 0,
      // 是否启用流式响应模式
      enableStream: true,
      // 当前屏幕是否为宽屏
      isWidescreen: false,
      // 广告位id
      adpid,
      llmModel: false,
      keyboardHeight: 0,
      // 是否显示星座动画
      showZodiacAnimation: true,
      // 动画类型 'video' 或 'svg'
      animationType: "video",
      bgMusicPlaying: true
    };
  },
  computed: {
    // 输入框是否禁用
    inputBoxDisabled() {
      if (this.sseIndex !== 0) {
        return true;
      }
      return !!(this.msgList.length && this.msgList.length % 2 !== 0);
    },
    // 获取当前环境
    NODE_ENV() {
      return "development";
    },
    footBoxPaddingBottom() {
      return (this.keyboardHeight || 10) + "px";
    }
  },
  // 监听msgList变化，将其存储到本地缓存中
  watch: {
    msgList: {
      handler(msgList) {
        common_vendor.index.setStorage({
          key: "uni-ai-msg",
          data: msgList
        });
      },
      // 深度监听msgList变化
      deep: true
    },
    insufficientScore(insufficientScore) {
      common_vendor.index.setStorage({
        key: "uni-ai-chat-insufficientScore",
        data: insufficientScore
      });
    },
    llmModel(llmModel) {
      common_vendor.index.setStorage({
        key: "uni-ai-chat-llmModel",
        data: llmModel
      });
    }
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at pages/index/index.vue:247", "检查是否首次进入");
    let isFirstTime = common_vendor.index.getStorageSync("isFirstTime");
    let hasPlayedOpeningVideo = common_vendor.index.getStorageSync("hasPlayedOpeningVideo");
    let isNavigating = common_vendor.index.getStorageSync("isNavigating");
    if (isNavigating) {
      common_vendor.index.__f__("log", "at pages/index/index.vue:254", "已有导航请求正在处理，跳过");
      common_vendor.index.removeStorageSync("isNavigating");
      return;
    }
    if (!isFirstTime) {
      common_vendor.index.__f__("log", "at pages/index/index.vue:261", "跳转到个人信息");
      common_vendor.index.setStorageSync("isNavigating", true);
      setTimeout(() => {
        common_vendor.index.reLaunch({
          url: "/pages/guide/guide",
          success: function() {
            common_vendor.index.__f__("log", "at pages/index/index.vue:270", "成功跳转到guide页面");
          },
          fail: function(err) {
            common_vendor.index.__f__("error", "at pages/index/index.vue:273", "跳转失败:", err);
            common_vendor.index.showToast({
              title: "导航失败，已跳过新用户引导",
              icon: "none"
            });
            let defaultUserInfo = {
              nickname: "新用户",
              signature: "欢迎使用",
              birthYear: "1996",
              birthMonth: "11",
              birthDay: "3"
            };
            common_vendor.index.setStorageSync("userInfo", defaultUserInfo);
            common_vendor.index.setStorageSync("isFirstTime", true);
          },
          complete: function() {
            common_vendor.index.removeStorageSync("isNavigating");
          }
        });
      }, 300);
    } else if (!hasPlayedOpeningVideo) {
      common_vendor.index.navigateTo({
        url: "/pages/opening/index",
        animationType: "none"
      });
      common_vendor.index.setStorageSync("hasPlayedOpeningVideo", true);
    }
  },
  beforeMount() {
  },
  async mounted() {
    const userInfoStorage = common_vendor.index.getStorageSync("userInfo");
    if (userInfoStorage) {
      this.userInfo = userInfoStorage;
      common_vendor.index.__f__("log", "at pages/index/index.vue:327", "获取到用户信息:", this.userInfo);
    } else {
      this.userInfo = {
        birthMonth: 6,
        birthDay: 22
      };
    }
    const systemInfo = common_vendor.index.getSystemInfoSync();
    this.animationType = systemInfo.platform === "android" && systemInfo.system.split(" ")[1] < 9 ? "svg" : "video";
    const wetherData = await common_vendor.index.request({
      url: "https://restapi.amap.com/v3/weather/weatherInfo",
      method: "GET",
      data: {
        key: "bf987f744fd15fb566b0252c7f8f55c3",
        city: "440300",
        extensions: "base"
      }
    });
    if (wetherData.data.status == 1) {
      const { data } = wetherData;
      if (data.count > 0) {
        let getFormattedDate = function(date) {
          let year = date.getFullYear();
          let month = String(date.getMonth() + 1).padStart(2, "0");
          let day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };
        this.userInfo = common_vendor.index.getStorageSync("userInfo");
        common_vendor.index.__f__("log", "at pages/index/index.vue:361", "个人信息", this.userInfo);
        const infoContent = "姓名：" + this.userInfo.nickname + "\n生日:" + this.userInfo.birthYear + "-" + this.userInfo.birthMonth + "-" + this.userInfo.birthDay + "\n星座:根据生日测算";
        let formattedDate = getFormattedDate(/* @__PURE__ */ new Date());
        common_vendor.index.__f__("log", "at pages/index/index.vue:384", formattedDate);
        this.content = this.content + data.lives[0].city + "气温" + data.lives[0].temperature + data.lives[0].weather + "个人信息：" + infoContent + "\n今天日期:" + formattedDate;
      }
    }
    this.beforeSend();
    if (this.adpid && common_vendor.nr.getCurrentUserInfo().tokenExpired > Date.now()) {
      let db = common_vendor.nr.databaseForJQL();
      let res = await db.collection("uni-id-users").where({
        // 当前用户id
        _id: common_vendor.nr.getCurrentUserInfo().uid
      }).field("score").get();
      common_vendor.index.__f__("log", "at pages/index/index.vue:417", "当前用户有多少积分:", res.data[0] && res.data[0].score);
    }
    this.msgList = common_vendor.index.getStorageSync("uni-ai-msg") || [];
    this.llmModel = common_vendor.index.getStorageSync("uni-ai-chat-llmModel");
    this.insufficientScore = common_vendor.index.getStorageSync("uni-ai-chat-insufficientScore") || false;
    let length = this.msgList.length;
    if (length) {
      let lastMsg = this.msgList[length - 1];
      if (!lastMsg.isAi) {
        this.send();
      }
    }
    this.$nextTick(() => {
      this.showLastMsg();
    });
    common_vendor.index.onKeyboardHeightChange((e) => {
      this.keyboardHeight = e.height;
      this.$nextTick(() => {
        this.showLastMsg();
      });
    });
  },
  methods: {
    setLLMmodel() {
      this.$refs["llm-config"].open((model) => {
        common_vendor.index.__f__("log", "at pages/index/index.vue:521", "model", model);
        this.llmModel = model;
      });
    },
    // 此(惰性)函数，检查是否开通uni-push;决定是否启用enableStream
    async checkIsOpenPush() {
      try {
        await common_vendor.index.getPushClientId();
        this.checkIsOpenPush = () => {
        };
      } catch (err) {
        this.enableStream = false;
      }
    },
    // 更新最后一条消息
    updateLastMsg(param) {
      let length = this.msgList.length;
      if (length === 0) {
        return;
      }
      let lastMsg = this.msgList[length - 1];
      if (typeof param == "function") {
        let callback = param;
        callback(lastMsg);
      } else {
        const [data, cover = false] = arguments;
        if (cover) {
          lastMsg = data;
        } else {
          lastMsg = Object.assign(lastMsg, data);
        }
      }
      this.msgList.splice(length - 1, 1, lastMsg);
    },
    // 广告关闭事件
    onAdClose(e) {
      common_vendor.index.__f__("log", "at pages/index/index.vue:562", "onAdClose e.detail.isEnded", e.detail.isEnded);
      if (e.detail.isEnded) {
        let i = 0;
        common_vendor.index.showLoading({
          mask: true
        });
        let myIntive = setInterval(async (e2) => {
          i++;
          const db = common_vendor.nr.database();
          let res = await db.collection("uni-id-users").where('"_id" == $cloudEnv_uid').field("score").get();
          let { score } = res.result.data[0] || {};
          common_vendor.index.__f__("log", "at pages/index/index.vue:584", "score", score);
          if (score > 0 || i > 5) {
            clearInterval(myIntive);
            common_vendor.index.hideLoading();
            if (score > 0) {
              this.insufficientScore = false;
              this.msgList.pop();
              this.$nextTick(() => {
                this.send();
                common_vendor.index.showToast({
                  title: "积分余额:" + score,
                  icon: "none"
                });
              });
            }
          }
        }, 2e3);
      }
    },
    // 换一个答案
    async changeAnswer() {
      if (this.sseIndex) {
        this.closeSseChannel();
      }
      this.msgList.pop();
      this.updateLastMsg({
        // 防止 偶发答案涉及敏感，重复回答时。提问内容 被卡掉无法重新问
        illegal: false
      });
      this.insufficientScore = false;
      this.send();
    },
    removeMsg(index) {
      if (this.msgList[index].isAi) {
        index -= 1;
      }
      if (this.sseIndex && index == this.msgList.length - 2) {
        this.closeSseChannel();
      }
      this.msgList.splice(index, 2);
    },
    async beforeSend() {
      common_vendor.index.__f__("log", "at pages/index/index.vue:637", "发送");
      if (this.inputBoxDisabled) {
        return common_vendor.index.showToast({
          title: "ai正在回复中不能发送",
          icon: "none"
        });
      }
      if (this.adpid) {
        let token = common_vendor.index.getStorageSync("uni_id_token");
        if (!token) {
          return common_vendor.index.showModal({
            // 提示内容
            content: "启用激励视频，客户端需登录并启用安全网络",
            // 不显示取消按钮
            showCancel: false,
            // 确认按钮文本
            confirmText: "查看详情",
            // 弹框关闭后执行的回调函数
            complete() {
              let url = "https://uniapp.dcloud.net.cn/uniCloud/uni-ai-chat.html#ad";
              common_vendor.index.setClipboardData({
                // 复制的内容
                data: url,
                // 不显示提示框
                showToast: false,
                // 复制成功后的回调函数
                success() {
                  common_vendor.index.showToast({
                    // 提示内容
                    title: "已复制文档链接，请到浏览器粘贴浏览",
                    // 不显示图标
                    icon: "none",
                    // 提示框持续时间
                    duration: 5e3
                  });
                }
              });
            }
          });
        }
      }
      if (!this.content) {
        return common_vendor.index.showToast({
          // 提示内容
          title: "内容不能为空",
          // 不显示图标
          icon: "none"
        });
      }
      this.msgList.push({
        // 标记为非人工智能机器人，即：为用户发送的消息
        isAi: false,
        // 消息内容
        content: this.content,
        // 消息创建时间
        create_time: Date.now()
      });
      this.showLastMsg();
      this.$nextTick(() => {
        this.content = "";
      });
      this.send();
    },
    async send() {
      this.requestState = 0;
      uniCoTaskList.clear();
      if (this.afterChatCompletion && this.afterChatCompletion.clear)
        this.afterChatCompletion.clear();
      let messages = [];
      let msgs = JSON.parse(JSON.stringify(this.msgList));
      let findIndex = [...msgs].reverse().findIndex((item) => item.summarize);
      if (findIndex != -1) {
        let aiSummaryIndex = msgs.length - findIndex - 1;
        msgs[aiSummaryIndex].content = msgs[aiSummaryIndex].summarize;
        msgs = msgs.splice(aiSummaryIndex);
      } else {
        msgs = msgs.splice(-10);
      }
      msgs = msgs.filter((msg) => !msg.illegal);
      messages = msgs.map((item) => {
        let role = "user";
        if (item.isAi) {
          role = item.summarize ? "system" : "assistant";
        }
        return {
          content: item.content,
          role
        };
      });
      common_vendor.index.__f__("log", "at pages/index/index.vue:771", "send to ai messages:", messages);
      await this.checkIsOpenPush();
      let sseEnd, requestEnd;
      if (this.enableStream) {
        sseChannel = new common_vendor.nr.SSEChannel();
        this.sliceMsgToLastMsg = new pages_index_SliceMsgToLastMsg.SliceMsgToLastMsg(this);
        sseChannel.on("message", (message) => {
          if (this.sseIndex === 0) {
            this.msgList.push({
              isAi: true,
              content: message,
              create_time: Date.now()
            });
          } else {
            this.sliceMsgToLastMsg.addMsg(message);
          }
          this.showLastMsg();
          this.sseIndex++;
        });
        sseChannel.on("end", (e) => {
          common_vendor.index.__f__("log", "at pages/index/index.vue:812", "sse 结束", e);
          this.sliceMsgToLastMsg.t = 0;
          if (e && typeof e == "object" && e.errCode) {
            let setLastAiMsgContent = (content) => {
              if (this.sseIndex === 0) {
                this.msgList.push({
                  isAi: true,
                  content,
                  create_time: Date.now()
                });
              } else {
                this.updateLastMsg((lastMsg) => {
                  lastMsg.content += content;
                });
              }
              this.showLastMsg();
            };
            if (e.errCode == 60004) {
              let length = this.msgList.length;
              if (length % 2) {
                this.msgList.push({
                  isAi: true,
                  content: "内容涉及敏感",
                  illegal: true,
                  create_time: Date.now()
                });
                length += 1;
              }
              this.msgList[length - 2].illegal = true;
              this.msgList[length - 1].illegal = true;
              this.msgList[length - 1].content = "内容涉及敏感";
            } else {
              setLastAiMsgContent(e.errMsg);
            }
          }
          sseEnd();
        });
        await sseChannel.open();
        (function fnSelf(that) {
          fnSelf.clear = () => {
            if (fnSelf.clear.sse) {
              fnSelf.clear.sse();
            }
            if (fnSelf.clear.request) {
              fnSelf.clear.request();
            }
          };
          Promise.all([
            new Promise((resolve, reject) => {
              sseEnd = resolve;
              fnSelf.clear.sse = reject;
            }),
            new Promise((resolve, reject) => {
              requestEnd = resolve;
              fnSelf.clear.request = reject;
            })
          ]).then((e) => {
            sseChannel.close();
            that.sseIndex = 0;
          }).catch((err) => {
          });
          that.afterChatCompletion = fnSelf;
        })(this);
      }
      let task = common_unicloudCoTask.main({
        coName: "uni-ai-chat",
        funName: "send",
        param: [
          {
            messages,
            // 消息列表
            sseChannel,
            // 消息通道
            llmModel: this.llmModel
          }
        ],
        config: {
          customUI: true
        },
        success: (res) => {
          this.requestState = 100;
          if (!res.data)
            return;
          let { reply, summarize, insufficientScore, illegal } = res.data;
          if (this.enableStream == false && !reply) {
            illegal = true;
            reply = "内容涉及敏感";
          }
          if (this.enableStream == false && illegal) {
            common_vendor.index.__f__("error", "at pages/index/index.vue:927", "内容涉及敏感");
            this.updateLastMsg({
              // 添加消息涉敏标记
              illegal: true
            });
          }
          if (this.enableStream == false || this.sseIndex == 0 && (illegal || insufficientScore)) {
            this.msgList.push({
              // 消息创建时间
              create_time: Date.now(),
              // 标记消息为来自AI机器人
              isAi: true,
              // 消息内容
              content: reply,
              // 消息是否涉敏标记
              illegal
            });
          }
          if (insufficientScore) {
            this.insufficientScore = true;
          }
          if (summarize) {
            common_vendor.index.__f__("log", "at pages/index/index.vue:958", " 拿到总结", summarize);
            let index = this.msgList.length - 1;
            if (index % 2) {
              index -= 2;
            } else {
              index -= 1;
            }
            if (index < 1) {
              index = 1;
            }
            let msg = this.msgList[index];
            msg.summarize = summarize;
            this.msgList.splice(index, 1, msg);
          }
        },
        complete: (e) => {
          if (this.enableStream) {
            requestEnd();
          }
          this.$nextTick(() => {
            this.showLastMsg();
          });
        },
        fail: (e) => {
          common_vendor.index.__f__("error", "at pages/index/index.vue:989", e);
          this.requestState = -100;
          common_vendor.index.showModal({
            content: JSON.stringify(e.message),
            showCancel: false
          });
          if (this.enableStream) {
            sseEnd();
          }
        }
      });
      uniCoTaskList.push(task);
    },
    closeSseChannel() {
      if (sseChannel) {
        sseChannel.close();
        sseChannel = false;
        this.sliceMsgToLastMsg.end();
      }
      uniCoTaskList.clear();
      this.sseIndex = 0;
    },
    // 滚动窗口以显示最新的一条消息
    showLastMsg() {
      this.$nextTick(() => {
        this.scrollIntoView = "last-msg-item";
        this.$nextTick(() => {
          this.scrollIntoView = "";
        });
      });
    },
    // 清空消息列表
    clearAllMsg(e) {
      common_vendor.index.showModal({
        title: "确认要清空聊天记录？",
        content: "本操作不可撤销",
        complete: (e2) => {
          if (e2.confirm) {
            this.closeSseChannel();
            this.msgList.splice(0, this.msgList.length);
          }
        }
      });
    },
    // 动画完成后的回调
    onAnimationComplete() {
      this.showZodiacAnimation = false;
      this.loadPageContent();
    },
    // 加载页面内容
    loadPageContent() {
      common_vendor.index.__f__("log", "at pages/index/index.vue:1058", "页面内容加载完成");
    },
    // 切换背景音乐
    toggleBackgroundMusic() {
      if (this.$refs.zodiacBackground) {
        this.$refs.zodiacBackground.toggleBackgroundMusic();
      }
    }
  }
};
if (!Array) {
  const _component_zodiac_animation = common_vendor.resolveComponent("zodiac-animation");
  const _component_zodiac_background = common_vendor.resolveComponent("zodiac-background");
  const _easycom_uni_ai_msg2 = common_vendor.resolveComponent("uni-ai-msg");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_link2 = common_vendor.resolveComponent("uni-link");
  (_component_zodiac_animation + _component_zodiac_background + _easycom_uni_ai_msg2 + _easycom_uni_icons2 + _easycom_uni_link2)();
}
const _easycom_uni_ai_msg = () => "../../components/uni-ai-msg/uni-ai-msg.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_link = () => "../../uni_modules/uni-link/components/uni-link/uni-link.js";
if (!Math) {
  (_easycom_uni_ai_msg + _easycom_uni_icons + _easycom_uni_link)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.showZodiacAnimation
  }, $data.showZodiacAnimation ? {
    b: common_vendor.o($options.onAnimationComplete),
    c: common_vendor.p({
      ["birth-month"]: $data.userInfo.birthMonth || 1,
      ["birth-day"]: $data.userInfo.birthDay || 1,
      ["animation-type"]: $data.animationType,
      duration: 7e3
    })
  } : {}, {
    d: common_vendor.sr("zodiacBackground", "013edfe2-1"),
    e: common_vendor.p({
      ["birth-month"]: $data.userInfo.birthMonth || 1,
      ["birth-day"]: $data.userInfo.birthDay || 1,
      ["show-symbols"]: true,
      ["show-particles"]: true,
      ["show-background-video"]: true,
      ["play-background-music"]: $data.bgMusicPlaying
    }),
    f: common_vendor.t($data.bgMusicPlaying ? "暂停" : "播放"),
    g: common_vendor.o((...args) => $options.toggleBackgroundMusic && $options.toggleBackgroundMusic(...args)),
    h: $data.msgList.length === 0
  }, $data.msgList.length === 0 ? {} : {}, {
    i: common_vendor.sr("msg", "013edfe2-2"),
    j: common_vendor.p({
      msg: $data.msgList[$data.msgList.length - 1]
    }),
    k: $data.msgList.length % 2 !== 0
  }, $data.msgList.length % 2 !== 0 ? common_vendor.e({
    l: $data.requestState == -100
  }, $data.requestState == -100 ? {
    m: common_vendor.o($options.send),
    n: common_vendor.p({
      color: "#d22",
      type: "refresh-filled"
    })
  } : $data.msgList.length ? common_vendor.e({
    p: $options.NODE_ENV == "development" && !$data.enableStream
  }, $options.NODE_ENV == "development" && !$data.enableStream ? {
    q: common_vendor.p({
      href: "https://uniapp.dcloud.net.cn/uniCloud/uni-ai-chat.html",
      text: "[流式响应]"
    })
  } : {}) : {}, {
    o: $data.msgList.length
  }) : {}, {
    r: $data.adpid
  }, $data.adpid ? {} : {}, {
    s: $data.sseIndex
  }, $data.sseIndex ? {
    t: common_vendor.o((...args) => $options.closeSseChannel && $options.closeSseChannel(...args))
  } : {}, {
    v: $data.scrollIntoView,
    w: $data.msgList.length && $data.msgList.length % 2 !== 0 ? "ai正在回复中不能发送" : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
