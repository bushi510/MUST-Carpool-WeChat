"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_ride = require("../../stores/ride.js");
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  const _easycom_uni_transition2 = common_vendor.resolveComponent("uni-transition");
  (_easycom_uni_search_bar2 + _easycom_uni_icons2 + _easycom_uni_list_item2 + _easycom_uni_list2 + _easycom_uni_transition2)();
}
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_list_item = () => "../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_uni_list = () => "../../uni_modules/uni-list/components/uni-list/uni-list.js";
const _easycom_uni_transition = () => "../../uni_modules/uni-transition/components/uni-transition/uni-transition.js";
if (!Math) {
  (_easycom_uni_search_bar + _easycom_uni_icons + _easycom_uni_list_item + _easycom_uni_list + _easycom_uni_transition)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const rideStore = stores_ride.useRideStore();
    const currentLoc = common_vendor.ref({ lat: 22.543099, lng: 113.938036 });
    const markers = common_vendor.computed(() => {
      return rideStore.rides.map((r, index) => ({
        id: index,
        // 微信地图 marker 的 id 必须是数字
        rideId: r._id || r.id,
        // 自定义属性保存真实字符串 ID
        latitude: r.lat || 22.543099,
        longitude: r.lng || 113.938036,
        title: r.driver,
        iconPath: "../../static/car.png",
        width: 32,
        height: 32,
        callout: { content: ` ${r.start} ➔ ${r.end} `, color: "#fff", bgColor: "#00C853", padding: 8, borderRadius: 10, display: "ALWAYS" }
      }));
    });
    const onMarkerTap = (e) => {
      const markerId = e.detail.markerId;
      const targetMarker = markers.value.find((m) => m.id === markerId);
      if (targetMarker && targetMarker.rideId) {
        goDetail(targetMarker.rideId);
      }
    };
    const polyline = common_vendor.ref([{
      points: [{ latitude: 22.543099, longitude: 113.938036 }, { latitude: 22.55, longitude: 113.95 }],
      color: "#00C853",
      width: 6,
      arrowLine: true
    }]);
    common_vendor.onLoad(() => {
      getLocation();
    });
    common_vendor.onShow(() => {
      if (rideStore.fetchRides) {
        rideStore.fetchRides();
      }
    });
    common_vendor.onPullDownRefresh(() => {
      refreshData("下拉刷新成功");
    });
    const getLocation = () => {
      common_vendor.index.getLocation({
        type: "gcj02",
        success: (res) => {
          currentLoc.value = { lat: res.latitude, lng: res.longitude };
        },
        fail: () => {
          common_vendor.index.showToast({ title: "定位失败，使用默认位置", icon: "none", duration: 2e3 });
        }
      });
    };
    const refreshData = (msg = "已更新最新行程") => {
      common_vendor.index.showLoading({ title: "加载中..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.stopPullDownRefresh();
        common_vendor.index.showToast({ title: msg, icon: "success" });
      }, 800);
    };
    const goSearch = (e) => common_vendor.index.navigateTo({ url: `/pages/search/search?kw=${e.value}` });
    const goDetail = (id) => common_vendor.index.navigateTo({ url: `/pages/ride-detail/ride-detail?id=${id}` });
    const goPublish = () => common_vendor.index.navigateTo({ url: `/pages/publish/publish` });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goSearch, "b4"),
        b: common_vendor.p({
          placeholder: "你要去哪里？",
          radius: "100",
          bgColor: "var(--pc-card-bg)"
        }),
        c: currentLoc.value.lat,
        d: currentLoc.value.lng,
        e: markers.value,
        f: polyline.value,
        g: common_vendor.o(onMarkerTap, "4b"),
        h: common_vendor.o(onMarkerTap, "61"),
        i: common_vendor.o(refreshData, "d8"),
        j: common_vendor.p({
          type: "loop",
          size: "24",
          color: "var(--pc-primary)"
        }),
        k: common_vendor.f(common_vendor.unref(rideStore).rides.filter((r) => r.status === "recruiting"), (ride, index, i0) => {
          return {
            a: common_vendor.t(ride.start),
            b: common_vendor.t(ride.end),
            c: common_vendor.t(ride.time),
            d: common_vendor.t(ride.seats),
            e: common_vendor.t(ride.price),
            f: common_vendor.o(($event) => goDetail(ride._id || ride.id), ride._id || ride.id || index),
            g: ride._id || ride.id || index,
            h: common_vendor.o(($event) => goDetail(ride._id || ride.id), ride._id || ride.id || index),
            i: "1cf27b2a-4-" + i0 + ",1cf27b2a-3"
          };
        }),
        l: common_vendor.p({
          clickable: true
        }),
        m: common_vendor.p({
          border: false
        }),
        n: common_vendor.p({
          mode: "fade",
          show: true
        }),
        o: common_vendor.p({
          type: "plusempty",
          size: "30",
          color: "#fff"
        }),
        p: common_vendor.o(goPublish, "16")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
