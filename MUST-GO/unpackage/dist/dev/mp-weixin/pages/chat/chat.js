"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  _easycom_uni_easyinput2();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
if (!Math) {
  _easycom_uni_easyinput();
}
const _sfc_main = {
  __name: "chat",
  setup(__props) {
    const inputVal = common_vendor.ref("");
    const bottomId = common_vendor.ref("");
    const msgs = common_vendor.ref([
      { id: 1, text: "你好，拼车还在吗？", isMe: true },
      { id: 2, text: "在的，随时可以预订", isMe: false }
    ]);
    const send = () => {
      if (!inputVal.value.trim())
        return;
      msgs.value.push({ id: Date.now(), text: inputVal.value, isMe: true });
      inputVal.value = "";
      common_vendor.nextTick$1(() => {
        bottomId.value = "bottom-mark";
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(msgs.value, (msg, k0, i0) => {
          return {
            a: common_vendor.t(msg.text),
            b: msg.id,
            c: common_vendor.n(msg.isMe ? "me" : "other")
          };
        }),
        b: bottomId.value,
        c: common_vendor.o(($event) => inputVal.value = $event, "d6"),
        d: common_vendor.p({
          placeholder: "发消息...",
          clearable: false,
          modelValue: inputVal.value
        }),
        e: common_vendor.o(send, "d4")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0a633310"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chat/chat.js.map
