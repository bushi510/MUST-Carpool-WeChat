"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_ride = require("../../stores/ride.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_number_box2 = common_vendor.resolveComponent("uni-number-box");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_forms_item2 + _easycom_uni_datetime_picker2 + _easycom_uni_number_box2 + _easycom_uni_easyinput2 + _easycom_uni_forms2)();
}
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_number_box = () => "../../uni_modules/uni-number-box/components/uni-number-box/uni-number-box.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_forms_item + _easycom_uni_datetime_picker + _easycom_uni_number_box + _easycom_uni_easyinput + _easycom_uni_forms)();
}
const _sfc_main = {
  __name: "publish",
  setup(__props) {
    const rideStore = stores_ride.useRideStore();
    const userStore = stores_user.useUserStore();
    const formRef = common_vendor.ref(null);
    const formData = common_vendor.ref({ start: "", end: "", time: "", seats: 1, price: "", lat: 22.54, lng: 113.93 });
    const rules = {
      start: { rules: [{ required: true, errorMessage: "请选择出发地" }] },
      end: { rules: [{ required: true, errorMessage: "请选择目的地" }] },
      time: { rules: [{ required: true, errorMessage: "请选择时间" }] },
      price: { rules: [{ required: true, errorMessage: "请填写金额" }] }
    };
    const pickLocation = (field) => {
      common_vendor.index.chooseLocation({
        success: (res) => {
          formData.value[field] = res.name;
          if (field === "start") {
            formData.value.lat = res.latitude;
            formData.value.lng = res.longitude;
          }
        }
      });
    };
    const submit = () => {
      if (!userStore.isLogged)
        return common_vendor.index.navigateTo({ url: "/pages/login/login" });
      if (!userStore.userInfo.isCertified)
        return common_vendor.index.showToast({ title: "请先完成车主认证", icon: "none" });
      formRef.value.validate().then(() => {
        common_vendor.index.showLoading({ title: "发布中" });
        setTimeout(() => {
          rideStore.publishRide(formData.value);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "发布成功" });
          setTimeout(() => common_vendor.index.switchTab({ url: "/pages/index/index" }), 1500);
        }, 1e3);
      }).catch(() => {
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(formData.value.start || "点击选择出发地"),
        b: common_vendor.o(($event) => pickLocation("start"), "32"),
        c: common_vendor.p({
          label: "出发地",
          name: "start",
          required: true
        }),
        d: common_vendor.t(formData.value.end || "点击选择目的地"),
        e: common_vendor.o(($event) => pickLocation("end"), "8b"),
        f: common_vendor.p({
          label: "目的地",
          name: "end",
          required: true
        }),
        g: common_vendor.o(($event) => formData.value.time = $event, "9f"),
        h: common_vendor.p({
          type: "datetime",
          modelValue: formData.value.time
        }),
        i: common_vendor.p({
          label: "出发时间",
          name: "time",
          required: true
        }),
        j: common_vendor.o(($event) => formData.value.seats = $event, "9f"),
        k: common_vendor.p({
          min: 1,
          max: 6,
          modelValue: formData.value.seats
        }),
        l: common_vendor.p({
          label: "提供座位数",
          name: "seats",
          required: true
        }),
        m: common_vendor.o(($event) => formData.value.price = $event, "a9"),
        n: common_vendor.p({
          type: "digit",
          placeholder: "输入金额",
          modelValue: formData.value.price
        }),
        o: common_vendor.p({
          label: "预期分摊(元/人)",
          name: "price",
          required: true
        }),
        p: common_vendor.sr(formRef, "bfce3555-0", {
          "k": "formRef"
        }),
        q: common_vendor.p({
          model: formData.value,
          rules,
          ["label-position"]: "top"
        }),
        r: common_vendor.o(submit, "6c")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bfce3555"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/publish/publish.js.map
