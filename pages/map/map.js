Page({
  data: {
    longitude: 113.5574, // 默认经度 (可以写澳科大的大概位置)
    latitude: 22.1554,   // 默认纬度
    startName: '我的当前位置',
    endName: '',
    markers: [],
    polyline: []
  },

  onLoad(options) {
    // 页面加载时，自动获取用户当前精确位置
    this.getUserCurrentLocation();
  },

  /**
   * 获取用户当前定位
   */
  getUserCurrentLocation() {
    // 微信获取定位原生 API
    wx.getLocation({
      type: 'gcj02', // 国测局坐标，用在 map 组件里最准
      success: (res) => {
        console.log("成功获取定位:", res);
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
      },
      fail: (err) => {
        console.error("定位失败", err);
        wx.showToast({
          title: '请授权位置信息以便拼车',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 点击选择起点/终点的假动作 (下次再接入真实选点)
   */
  chooseStart() {
    console.log("准备调用腾讯地图选点组件...");
  },
  chooseEnd() {
    console.log("准备调用腾讯地图选点组件...");
  },

  /**
   * 点击规划路线
   */
  planRoute() {
    if(!this.data.endName) {
      wx.showToast({
        title: '请先输入目的地',
        icon: 'none'
      });
      return;
    }
    // TODO: 接入腾讯位置服务路线规划 SDK
  }
})
