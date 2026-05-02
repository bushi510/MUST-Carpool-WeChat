"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_data_checkbox2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_checkbox = () => "../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_data_checkbox + _easycom_uni_forms)();
}
const _sfc_main = {
  __name: "certify",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const formRef = common_vendor.ref(null);
    const genderOptions = [
      { text: "男", value: "男" },
      { text: "女", value: "女" }
    ];
    const formData = common_vendor.ref({
      name: "",
      studentId: "",
      gender: "男"
    });
    const rules = common_vendor.ref({
      name: { rules: [{ required: true, errorMessage: "姓名不能为空" }] },
      studentId: { rules: [{ required: true, errorMessage: "学号不能为空" }] },
      gender: { rules: [{ required: true, errorMessage: "请选择性别" }] }
    });
    const submitCertify = () => {
      if (!formRef.value)
        return;
      formRef.value.validate().then(async () => {
        common_vendor.index.showLoading({ title: "正在存入云端..." });
        try {
          const db = common_vendor.wx$1.cloud.database({
            env: "cloudbase-d8gs0x2y67fedcaef"
          });
          await db.collection("users").add({
            data: {
              realName: formData.value.name,
              studentId: formData.value.studentId,
              gender: formData.value.gender,
              isCertified: true,
              certifyTime: /* @__PURE__ */ new Date()
            }
          });
          userStore.certify({
            name: formData.value.name,
            studentId: formData.value.studentId,
            gender: formData.value.gender
          });
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "认证成功", icon: "success" });
          setTimeout(() => common_vendor.index.navigateBack(), 1500);
        } catch (e) {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/certify/certify.vue:86", "云端保存失败：", e);
          common_vendor.index.showModal({ title: "上云失败", content: "网络异常或数据库权限错误", showCancel: false });
        }
      }).catch(() => {
        common_vendor.index.showToast({ title: "请填写完整信息", icon: "none" });
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => formData.value.name = $event, "74"),
        b: common_vendor.p({
          placeholder: "请输入姓名",
          modelValue: formData.value.name
        }),
        c: common_vendor.p({
          label: "真实姓名",
          name: "name",
          required: true
        }),
        d: common_vendor.o(($event) => formData.value.studentId = $event, "03"),
        e: common_vendor.p({
          placeholder: "请输入M.U.S.T.学号",
          modelValue: formData.value.studentId
        }),
        f: common_vendor.p({
          label: "学号",
          name: "studentId",
          required: true
        }),
        g: common_vendor.o(($event) => formData.value.gender = $event, "58"),
        h: common_vendor.p({
          localdata: genderOptions,
          modelValue: formData.value.gender
        }),
        i: common_vendor.p({
          label: "性别",
          name: "gender",
          required: true
        }),
        j: common_vendor.sr(formRef, "b6583933-0", {
          "k": "formRef"
        }),
        k: common_vendor.p({
          model: formData.value,
          rules: rules.value,
          ["label-width"]: "80"
        }),
        l: common_vendor.t(common_vendor.unref(userStore).userInfo.isCertified ? "已通过认证" : "提交认证"),
        m: common_vendor.o(submitCertify, "ab"),
        n: common_vendor.unref(userStore).userInfo.isCertified
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b6583933"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/certify/certify.js.map
