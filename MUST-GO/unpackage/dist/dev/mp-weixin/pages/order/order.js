"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_segmented_control2 = common_vendor.resolveComponent("uni-segmented-control");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_segmented_control2 + _easycom_uni_icons2)();
}
const _easycom_uni_segmented_control = () => "../../uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_segmented_control + _easycom_uni_icons)();
}
const _sfc_main = {
  __name: "order",
  setup(__props) {
    const currentTab = common_vendor.ref(0);
    const orderList = common_vendor.ref([]);
    const currentUserId = common_vendor.ref("");
    common_vendor.onShow(() => {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      currentUserId.value = userInfo && userInfo._id ? userInfo._id : "test_user_001";
      fetchOrders();
    });
    const onClickItem = (e) => {
      if (currentTab.value !== e.currentIndex) {
        currentTab.value = e.currentIndex;
        fetchOrders();
      }
    };
    const fetchOrders = async () => {
      common_vendor.index.showLoading({ title: "加载中..." });
      const db = common_vendor.wx$1.cloud.database();
      try {
        let query = {};
        if (currentTab.value === 0) {
          query = { passenger_id: currentUserId.value };
        } else {
          query = { driver_id: currentUserId.value };
        }
        const res = await db.collection("order_list").where(query).orderBy("create_time", "desc").get();
        orderList.value = res.data;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/order/order.vue:91", "获取订单失败:", e);
        common_vendor.index.showToast({ title: "获取数据失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const goDetail = (rideId) => {
      if (rideId) {
        common_vendor.index.navigateTo({ url: `/pages/ride-detail/ride-detail?id=${rideId}` });
      }
    };
    const formatTime = (timestamp) => {
      if (!timestamp)
        return "";
      const date = new Date(timestamp);
      const m = (date.getMonth() + 1).toString().padStart(2, "0");
      const d = date.getDate().toString().padStart(2, "0");
      const h = date.getHours().toString().padStart(2, "0");
      const min = date.getMinutes().toString().padStart(2, "0");
      return `${m}-${d} ${h}:${min}`;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(onClickItem, "90"),
        b: common_vendor.p({
          current: currentTab.value,
          values: ["我参与的 (乘客)", "我发布的 (车主)"],
          styleType: "text",
          activeColor: "#00C853"
        }),
        c: orderList.value.length === 0
      }, orderList.value.length === 0 ? {
        d: common_vendor.p({
          type: "list",
          size: "60",
          color: "#ccc"
        })
      } : {}, {
        e: common_vendor.f(orderList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(formatTime(item.create_time)),
            b: common_vendor.t(item.start),
            c: common_vendor.t(item.end),
            d: common_vendor.t(item.driver_name || "未知"),
            e: common_vendor.t(item.price),
            f: common_vendor.o(($event) => goDetail(item.ride_id), item._id),
            g: item._id
          };
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-93207a4f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/order.js.map
