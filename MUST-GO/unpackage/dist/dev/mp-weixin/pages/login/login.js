"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_forms)();
}
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const formRef = common_vendor.ref(null);
    const formData = common_vendor.ref({ phone: "13800138000", code: "" });
    const rules = {
      phone: { rules: [{ required: true, errorMessage: "手机号不能为空" }, { pattern: "^1[3-9]\\d{9}$", errorMessage: "格式不正确" }] },
      code: { rules: [{ required: true, errorMessage: "验证码不能为空" }] }
    };
    const sendCode = () => common_vendor.index.showToast({ title: "验证码 1234 已发送", icon: "none" });
    const handleLogin = () => {
      formRef.value.validate().then(() => {
        common_vendor.index.showLoading({ title: "登录中" });
        userStore.login(formData.value.phone, formData.value.code).then(() => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "登录成功" });
          setTimeout(() => common_vendor.index.switchTab({ url: "/pages/index/index" }), 1e3);
        }).catch((err) => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: err, icon: "none" });
        });
      }).catch(() => {
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => formData.value.phone = $event, "5e"),
        b: common_vendor.p({
          type: "number",
          placeholder: "请输入手机号",
          prefixIcon: "person",
          modelValue: formData.value.phone
        }),
        c: common_vendor.p({
          name: "phone"
        }),
        d: common_vendor.o(($event) => formData.value.code = $event, "77"),
        e: common_vendor.p({
          type: "number",
          placeholder: "验证码(1234)",
          prefixIcon: "locked",
          modelValue: formData.value.code
        }),
        f: common_vendor.o(sendCode, "7d"),
        g: common_vendor.p({
          name: "code"
        }),
        h: common_vendor.sr(formRef, "e4e4508d-0", {
          "k": "formRef"
        }),
        i: common_vendor.p({
          model: formData.value,
          rules
        }),
        j: common_vendor.o(handleLogin, "2a")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
