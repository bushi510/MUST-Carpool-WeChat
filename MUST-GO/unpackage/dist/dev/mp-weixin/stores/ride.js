"use strict";
const common_vendor = require("../common/vendor.js");
const useRideStore = common_vendor.defineStore("ride", () => {
  const defaultRides = [
    { id: 101, driver: "张师傅", start: "科技园南区", end: "高铁站", time: "14:30", seats: 2, price: 25, status: "recruiting", lat: 22.543099, lng: 113.938036 },
    { id: 102, driver: "李女士", start: "市中心广场", end: "宝安国际机场", time: "15:00", seats: 3, price: 40, status: "recruiting", lat: 22.545, lng: 113.94 },
    { id: 103, driver: "王大爷", start: "深圳大学", end: "罗湖火车站", time: "16:30", seats: 1, price: 20, status: "recruiting", lat: 22.535, lng: 113.93 },
    { id: 104, driver: "赵哥", start: "前海中心", end: "软件产业基地", time: "17:00", seats: 0, price: 15, status: "full", lat: 22.53, lng: 113.92 },
    { id: 105, driver: "陈姐", start: "欢乐谷", end: "世界之窗", time: "18:00", seats: 2, price: 10, status: "recruiting", lat: 22.538, lng: 113.935 },
    { id: 106, driver: "林同学", start: "大学城", end: "大梅沙", time: "明天 09:00", seats: 3, price: 50, status: "recruiting", lat: 22.58, lng: 113.97 }
  ];
  const rides = common_vendor.ref([]);
  const userOrders = common_vendor.ref([]);
  const init = () => {
    try {
      const storedRides = common_vendor.index.getStorageSync("pc_rides");
      const storedOrders = common_vendor.index.getStorageSync("pc_orders");
      rides.value = storedRides ? JSON.parse(storedRides) : defaultRides;
      userOrders.value = storedOrders ? JSON.parse(storedOrders) : [];
    } catch (e) {
      rides.value = defaultRides;
      userOrders.value = [];
    }
  };
  common_vendor.watch(rides, (newVal) => {
    common_vendor.index.setStorageSync("pc_rides", JSON.stringify(newVal));
  }, { deep: true });
  common_vendor.watch(userOrders, (newVal) => {
    common_vendor.index.setStorageSync("pc_orders", JSON.stringify(newVal));
  }, { deep: true });
  const publishRide = (rideData) => {
    const newRide = { ...rideData, id: Date.now(), driver: "我(车主)", status: "recruiting" };
    rides.value.unshift(newRide);
    userOrders.value.unshift({ ...newRide, orderId: `DD${Date.now()}`, orderStatus: "进行中", role: "driver" });
  };
  const joinRide = (rideId) => {
    const ride = rides.value.find((r) => r.id === rideId);
    if (ride && ride.seats > 0) {
      ride.seats -= 1;
      if (ride.seats === 0)
        ride.status = "full";
      userOrders.value.unshift({ ...ride, orderId: `DD${Date.now()}`, orderStatus: "已完成", role: "passenger" });
      return true;
    }
    return false;
  };
  return { rides, userOrders, init, publishRide, joinRide };
});
exports.useRideStore = useRideStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/ride.js.map
