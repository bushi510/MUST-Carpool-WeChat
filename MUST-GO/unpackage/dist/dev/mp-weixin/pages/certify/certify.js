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
  __name: "certify",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const formRef = common_vendor.ref(null);
    const formData = common_vendor.ref({ name: "", plate: "", carType: "" });
    const rules = {
      name: { rules: [{ required: true, errorMessage: "姓名不能为空" }] },
      plate: { rules: [{ required: true, errorMessage: "车牌不能为空" }] }
    };
    const submitCertify = () => {
      formRef.value.validate().then(() => {
        common_vendor.index.showLoading({ title: "审核中" });
        setTimeout(() => {
          userStore.certify();
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "认证成功，信用分+5" });
          setTimeout(() => common_vendor.index.navigateBack(), 1500);
        }, 1500);
      }).catch(() => {
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => formData.value.name = $event, "48"),
        b: common_vendor.p({
          placeholder: "请输入姓名",
          modelValue: formData.value.name
        }),
        c: common_vendor.p({
          label: "真实姓名",
          name: "name",
          required: true
        }),
        d: common_vendor.o(($event) => formData.value.plate = $event, "e4"),
        e: common_vendor.p({
          placeholder: "例: 粤B12345",
          modelValue: formData.value.plate
        }),
        f: common_vendor.p({
          label: "车牌号码",
          name: "plate",
          required: true
        }),
        g: common_vendor.o(($event) => formData.value.carType = $event, "d6"),
        h: common_vendor.p({
          placeholder: "例: 丰田卡罗拉 白色",
          modelValue: formData.value.carType
        }),
        i: common_vendor.p({
          label: "车辆型号",
          name: "carType",
          required: true
        }),
        j: common_vendor.sr(formRef, "b6583933-0", {
          "k": "formRef"
        }),
        k: common_vendor.p({
          model: formData.value,
          rules,
          ["label-width"]: "80"
        }),
        l: common_vendor.t(common_vendor.unref(userStore).userInfo.isCertified ? "已通过认证" : "提交认证"),
        m: common_vendor.o(submitCertify, "e9"),
        n: common_vendor.unref(userStore).userInfo.isCertified
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b6583933"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/certify/certify.js.map
