"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_collapse_item2 = common_vendor.resolveComponent("uni-collapse-item");
  const _easycom_uni_collapse2 = common_vendor.resolveComponent("uni-collapse");
  (_easycom_uni_icons2 + _easycom_uni_collapse_item2 + _easycom_uni_collapse2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_collapse_item = () => "../../uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.js";
const _easycom_uni_collapse = () => "../../uni_modules/uni-collapse/components/uni-collapse/uni-collapse.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_collapse_item + _easycom_uni_collapse)();
}
const _sfc_main = {
  __name: "service",
  setup(__props) {
    const goOnlineSupport = () => {
      common_vendor.index.navigateTo({ url: "/pages/chat/chat?target=kefu" });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "headphones",
          size: "50",
          color: "var(--pc-primary)"
        }),
        b: common_vendor.o(goOnlineSupport, "bc"),
        c: common_vendor.p({
          title: "如何发布拼车行程？"
        }),
        d: common_vendor.p({
          title: "车主认证需要多久？"
        }),
        e: common_vendor.p({
          title: "如何取消已预订的行程？"
        }),
        f: common_vendor.p({
          accordion: true
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cb2df937"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/service/service.js.map
