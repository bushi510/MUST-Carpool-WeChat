"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const stores_user = require("./stores/user.js");
const stores_ride = require("./stores/ride.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/login/login.js";
  "./pages/publish/publish.js";
  "./pages/profile/profile.js";
  "./pages/search/search.js";
  "./pages/ride-detail/ride-detail.js";
  "./pages/order/order.js";
  "./pages/chat/chat.js";
  "./pages/certify/certify.js";
  "./pages/wallet/wallet.js";
  "./pages/service/service.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(() => {
      const userStore = stores_user.useUserStore();
      const rideStore = stores_ride.useRideStore();
      userStore.init();
      rideStore.init();
      if (!common_vendor.wx$1.cloud) {
        common_vendor.index.__f__(
          "error",
          "at App.vue:15",
          "请使用 2.2.3 或以上的基础库以使用云能力"
        );
      } else {
        common_vendor.wx$1.cloud.init({
          env: "cloudbase-d8gs0x2y67fedcaef",
          traceUser: true
        });
      }
    });
    return () => {
    };
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(common_vendor.createPinia());
  return { app, Pinia: common_vendor.Pinia };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
