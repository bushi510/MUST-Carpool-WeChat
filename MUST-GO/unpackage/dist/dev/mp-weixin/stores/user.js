"use strict";
const common_vendor = require("../common/vendor.js");
const useUserStore = common_vendor.defineStore("user", () => {
  const userInfo = common_vendor.ref({
    name: "",
    phone: "",
    avatar: "",
    creditScore: 0,
    isCertified: false,
    studentId: "",
    gender: ""
  });
  const isLogged = common_vendor.ref(false);
  const init = () => {
    const stored = common_vendor.index.getStorageSync("pc_user");
    if (stored) {
      userInfo.value = stored.userInfo;
      isLogged.value = stored.isLogged;
    }
  };
  common_vendor.watch([userInfo, isLogged], () => {
    common_vendor.index.setStorageSync("pc_user", { userInfo: userInfo.value, isLogged: isLogged.value });
  }, { deep: true });
  const login = async (phone, code) => {
    return new Promise((resolve, reject) => {
      if (code !== "1234")
        return reject("验证码错误(填1234)");
      userInfo.value = {
        name: "拼车达人",
        phone,
        avatar: "/static/default-avatar.png",
        creditScore: 95,
        isCertified: false,
        studentId: "",
        gender: ""
      };
      isLogged.value = true;
      resolve("登录成功");
    });
  };
  const logout = () => {
    userInfo.value = {
      name: "",
      phone: "",
      avatar: "",
      creditScore: 0,
      isCertified: false,
      studentId: "",
      gender: ""
    };
    isLogged.value = false;
    common_vendor.index.removeStorageSync("pc_user");
  };
  const certify = (data) => {
    userInfo.value.isCertified = true;
    userInfo.value.creditScore += 5;
    if (data) {
      userInfo.value.name = data.name || userInfo.value.name;
      userInfo.value.studentId = data.studentId || "";
      userInfo.value.gender = data.gender || "";
    }
  };
  return { userInfo, isLogged, init, login, logout, certify };
});
exports.useUserStore = useUserStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/user.js.map
