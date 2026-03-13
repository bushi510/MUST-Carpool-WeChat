// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAgreed: false // 用户是否已勾选协议
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("登录页 UI 加载完毕，逻辑尚未接入");
  },

  /**
   * 处理协议勾选状态变化
   */
  handleAgreementChange(e) {
    const values = e.detail.value;
    this.setData({
      isAgreed: values.includes('agree')
    });
  },

  /**
   * 点击登录按钮 (此时只做打印，不写业务)
   */
  handleLoginClick() {
    if (!this.data.isAgreed) {
      // 原生 Toast 提示
      wx.showToast({
        title: '请先勾选同意服务协议',
        icon: 'none'
      });
      return;
    }
    console.log("用户点击了登录，下一步准备接入 wx.login...");
    // TODO: 接入里程碑1的任务1.2
  },

  /**
   * 点击暂不登录
   */
  handleCancel() {
    console.log("用户暂不登录，可跳转至游客首页");
  }
})
