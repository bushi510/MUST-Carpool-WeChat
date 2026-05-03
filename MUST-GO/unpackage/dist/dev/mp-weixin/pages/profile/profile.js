"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_tag2 = common_vendor.resolveComponent("uni-tag");
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  (_easycom_uni_icons2 + _easycom_uni_tag2 + _easycom_uni_list_item2 + _easycom_uni_list2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_tag = () => "../../uni_modules/uni-tag/components/uni-tag/uni-tag.js";
const _easycom_uni_list_item = () => "../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_uni_list = () => "../../uni_modules/uni-list/components/uni-list/uni-list.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_tag + _easycom_uni_list_item + _easycom_uni_list)();
}
const _sfc_main = {
  __name: "profile",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const checkLogin = () => {
      if (!userStore.isLogged)
        common_vendor.index.navigateTo({ url: "/pages/login/login" });
    };
    const navTo = (url) => {
      if (userStore.isLogged)
        common_vendor.index.navigateTo({ url });
      else
        checkLogin();
    };
    const handleLogout = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm)
            userStore.logout();
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "person-filled",
          size: "50",
          color: "#fff"
        }),
        b: common_vendor.t(common_vendor.unref(userStore).isLogged ? common_vendor.unref(userStore).userInfo.name : "点击登录"),
        c: common_vendor.unref(userStore).isLogged
      }, common_vendor.unref(userStore).isLogged ? {
        d: common_vendor.p({
          text: `信用分 ${common_vendor.unref(userStore).userInfo.creditScore}`,
          type: "success",
          size: "small",
          circle: true
        }),
        e: common_vendor.p({
          text: common_vendor.unref(userStore).userInfo.isCertified ? "已认证学生" : "未认证",
          type: common_vendor.unref(userStore).userInfo.isCertified ? "primary" : "default",
          size: "small",
          circle: true
        })
      } : {}, {
        f: common_vendor.o(checkLogin, "e0"),
        g: common_vendor.o(($event) => navTo("/pages/certify/certify"), "fa"),
        h: common_vendor.p({
          title: "学生认证",
          clickable: true,
          showArrow: true,
          showExtraIcon: true,
          extraIcon: {
            type: "vip",
            size: "22",
            color: "#00C853"
          }
        }),
        i: common_vendor.o(($event) => navTo("/pages/wallet/wallet"), "ec"),
        j: common_vendor.p({
          title: "我的钱包",
          clickable: true,
          showArrow: true,
          showExtraIcon: true,
          extraIcon: {
            type: "wallet",
            size: "22",
            color: "#00C853"
          },
          rightText: common_vendor.unref(userStore).isLogged && common_vendor.unref(userStore).userInfo.walletUploaded ? "已上传" : "未上传"
        }),
        k: common_vendor.o(($event) => navTo("/pages/service/service"), "45"),
        l: common_vendor.p({
          title: "联系客服",
          clickable: true,
          showArrow: true,
          showExtraIcon: true,
          extraIcon: {
            type: "headphones",
            size: "22",
            color: "#00C853"
          }
        }),
        m: common_vendor.p({
          border: false
        }),
        n: common_vendor.unref(userStore).isLogged
      }, common_vendor.unref(userStore).isLogged ? {
        o: common_vendor.o(handleLogout, "b7")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dd383ca2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
