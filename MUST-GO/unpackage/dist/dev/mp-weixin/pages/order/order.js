"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_tag2 = common_vendor.resolveComponent("uni-tag");
  const _easycom_uni_transition2 = common_vendor.resolveComponent("uni-transition");
  (_easycom_uni_icons2 + _easycom_uni_tag2 + _easycom_uni_transition2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_tag = () => "../../uni_modules/uni-tag/components/uni-tag/uni-tag.js";
const _easycom_uni_transition = () => "../../uni_modules/uni-transition/components/uni-transition/uni-transition.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_tag + _easycom_uni_transition)();
}
const _sfc_main = {
  __name: "order",
  setup(__props) {
    const orderList = common_vendor.ref([]);
    common_vendor.onShow(async () => {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      const currentUserId = userInfo && userInfo._id ? userInfo._id : "test_user_001";
      common_vendor.index.showLoading({ title: "加载订单..." });
      try {
        const db = common_vendor.wx$1.cloud.database();
        const res = await db.collection("order_list").where({ passenger_id: currentUserId }).orderBy("create_time", "desc").get();
        orderList.value = res.data;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/order/order.vue:75", "获取云端订单失败:", e);
      } finally {
        common_vendor.index.hideLoading();
      }
    });
    const goDetail = (rideId) => common_vendor.index.navigateTo({ url: `/pages/ride-detail/ride-detail?id=${rideId}` });
    const goChat = (rideId) => common_vendor.index.navigateTo({ url: `/pages/chat/chat?rideId=${rideId}` });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: orderList.value.length === 0
      }, orderList.value.length === 0 ? {} : {}, {
        b: common_vendor.f(orderList.value, (order, index, i0) => {
          return {
            a: "93207a4f-1-" + i0 + "," + ("93207a4f-0-" + i0),
            b: common_vendor.t(order.time ? order.time + " 出发" : "行程预约"),
            c: "93207a4f-2-" + i0 + "," + ("93207a4f-0-" + i0),
            d: common_vendor.t(order.start),
            e: common_vendor.t(order.end),
            f: common_vendor.o(($event) => goDetail(order.ride_id), order._id),
            g: common_vendor.t(order.price),
            h: common_vendor.o(($event) => goChat(order.ride_id), order._id),
            i: "93207a4f-0-" + i0,
            j: common_vendor.p({
              mode: "fade,slide-bottom",
              show: true,
              duration: 300,
              delay: index * 100
            }),
            k: order._id
          };
        }),
        c: common_vendor.p({
          type: "shop",
          size: "16",
          color: "#888"
        }),
        d: common_vendor.p({
          text: "已支付",
          size: "small",
          ["custom-style"]: "background-color: #E8F5E9; border-color: #E8F5E9; color: #00C853;"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-93207a4f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/order.js.map
