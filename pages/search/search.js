// pages/search/search.js
const TENCENT_MAP_KEY = 
'A3PBZ-AOIAB-I3HUL-JUYIV-6AT35-F6BAL';

Page({
  data: {
    suggestionList: []
  },

  onInput(e) {
    const keyword = e.detail.value;
    
    if (!keyword) {
      this.setData({ suggestionList: [] });
      return;
    }

    console.log("👉 正在向腾讯地图发送搜索:", keyword);

    // 调用腾讯地图地点联想 API
    wx.request({
      url: 'https://apis.map.qq.com/ws/place/v1/suggestion',
      method: 'GET',
      data: {
        keyword: keyword,
        // ⚠️ 我暂时把 region 限制去掉了，扩大搜索范围排查问题
        key: TENCENT_MAP_KEY
      },
      success: (res) => {
        // 💡 关键点：把腾讯返回的完整原始数据打印出来！
        console.log("✅ 腾讯地图返回结果:", res.data); 

        if (res.data.status === 0) {
          this.setData({
            suggestionList: res.data.data
          });
        } else {
          // 如果 status 不是 0，说明请求被腾讯拒绝了，弹出具体的错误原因
          wx.showToast({
            title: '腾讯报错: ' + res.data.message,
            icon: 'none',
            duration: 3000
          });
        }
      },
      fail: (err) => {
        console.error("❌ 网络请求彻底失败:", err);
      }
    });
  },

  selectPlace(e) {
    const item = e.currentTarget.dataset.item;
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; 

    prevPage.setData({
      endName: item.title,
      endLat: item.location.lat,
      endLng: item.location.lng
    });

    wx.navigateBack();
  }
})