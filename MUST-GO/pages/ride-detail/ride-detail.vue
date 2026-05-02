<template>
  <view class="pc-page pc-box">
    <view v-if="ride" class="detail-container">
      <map class="detail-map" :latitude="ride.lat" :longitude="ride.lng" :markers="markers"></map>
      
      <view class="info-card modern-card">
        <view class="driver-box">
          <view class="avatar-placeholder">
            <uni-icons type="person-filled" size="40" color="#fff"></uni-icons>
          </view>
          <view class="driver-info">
            <text class="name text-main font-bold">{{ ride.driver }}</text>
            <text class="score text-primary">⭐ 信用分: 98</text>
          </view>
          <uni-icons type="chat" size="30" color="var(--pc-primary)" @click="goChat"></uni-icons>
        </view>
        
        <view class="route-details text-main">
          <view class="detail-row"><text class="label text-sub">出发地：</text>{{ ride.start }}</view>
          <view class="detail-row"><text class="label text-sub">目的地：</text>{{ ride.end }}</view>
          <view class="detail-row"><text class="label text-sub">时间：</text>{{ ride.time }}</view>
          <view class="detail-row"><text class="label text-sub">余座：</text>{{ ride.seats }} 个</view>
          <view class="detail-row"><text class="label text-sub">价格：</text><text class="price text-primary">￥{{ ride.price }}</text></view>
        </view>
        
        <view class="remark-section">
          <view class="section-title">
            <uni-icons type="chatbubble-filled" size="18" color="#00C853"></uni-icons>
            <text class="title-text">行程备注</text>
          </view>
          <view class="remark-content">
            <text>{{ ride.remark || '车主很懒，没有留下备注信息~' }}</text>
          </view>
        </view>
        
      </view>
      
      <view class="footer-bar modern-card">
        <button class="modern-btn join-btn" :disabled="ride.seats <= 0" @click="handleJoin">
          {{ ride.seats > 0 ? '确认预订并支付' : '座位已满' }}
        </button>
      </view>
    </view>

    <view v-else class="error-state">
      <uni-icons type="info-filled" size="60" color="#ccc"></uni-icons>
      <text class="text-sub mt-20">未找到该行程信息或已过期</text>
      <button class="modern-btn back-btn" @click="goBack">返回首页</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useRideStore } from '@/stores/ride'
import { useUserStore } from '@/stores/user'

const rideStore = useRideStore()
const userStore = useUserStore()
const ride = ref(null)

// 针对微信小程序，如果缺失 iconPath 会有警告，这里使用相对路径。
// 请务必确保项目中存在这个图片，或者忽略控制台降级为默认 marker 的黄色提示
const markers = computed(() => ride.value ? [{ 
  latitude: ride.value.lat, longitude: ride.value.lng, 
  iconPath: '../../static/car.png', 
  width: 32, height: 32 
}] : [])

onLoad((options) => {
  if (options.id) {
    // 强制转换为数字类型以匹配 Pinia 中的数据格式
    ride.value = rideStore.rides.find(r => r.id === Number(options.id))
  }
})

const goChat = () => uni.navigateTo({ url: '/pages/chat/chat' })
const goBack = () => uni.switchTab({ url: '/pages/index/index' })

const handleJoin = () => {
  if (!userStore.isLogged) return uni.navigateTo({ url: '/pages/login/login' })
  uni.showModal({
    title: '模拟支付',
    content: `需支付 ￥${ride.value.price} 元，确认支付吗？`,
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '支付中' })
        setTimeout(() => {
          uni.hideLoading()
          const success = rideStore.joinRide(ride.value.id)
          if (success) {
            uni.showToast({ title: '预订成功' })
            setTimeout(() => uni.switchTab({ url: '/pages/order/order' }), 1500)
          } else {
            uni.showToast({ title: '预订失败', icon: 'error' })
          }
        }, 1500)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.detail-container { padding-bottom: 120rpx; }
.detail-map { width: 100%; height: 40vh; }
.info-card { margin: -60rpx 30rpx 0; padding: 40rpx; position: relative; z-index: 10; }
.driver-box { display: flex; align-items: center; border-bottom: 1px solid var(--pc-border); padding-bottom: 30rpx; margin-bottom: 30rpx; }
.avatar-placeholder { width: 100rpx; height: 100rpx; border-radius: 50%; background: #ccc; display: flex; align-items: center; justify-content: center; margin-right: 20rpx; }
.driver-info { flex: 1; display: flex; flex-direction: column; }
.score { font-size: 24rpx; margin-top: 8rpx; }
.detail-row { font-size: 28rpx; margin-bottom: 20rpx; display: flex; align-items: center; }
.label { width: 120rpx; }
.price { font-size: 40rpx; font-weight: bold; }
.footer-bar { position: fixed; bottom: 0; left: 0; width: 100%; padding: 20rpx 30rpx 60rpx; box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.05); border-radius: 40rpx 40rpx 0 0; }
.join-btn { width: 100%; }

.error-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80vh; }
.mt-20 { margin-top: 20rpx; }
.back-btn { margin-top: 60rpx; width: 60%; }

/* 新增：备注相关样式 */
.remark-section {
  margin-top: 30rpx;
  padding-top: 30rpx;
  border-top: 1px dashed #eee;
}
.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}
.title-text {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-left: 10rpx;
}
.remark-content {
  background-color: #f8f9fa;
  padding: 20rpx;
  border-radius: 12rpx;
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}
</style>