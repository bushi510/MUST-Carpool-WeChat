Page({
  data: {},

  onLoad(options) {
    console.log("个人中心页面加载");
  },

  navigateToMyRides() {
    wx.showToast({
      title: '正在加载我的行程',
      icon: 'loading'
    });
  },

  navigateToJoined() {
    wx.showToast({
      title: '正在加载参与记录',
      icon: 'loading'
    });
  },

  showRealNameAuth() {
    wx.showModal({
      title: '认证详情',
      content: '您的 MUST 学生认证已于 2026-01-10 通过审核。',
      showCancel: false
    });
  },

  handleLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      success: (res) => {
        if (res.confirm) {
          wx.reLaunch({
            url: '/pages/login/login'
          });
        }
      }
    });
  }
})