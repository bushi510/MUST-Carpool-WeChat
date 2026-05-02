"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "wallet",
  setup(__props) {
    const handleAction = (type) => {
      common_vendor.index.showToast({ title: `${type}功能开发中`, icon: "none" });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => handleAction("充值"), "f2"),
        b: common_vendor.o(($event) => handleAction("提现"), "85"),
        c: common_vendor.p({
          type: "wallet",
          size: "50",
          color: "#ccc"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4c380209"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/wallet/wallet.js.map
