"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_ride = require("../../stores/ride.js");
if (!Array) {
  const _easycom_uni_tag2 = common_vendor.resolveComponent("uni-tag");
  const _easycom_uni_transition2 = common_vendor.resolveComponent("uni-transition");
  (_easycom_uni_tag2 + _easycom_uni_transition2)();
}
const _easycom_uni_tag = () => "../../uni_modules/uni-tag/components/uni-tag/uni-tag.js";
const _easycom_uni_transition = () => "../../uni_modules/uni-transition/components/uni-transition/uni-transition.js";
if (!Math) {
  (_easycom_uni_tag + _easycom_uni_transition)();
}
const _sfc_main = {
  __name: "order",
  setup(__props) {
    const rideStore = stores_ride.useRideStore();
    common_vendor.onShow(() => {
    });
    const goDetail = (id) => common_vendor.index.navigateTo({ url: `/pages/detail/detail?id=${id}` });
    const goChat = () => common_vendor.index.navigateTo({ url: "/pages/chat/chat" });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(rideStore).userOrders.length === 0
      }, common_vendor.unref(rideStore).userOrders.length === 0 ? {} : {}, {
        b: common_vendor.f(common_vendor.unref(rideStore).userOrders, (order, index, i0) => {
          return {
            a: common_vendor.t(order.time),
            b: "93207a4f-1-" + i0 + "," + ("93207a4f-0-" + i0),
            c: common_vendor.p({
              text: order.orderStatus,
              type: order.orderStatus === "进行中" ? "primary" : "success",
              size: "small",
              inverted: true
            }),
            d: common_vendor.t(order.start),
            e: common_vendor.t(order.end),
            f: common_vendor.t(order.price),
            g: common_vendor.o(($event) => goDetail(order.id), order.orderId),
            h: common_vendor.t(order.role === "driver" ? "车主" : "乘客"),
            i: common_vendor.o(goChat, order.orderId),
            j: "93207a4f-0-" + i0,
            k: common_vendor.p({
              mode: "fade,slide-bottom",
              show: true,
              duration: 300,
              delay: index * 100
            }),
            l: order.orderId
          };
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-93207a4f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/order.js.map
