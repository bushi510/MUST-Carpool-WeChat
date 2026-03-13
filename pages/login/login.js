// pages/login/login.js
Page({
  data: {},

  /**
   * 处理微信一键登录点击
   */
  handleLogin() {
    // 1. 添加点击反馈，让用户知道“点上了”
    wx.showLoading({
      title: '正在授权...',
      mask: true
    });

    // 模拟授权请求耗时
    setTimeout(() => {
      wx.hideLoading();
      
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1000
      });

      // 2. 关键修正点：因为 map 页面现在是 TabBar 页面
      // 必须使用 switchTab 才能跳转成功！
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/map/map',
          success: (res) => {
            console.log("跳转首页成功");
          },
          fail: (err) => {
            console.error("跳转失败，请检查 app.json 是否配置了 tabBar", err);
            // 如果 switchTab 失败，尝试 reLaunch 作为兜底
            wx.reLaunch({
              url: '/pages/map/map'
            });
          }
        });
      }, 1000);
    }, 800);
  }
})