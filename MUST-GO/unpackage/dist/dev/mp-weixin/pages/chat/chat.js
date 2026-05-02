"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  (_easycom_uni_icons2 + _easycom_uni_easyinput2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_easyinput)();
}
const _sfc_main = {
  __name: "chat",
  setup(__props) {
    const inputVal = common_vendor.ref("");
    const bottomId = common_vendor.ref("");
    const currentRideId = common_vendor.ref(null);
    const msgs = common_vendor.ref([]);
    const currentUserId = common_vendor.ref("");
    let watcher = null;
    common_vendor.onLoad((options) => {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      currentUserId.value = userInfo && userInfo._id ? userInfo._id : "test_user_001";
      if (options.rideId) {
        currentRideId.value = options.rideId;
        startWatch();
      } else {
        common_vendor.index.showToast({ title: "缺少行程参数", icon: "none" });
      }
    });
    common_vendor.onUnload(() => {
      if (watcher)
        watcher.close();
    });
    const startWatch = () => {
      const db = common_vendor.wx$1.cloud.database();
      watcher = db.collection("chat_messages").where({
        ride_id: currentRideId.value
      }).orderBy("create_time", "asc").watch({
        onChange: (snapshot) => {
          const newMsgs = snapshot.docs.map((doc) => {
            return {
              id: doc._id,
              text: doc.content,
              isMe: doc.sender_id === currentUserId.value
            };
          });
          msgs.value = [
            { id: "sys", text: "大家可以在这里沟通上车地点", isMe: false },
            ...newMsgs
          ];
          scrollToBottom();
        },
        onError: (err) => {
          common_vendor.index.__f__("error", "at pages/chat/chat.vue:91", "监听失败:", err);
        }
      });
    };
    const scrollToBottom = () => {
      common_vendor.nextTick$1(() => {
        bottomId.value = "";
        setTimeout(() => {
          bottomId.value = "bottom-mark";
        }, 100);
      });
    };
    const send = async () => {
      if (!inputVal.value.trim())
        return;
      const textToSend = inputVal.value;
      inputVal.value = "";
      try {
        const db = common_vendor.wx$1.cloud.database();
        await db.collection("chat_messages").add({
          data: {
            ride_id: currentRideId.value,
            sender_id: currentUserId.value,
            content: textToSend,
            create_time: Date.now()
          }
        });
      } catch (e) {
        common_vendor.index.showToast({ title: "发送失败", icon: "none" });
        inputVal.value = textToSend;
        common_vendor.index.__f__("error", "at pages/chat/chat.vue:123", "发送错误:", e);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: currentRideId.value
      }, currentRideId.value ? {
        b: common_vendor.t(currentRideId.value)
      } : {}, {
        c: common_vendor.f(msgs.value, (msg, k0, i0) => {
          return common_vendor.e({
            a: !msg.isMe
          }, !msg.isMe ? {
            b: "0a633310-0-" + i0,
            c: common_vendor.p({
              type: "person-filled",
              size: "24",
              color: "#fff"
            })
          } : {}, {
            d: !msg.isMe
          }, !msg.isMe ? {} : {}, {
            e: common_vendor.t(msg.text),
            f: msg.isMe
          }, msg.isMe ? {
            g: "0a633310-1-" + i0,
            h: common_vendor.p({
              type: "person-filled",
              size: "24",
              color: "#fff"
            })
          } : {}, {
            i: msg.id,
            j: common_vendor.n(msg.isMe ? "me" : "other")
          });
        }),
        d: bottomId.value,
        e: common_vendor.o(($event) => inputVal.value = $event, "b0"),
        f: common_vendor.p({
          placeholder: "发消息...",
          clearable: false,
          inputBorder: false,
          modelValue: inputVal.value
        }),
        g: common_vendor.o(send, "97")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0a633310"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chat/chat.js.map
