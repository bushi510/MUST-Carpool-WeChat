"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_ride = require("../../stores/ride.js");
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  const _easycom_uni_transition2 = common_vendor.resolveComponent("uni-transition");
  (_easycom_uni_search_bar2 + _easycom_uni_list_item2 + _easycom_uni_list2 + _easycom_uni_transition2)();
}
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_list_item = () => "../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_uni_list = () => "../../uni_modules/uni-list/components/uni-list/uni-list.js";
const _easycom_uni_transition = () => "../../uni_modules/uni-transition/components/uni-transition/uni-transition.js";
if (!Math) {
  (_easycom_uni_search_bar + _easycom_uni_list_item + _easycom_uni_list + _easycom_uni_transition)();
}
const _sfc_main = {
  __name: "search",
  setup(__props) {
    const keyword = common_vendor.ref("");
    const isSearched = common_vendor.ref(false);
    const results = common_vendor.ref([]);
    const rideStore = stores_ride.useRideStore();
    common_vendor.onLoad((opts) => {
      if (opts.kw) {
        keyword.value = opts.kw;
        doSearch();
      }
    });
    const doSearch = () => {
      if (!keyword.value)
        return;
      common_vendor.index.showLoading({ title: "搜索中" });
      setTimeout(() => {
        results.value = rideStore.rides.filter((r) => r.end.includes(keyword.value));
        isSearched.value = true;
        common_vendor.index.hideLoading();
      }, 500);
    };
    const goDetail = (id) => common_vendor.index.navigateTo({ url: `/pages/detail/detail?id=${id}` });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(doSearch, "93"),
        b: common_vendor.o(($event) => keyword.value = $event, "dd"),
        c: common_vendor.p({
          placeholder: "搜索目的地",
          modelValue: keyword.value
        }),
        d: results.value.length > 0
      }, results.value.length > 0 ? {
        e: common_vendor.f(results.value, (item, k0, i0) => {
          return {
            a: item.id,
            b: common_vendor.o(($event) => goDetail(item.id), item.id),
            c: "c10c040c-3-" + i0 + ",c10c040c-2",
            d: common_vendor.p({
              title: item.end,
              note: `${item.time}出发 | ￥${item.price}`,
              clickable: true
            })
          };
        }),
        f: common_vendor.p({
          border: false
        })
      } : isSearched.value && results.value.length === 0 ? {} : {}, {
        g: isSearched.value && results.value.length === 0,
        h: common_vendor.p({
          mode: "slide-bottom",
          show: isSearched.value
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c10c040c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/search/search.js.map
