"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_ride = require("../../stores/ride.js");
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
  __name: "ride-detail",
  setup(__props) {
    const rideStore = stores_ride.useRideStore();
    const userStore = stores_user.useUserStore();
    const ride = common_vendor.ref(null);
    const markers = common_vendor.computed(() => ride.value ? [{
      latitude: ride.value.lat,
      longitude: ride.value.lng,
      iconPath: "../../static/car.png",
      width: 32,
      height: 32
    }] : []);
    common_vendor.onLoad((options) => {
      if (options.id) {
        ride.value = rideStore.rides.find((r) => r.id === Number(options.id));
      }
    });
    const goChat = () => common_vendor.index.navigateTo({ url: "/pages/chat/chat" });
    const goBack = () => common_vendor.index.switchTab({ url: "/pages/index/index" });
    const handleJoin = () => {
      if (!userStore.isLogged)
        return common_vendor.index.navigateTo({ url: "/pages/login/login" });
      common_vendor.index.showModal({
        title: "模拟支付",
        content: `需支付 ￥${ride.value.price} 元，确认支付吗？`,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "支付中" });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              const success = rideStore.joinRide(ride.value.id);
              if (success) {
                common_vendor.index.showToast({ title: "预订成功" });
                setTimeout(() => common_vendor.index.switchTab({ url: "/pages/order/order" }), 1500);
              } else {
                common_vendor.index.showToast({ title: "预订失败", icon: "error" });
              }
            }, 1500);
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: ride.value
      }, ride.value ? {
        b: ride.value.lat,
        c: ride.value.lng,
        d: markers.value,
        e: common_vendor.p({
          type: "person-filled",
          size: "40",
          color: "#fff"
        }),
        f: common_vendor.t(ride.value.driver),
        g: common_vendor.o(goChat, "66"),
        h: common_vendor.p({
          type: "chat",
          size: "30",
          color: "var(--pc-primary)"
        }),
        i: common_vendor.t(ride.value.start),
        j: common_vendor.t(ride.value.end),
        k: common_vendor.t(ride.value.time),
        l: common_vendor.t(ride.value.seats),
        m: common_vendor.t(ride.value.price),
        n: common_vendor.t(ride.value.seats > 0 ? "确认预订并支付" : "座位已满"),
        o: ride.value.seats <= 0,
        p: common_vendor.o(handleJoin, "23")
      } : {
        q: common_vendor.p({
          type: "info-filled",
          size: "60",
          color: "#ccc"
        }),
        r: common_vendor.o(goBack, "6f")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f9af9e51"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/ride-detail/ride-detail.js.map
