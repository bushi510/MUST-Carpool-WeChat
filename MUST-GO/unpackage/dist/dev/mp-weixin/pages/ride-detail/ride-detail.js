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
    const currentId = common_vendor.ref("");
    const hasJoined = common_vendor.ref(false);
    common_vendor.onLoad((options) => {
      if (options.id) {
        currentId.value = options.id;
      }
    });
    common_vendor.onShow(async () => {
      if (!currentId.value)
        return;
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      const currentUserId = userInfo && userInfo._id ? userInfo._id : "test_user_001";
      try {
        const db = common_vendor.wx$1.cloud.database();
        const res = await db.collection("order_list").where({
          ride_id: currentId.value,
          passenger_id: currentUserId
        }).get();
        if (res.data.length > 0) {
          hasJoined.value = true;
        } else {
          hasJoined.value = false;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/ride-detail/ride-detail.vue:91", "检查订单状态失败:", e);
      }
    });
    const ride = common_vendor.computed(() => {
      return rideStore.rides.find((r) => r._id === currentId.value || r.id === currentId.value);
    });
    const markers = common_vendor.computed(() => {
      if (ride.value && ride.value.start_location) {
        return [{
          latitude: ride.value.start_location.lat,
          longitude: ride.value.start_location.lng,
          iconPath: "../../static/car.png",
          width: 32,
          height: 32
        }];
      }
      return [];
    });
    const goChat = () => common_vendor.index.navigateTo({ url: `/pages/chat/chat?rideId=${ride.value._id || ride.value.id}` });
    const goBack = () => common_vendor.index.switchTab({ url: "/pages/index/index" });
    const handleJoin = () => {
      if (!userStore.isLogged)
        return common_vendor.index.navigateTo({ url: "/pages/login/login" });
      const currentUserId = common_vendor.index.getStorageSync("userInfo")._id || "test_user_001";
      common_vendor.index.showModal({
        title: "模拟支付",
        content: `需支付 ￥${ride.value.price} 元，确认支付吗？`,
        success: async (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "处理中..." });
            try {
              const db = common_vendor.wx$1.cloud.database();
              await db.collection("order_list").add({
                data: {
                  ride_id: ride.value._id || ride.value.id,
                  // 关联的行程ID
                  passenger_id: currentUserId,
                  // 乘客（当前用户）ID
                  driver_name: ride.value.driver,
                  // 司机名字
                  start: ride.value.start,
                  // 出发地
                  end: ride.value.end,
                  // 目的地
                  price: ride.value.price,
                  // 价格
                  status: "completed",
                  // 订单状态（已完成）
                  create_time: Date.now()
                  // 下单时间
                }
              });
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: "预订成功" });
              setTimeout(() => common_vendor.index.navigateTo({ url: "/pages/order/order" }), 1500);
            } catch (e) {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: "预订失败", icon: "error" });
              common_vendor.index.__f__("error", "at pages/ride-detail/ride-detail.vue:156", "生成订单失败，请检查数据库设置:", e);
            }
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: ride.value
      }, ride.value ? common_vendor.e({
        b: ride.value && ride.value.start_location
      }, ride.value && ride.value.start_location ? {
        c: ride.value.start_location.lat,
        d: ride.value.start_location.lng,
        e: markers.value
      } : {}, {
        f: common_vendor.p({
          type: "person-filled",
          size: "40",
          color: "#fff"
        }),
        g: common_vendor.t(ride.value.driver),
        h: common_vendor.o(goChat, "dc"),
        i: common_vendor.p({
          type: "chat",
          size: "30",
          color: "var(--pc-primary)"
        }),
        j: common_vendor.t(ride.value.start),
        k: common_vendor.t(ride.value.end),
        l: common_vendor.t(ride.value.time),
        m: common_vendor.t(ride.value.seats),
        n: common_vendor.t(ride.value.price),
        o: hasJoined.value
      }, hasJoined.value ? {
        p: common_vendor.o(goChat, "ce")
      } : {
        q: common_vendor.t(ride.value.seats > 0 ? "确认预订并支付" : "座位已满"),
        r: ride.value.seats <= 0,
        s: common_vendor.o(handleJoin, "b6")
      }) : {
        t: common_vendor.p({
          type: "info-filled",
          size: "60",
          color: "#ccc"
        }),
        v: common_vendor.o(goBack, "f3")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f9af9e51"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/ride-detail/ride-detail.js.map
