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
    const isSubmitting = common_vendor.ref(false);
    const formData = common_vendor.reactive({
      start: "",
      end: "",
      time: "",
      seats: 1,
      price: "",
      start_location: { lat: null, lng: null, address: "" },
      end_location: { lat: null, lng: null, address: "" }
    });
    const rules = {
      start: { rules: [{ required: true, errorMessage: "请选择出发地" }] },
      end: { rules: [{ required: true, errorMessage: "请选择目的地" }] },
      time: {
        rules: [
          { required: true, errorMessage: "请选择时间" },
          // 优化2：功能逻辑校验，禁止发布过去的时间
          { validateFunction: (rule, value, data, callback) => {
            if (new Date(value).getTime() < Date.now())
              callback("出发时间不能早于当前时间");
            return true;
          } }
        ]
      },
      price: {
        rules: [
          { required: true, errorMessage: "请填写金额" },
          { validateFunction: (rule, value, data, callback) => {
            if (parseFloat(value) <= 0)
              callback("金额必须大于0");
            return true;
          } }
        ]
      }
    };
    const pickLocation = (field) => {
      common_vendor.index.chooseLocation({
        success: (res) => {
          formData[field] = res.name;
          formData[`${field}_location`] = {
            lat: res.latitude,
            lng: res.longitude,
            address: res.address
          };
        },
        fail: (err) => {
          if (err.errMsg.includes("auth deny")) {
            common_vendor.index.showModal({
              title: "提示",
              content: "请在设置中开启定位权限以选择地点",
              success: (res) => {
                if (res.confirm)
                  common_vendor.index.openSetting();
              }
            });
          }
        }
      });
    };
    const submit = async () => {
      if (isSubmitting.value)
        return;
      if (!userStore.isLogged)
        return common_vendor.index.navigateTo({ url: "/pages/login/login" });
      if (!userStore.userInfo.isCertified)
        return common_vendor.index.showToast({ title: "请先完成车主认证", icon: "none" });
      try {
        await formRef.value.validate();
        isSubmitting.value = true;
        common_vendor.index.showLoading({ title: "发布中", mask: true });
        const success = await rideStore.publishRide({ ...formData });
        common_vendor.index.hideLoading();
        if (success) {
          common_vendor.index.showToast({ title: "发布成功", icon: "success" });
          setTimeout(() => {
            isSubmitting.value = false;
            common_vendor.index.switchTab({ url: "/pages/index/index" });
          }, 1500);
        }
      } catch (error) {
        isSubmitting.value = false;
        common_vendor.index.__f__("error", "at pages/publish/publish.vue:121", "校验失败:", error);
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(formData.start || "点击选择出发地"),
        b: common_vendor.o(($event) => pickLocation("start"), "32"),
        c: common_vendor.p({
          label: "出发地",
          name: "start",
          required: true
        }),
        d: common_vendor.t(formData.end || "点击选择目的地"),
        e: common_vendor.o(($event) => pickLocation("end"), "8b"),
        f: common_vendor.p({
          label: "目的地",
          name: "end",
          required: true
        }),
        g: common_vendor.o(($event) => formData.time = $event, "3e"),
        h: common_vendor.p({
          type: "datetime",
          modelValue: formData.time
        }),
        i: common_vendor.p({
          label: "出发时间",
          name: "time",
          required: true
        }),
        j: common_vendor.o(($event) => formData.seats = $event, "dd"),
        k: common_vendor.p({
          min: 1,
          max: 6,
          modelValue: formData.seats
        }),
        l: common_vendor.p({
          label: "提供座位数",
          name: "seats",
          required: true
        }),
        m: common_vendor.o(($event) => formData.price = $event, "3c"),
        n: common_vendor.p({
          type: "digit",
          placeholder: "输入金额",
          modelValue: formData.price
        }),
        o: common_vendor.p({
          label: "预期分摊(元/人)",
          name: "price",
          required: true
        }),
        p: common_vendor.sr(formRef, "60f4255c-0", {
          "k": "formRef"
        }),
        q: common_vendor.p({
          model: formData,
          rules,
          ["label-position"]: "top"
        }),
        r: common_vendor.o(submit, "6c")
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/publish/publish.js.map
