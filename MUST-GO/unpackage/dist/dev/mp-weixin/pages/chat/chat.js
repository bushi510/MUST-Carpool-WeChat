"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
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
    const sending = common_vendor.ref(false);
    const isAI = common_vendor.ref(false);
    const msgs = common_vendor.ref([
      { id: 1, text: "你好，拼车还在吗？", isMe: true },
      { id: 2, text: "在的，随时可以预订", isMe: false }
    ]);
    common_vendor.onLoad((options) => {
      if (options.target === "kefu") {
        isAI.value = true;
        msgs.value = [{ id: Date.now(), text: "你好！我是 MUST-GO AI 智能客服，请问有什么可以帮助你？", isMe: false }];
        common_vendor.index.setNavigationBarTitle({ title: "AI 智能客服" });
      }
    });
    const scrollToBottom = () => {
      common_vendor.nextTick$1(() => {
        bottomId.value = "bottom-mark";
      });
    };
    const send = async () => {
      const text = inputVal.value.trim();
      if (!text || sending.value)
        return;
      msgs.value.push({ id: Date.now(), text, isMe: true });
      inputVal.value = "";
      scrollToBottom();
      if (!isAI.value)
        return;
      sending.value = true;
      const loadingId = Date.now() + 1;
      msgs.value.push({ id: loadingId, text: "", isMe: false, loading: true });
      scrollToBottom();
      try {
        const res = await utils_request.post("/api/chat", { question: text });
        const idx = msgs.value.findIndex((m) => m.id === loadingId);
        if (idx !== -1)
          msgs.value[idx] = { id: loadingId, text: res.reply, isMe: false };
      } catch (e) {
        const idx = msgs.value.findIndex((m) => m.id === loadingId);
        if (idx !== -1)
          msgs.value[idx] = { id: loadingId, text: "网络异常，请稍后重试", isMe: false };
      } finally {
        sending.value = false;
        scrollToBottom();
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: isAI.value
      }, isAI.value ? {
        b: common_vendor.p({
          type: "staff",
          size: "18",
          color: "#fff"
        })
      } : {}, {
        c: common_vendor.f(msgs.value, (msg, k0, i0) => {
          return common_vendor.e({
            a: msg.loading
          }, msg.loading ? {} : {
            b: common_vendor.t(msg.text)
          }, {
            c: msg.id,
            d: common_vendor.n(msg.isMe ? "me" : "other")
          });
        }),
<<<<<<< HEAD
        d: bottomId.value,
        e: common_vendor.o(($event) => inputVal.value = $event, "f9"),
        f: common_vendor.p({
=======
        b: bottomId.value,
        c: common_vendor.o(($event) => inputVal.value = $event, "c5"),
        d: common_vendor.p({
>>>>>>> a1ef7dfbcd9efe6773cb330a5155c84cc8fc7466
          placeholder: "发消息...",
          clearable: false,
          disabled: sending.value,
          modelValue: inputVal.value
        }),
<<<<<<< HEAD
        g: sending.value,
        h: common_vendor.o(send, "fd")
      });
=======
        e: common_vendor.o(send, "f3")
      };
>>>>>>> a1ef7dfbcd9efe6773cb330a5155c84cc8fc7466
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0a633310"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chat/chat.js.map
