"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
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
    const userStore = stores_user.useUserStore();
    const tempImagePath = common_vendor.ref("");
    const cloudFileID = common_vendor.ref("");
    const hasOldRecord = common_vendor.ref(false);
    const isUploading = common_vendor.ref(false);
    const displayPath = common_vendor.computed(() => tempImagePath.value || cloudFileID.value);
    common_vendor.onMounted(async () => {
      const db = common_vendor.wx$1.cloud.database();
      try {
        const res = await db.collection("wallet_records").where({
          _openid: "{openid}"
          // 微信会自动识别当前用户
        }).get();
        if (res.data.length > 0) {
          cloudFileID.value = res.data[0].imageFileID;
          hasOldRecord.value = true;
          userStore.userInfo.walletUploaded = true;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/wallet/wallet.vue:47", "获取旧记录失败", e);
      }
    });
    const chooseImage = () => {
      common_vendor.index.chooseMedia({
        count: 1,
        mediaType: ["image"],
        success: (res) => {
          tempImagePath.value = res.tempFiles[0].tempFilePath;
        }
      });
    };
    const submitUpload = async () => {
      if (!tempImagePath.value)
        return;
      isUploading.value = true;
      common_vendor.index.showLoading({ title: "正在同步至云端..." });
      try {
        const cloudPath = `wallet/${Date.now()}-${Math.floor(Math.random() * 1e3)}.png`;
        const uploadRes = await common_vendor.wx$1.cloud.uploadFile({
          cloudPath,
          filePath: tempImagePath.value
        });
        const db = common_vendor.wx$1.cloud.database();
        const newFileID = uploadRes.fileID;
        if (hasOldRecord.value) {
          await common_vendor.wx$1.cloud.callFunction({
            name: "quickstartFunctions",
            // 如果没写云函数，可直接用 db 操作，但权限需设为所有人可读写
            data: { type: "updateWallet", fileID: newFileID }
          }).catch(async () => {
            const record = await db.collection("wallet_records").where({ _openid: "{openid}" }).get();
            await db.collection("wallet_records").doc(record.data[0]._id).update({
              data: { imageFileID: newFileID, updateTime: /* @__PURE__ */ new Date() }
            });
          });
        } else {
          await db.collection("wallet_records").add({
            data: { imageFileID: newFileID, uploadTime: /* @__PURE__ */ new Date() }
          });
        }
        userStore.userInfo.walletUploaded = true;
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "保存成功" });
        setTimeout(() => common_vendor.index.navigateBack(), 1500);
      } catch (err) {
        common_vendor.index.hideLoading();
        isUploading.value = false;
        common_vendor.index.__f__("error", "at pages/wallet/wallet.vue:107", "操作失败", err);
        common_vendor.index.showModal({ title: "保存失败", content: "请重试", showCancel: false });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: displayPath.value
      }, displayPath.value ? {
        b: displayPath.value
      } : {
        c: common_vendor.p({
          type: "camera-filled",
          size: "50",
          color: "#c0c4cc"
        })
      }, {
        d: common_vendor.o(chooseImage, "b2"),
        e: common_vendor.t(isUploading.value ? "处理中..." : hasOldRecord.value ? "更新图片" : "确认上传"),
        f: common_vendor.o(submitUpload, "30"),
        g: !tempImagePath.value || isUploading.value
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4c380209"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/wallet/wallet.js.map
