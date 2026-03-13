// pages/map/map.js
const TENCENT_MAP_KEY = 'A3PBZ-AOIAB-I3HUL-JUYIV-6AT35-F6BAL';

Page({
  data: {
    longitude: 113.5574, // 默认经度 (澳科大附近)
    latitude: 22.1554,   // 默认纬度
    startName: '我的当前位置',
    endName: '',
    markers: [],
    polyline: [],
    endLat: null, // 接收搜索页传回的纬度
    endLng: null  // 接收搜索页传回的经度
  },

  onLoad(options) {
    // 页面加载时，自动获取用户当前精确位置
    this.getUserCurrentLocation();
  },

  /**
   * 1. 获取用户当前定位并在地图上打点
   */
  getUserCurrentLocation() {
    wx.showLoading({ title: '定位中...' });
    
    // 微信获取定位原生 API
    wx.getLocation({
      type: 'gcj02', // 国测局坐标，用在 map 组件里最准
      success: (res) => {
        wx.hideLoading();
        console.log("成功获取定位:", res);
        
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          // 获取到定位后，立刻在地图上打上起点的 Marker
          markers: [{
            id: 1,
            latitude: res.latitude,
            longitude: res.longitude,
            title: '我的位置',
            iconPath: '../../images/logo.png', // 确保项目里有这个图片
            width: 30,
            height: 30
          }]
        });
      },
      fail: (err) => {
        wx.hideLoading();
        console.error("定位失败", err);
        wx.showToast({
          title: '请授权位置信息以便拼车',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 2. 点击选择起点 (预留扩展，目前默认当前位置)
   */
  chooseStart() {
    console.log("准备调用腾讯地图选点组件...");
  },

  /**
   * 3. 点击选择终点 -> 跳转到搜索联想页
   */
  chooseEnd() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  /**
   * 4. 核心算法：请求腾讯 API 规划路线并绘制轨迹
   */
  planRoute() {
    // 1. 校验是否已通过搜索页面获取到了终点数据
    if (!this.data.endName || !this.data.endLat || !this.data.endLng) {
      wx.showToast({
        title: '请先点击搜索框选择目的地',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '拼命规划中...' });

    // 2. 动态组装起点和终点的坐标串
    const from = `${this.data.latitude},${this.data.longitude}`;
    const to = `${this.data.endLat},${this.data.endLng}`;

    // 3. 调用腾讯位置服务 - 驾车路线规划 API
    wx.request({
      url: 'https://apis.map.qq.com/ws/direction/v1/driving/',
      method: 'GET',
      data: {
        from: from,
        to: to,
        key: TENCENT_MAP_KEY // 传入常量 KEY
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.status === 0) {
          // 获取返回的第一条推荐路线
          const route = res.data.result.routes[0];
          const coors = route.polyline;
          const pl = [];

          // 4. 坐标解压算法 (腾讯地图专属差分压缩算法)
          const kr = 1000000;
          for (let i = 2; i < coors.length; i++) {
            coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
          }
          // 将一维数组转换为地图组件需要的 {latitude, longitude} 对象数组
          for (let i = 0; i < coors.length; i += 2) {
            pl.push({ latitude: coors[i], longitude: coors[i + 1] });
          }

          // 获取当前的起点 Marker，如果因拒绝定位没拿到，就给个默认的
          const startMarker = this.data.markers.length > 0 ? this.data.markers[0] : {
            id: 1, 
            latitude: this.data.latitude, 
            longitude: this.data.longitude, 
            iconPath: '../../images/logo.png', 
            width: 30, 
            height: 30
          };

          // 5. 渲染数据到视图层
          this.setData({
            polyline: [{
              points: pl,
              color: '#0056A0', // 呼应 MUST 蓝
              width: 6,
              arrowLine: true // 带有行驶方向箭头
            }],
            // 在地图上打上终点 Marker (同时保留起点 Marker)
            markers: [
              startMarker, // 起点
              {
                id: 2,
                latitude: this.data.endLat,
                longitude: this.data.endLng,
                title: this.data.endName,
                iconPath: '../../images/logo.png', // 终点图标
                width: 30,
                height: 30
              }
            ]
          });

          wx.showToast({ title: '路线规划成功！' });

          // 6. 极致的用户体验：自动缩放地图视野，让起点和终点完整显示在屏幕内
          const mapCtx = wx.createMapContext('myMap');
          mapCtx.includePoints({
            padding: [80, 50, 80, 50],
            points: pl
          });

        } else {
          wx.showToast({ title: '规划失败: ' + res.data.message, icon: 'none' });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({ title: '网络请求失败，请检查合法域名', icon: 'none' });
        console.error("请求报错:", err);
      }
    });
  }
})