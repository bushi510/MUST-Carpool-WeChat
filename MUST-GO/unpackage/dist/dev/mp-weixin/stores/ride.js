"use strict";
const common_vendor = require("../common/vendor.js");
const useRideStore = common_vendor.defineStore("ride", () => {
  const defaultRides = [
    { id: 101, driver: "张师傅", start: "科技园南区", end: "高铁站", time: "14:30", seats: 2, price: 25, status: "recruiting" },
    { id: 102, driver: "李女士", start: "市中心广场", end: "机场", time: "15:00", seats: 3, price: 40, status: "recruiting" }
  ];
  const rides = common_vendor.ref([]);
  const userOrders = common_vendor.ref([]);
  const init = async () => {
    try {
      const db = common_vendor.wx$1.cloud.database();
      const res = await db.collection("ride_list").orderBy("createTime", "desc").get();
      if (res.data && res.data.length > 0) {
        rides.value = res.data;
      } else {
        rides.value = defaultRides;
      }
    } catch (e) {
      common_vendor.index.__f__("error", "at stores/ride.js:27", "初始化获取云端数据失败，使用默认数据", e);
      rides.value = defaultRides;
    }
  };
  const publishRide = async (rideData) => {
    try {
      const db = common_vendor.wx$1.cloud.database();
      const newRide = {
        ...rideData,
        driver: "我(车主)",
        status: "recruiting",
        createTime: db.serverDate()
        // 使用服务器时间，避免手机时间不对导致校验失败
      };
      const res = await db.collection("ride_list").add({
        data: newRide
      });
      const rideWithId = { ...newRide, id: res._id };
      rides.value.unshift(rideWithId);
      userOrders.value.unshift({ ...rideWithId, orderId: `DD${Date.now()}`, orderStatus: "进行中", role: "driver" });
      return true;
    } catch (e) {
      common_vendor.index.__f__("error", "at stores/ride.js:55", "存入云数据库失败：", e);
      return false;
    }
  };
  const joinRide = (rideId) => {
    const ride = rides.value.find((r) => r.id === rideId);
    if (ride && ride.seats > 0) {
      ride.seats -= 1;
      if (ride.seats === 0)
        ride.status = "full";
      return true;
    }
    return false;
  };
  return { rides, userOrders, init, publishRide, joinRide };
});
exports.useRideStore = useRideStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/ride.js.map
