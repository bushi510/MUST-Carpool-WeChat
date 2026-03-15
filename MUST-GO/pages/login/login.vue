<template>
  <view class="login-page">
    <view class="brand">
      <view class="logo modern-card">GO</view>
      <text class="slogan text-main">同路人，一起走</text>
    </view>
    
    <view class="form-box modern-card">
      <uni-forms ref="formRef" :model="formData" :rules="rules">
        <uni-forms-item name="phone">
          <uni-easyinput v-model="formData.phone" type="number" placeholder="请输入手机号" prefixIcon="person" />
        </uni-forms-item>
        <uni-forms-item name="code">
          <view style="display: flex; gap: 20rpx;">
            <uni-easyinput v-model="formData.code" type="number" placeholder="验证码(1234)" prefixIcon="locked" />
            <button class="modern-btn" style="width: 200rpx; font-size: 26rpx;" @click="sendCode">获取</button>
          </view>
        </uni-forms-item>
      </uni-forms>
      <button class="modern-btn submit-btn" @click="handleLogin">立即登录</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const formRef = ref(null)
const formData = ref({ phone: '13800138000', code: '' })

const rules = {
  phone: { rules: [{ required: true, errorMessage: '手机号不能为空' }, { pattern: '^1[3-9]\\d{9}$', errorMessage: '格式不正确' }] },
  code: { rules: [{ required: true, errorMessage: '验证码不能为空' }] }
}

const sendCode = () => uni.showToast({ title: '验证码 1234 已发送', icon: 'none' })

const handleLogin = () => {
  formRef.value.validate().then(() => {
    uni.showLoading({ title: '登录中' })
    userStore.login(formData.value.phone, formData.value.code).then(() => {
      uni.hideLoading()
      uni.showToast({ title: '登录成功' })
      setTimeout(() => uni.switchTab({ url: '/pages/index/index' }), 1000)
    }).catch(err => {
      uni.hideLoading()
      uni.showToast({ title: err, icon: 'none' })
    })
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.login-page { padding: 60rpx; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; }
.brand { text-align: center; margin-bottom: 80rpx; }
.logo { width: 160rpx; height: 160rpx; line-height: 160rpx; text-align: center; font-size: 60rpx; font-weight: bold; color: var(--pc-primary); margin: 0 auto 30rpx; background: var(--pc-card-bg); }
.slogan { font-size: 36rpx; letter-spacing: 4rpx; }
.form-box { width: 100%; padding: 40rpx; }
.submit-btn { margin-top: 40rpx; width: 100%; }
</style>