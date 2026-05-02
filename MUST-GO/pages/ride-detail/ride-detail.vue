<template>
  <view class="pc-page pc-box">
    <view v-if="ride" class="detail-container">
      <map class="detail-map" v-if="ride && ride.start_location" :latitude="ride.start_location.lat" :longitude="ride.start_location.lng" :markers="markers"></map>
      
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
      </view>
      
      <view class="footer-bar modern-card">
              <!-- 如果已经买过了，显示进入聊天按钮 -->
              <button v-if="hasJoined" class="modern-btn join-btn" style="background: #f0f0f0; color: #00C853; font-weight: bold;" @click="goChat">
                已加入该行程，进入群聊
              </button>
              
              <!-- 如果还没买，走原来的逻辑 -->
              <button v-else class="modern-btn join-btn" :disabled="ride.seats <= 0" @click="handleJoin">
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
// ✨ 引入了 onShow
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useRideStore } from '@/stores/ride'
import { useUserStore } from '@/stores/user'

const rideStore = useRideStore()
const userStore = useUserStore()

// 1. 专门用一个变量存一下从上个页面传过来的 ID
const currentId = ref('')
// ✨ 新增：用来记录当前用户是否已加入
const hasJoined = ref(false) 

onLoad((options) => {
  if (options.id) {
    currentId.value = options.id
  }
})

// ✨ 新增：每次页面显示时，去查一下云数据库有没有这个订单
onShow(async () => {
  if (!currentId.value) return
  
  const userInfo = uni.getStorageSync('userInfo')
  const currentUserId = userInfo && userInfo._id ? userInfo._id : 'test_user_001'
  
  try {
    const db = wx.cloud.database()
    // 去 order_list 里找：ride_id 是当前行程，且 passenger_id 是当前用户的订单
    const res = await db.collection('order_list').where({
      ride_id: currentId.value,
      passenger_id: currentUserId
    }).get()
    
    // 如果查到的数组长度大于0，说明买过了
    if (res.data.length > 0) {
      hasJoined.value = true
    } else {
      hasJoined.value = false
    }
  } catch (e) {
    console.error('检查订单状态失败:', e)
  }
})

// 2. 【核心修复】将 ride 变成计算属性！
// 这样无论云端数据什么时候回来，它都会自动重新计算并显示到页面上
const ride = computed(() => {
  return rideStore.rides.find(r => r._id === currentId.value || r.id === currentId.value)
})

// 3. 【地图修复】确保从 start_location 里面取经纬度
const markers = computed(() => {
  if (ride.value && ride.value.start_location) {
    return [{ 
      latitude: ride.value.start_location.lat, 
      longitude: ride.value.start_location.lng, 
      iconPath: '../../static/car.png', 
      width: 32, height: 32 
    }]
  }
  return []
})

// 注意这里：传参优先使用微信云数据的 _id
const goChat = () => uni.navigateTo({ url: `/pages/chat/chat?rideId=${ride.value._id || ride.value.id}` })
const goBack = () => uni.switchTab({ url: '/pages/index/index' })

const handleJoin = () => {
  if (!userStore.isLogged) return uni.navigateTo({ url: '/pages/login/login' })
  
  // 获取当前用户ID
  const currentUserId = uni.getStorageSync('userInfo')._id || 'test_user_001'

  uni.showModal({
    title: '模拟支付',
    content: `需支付 ￥${ride.value.price} 元，确认支付吗？`,
    success: async (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '处理中...' })
        
        try {
          const db = wx.cloud.database()
          // 往云数据库的 order_list 集合中插入一条真实的订单记录
          await db.collection('order_list').add({
            data: {
              ride_id: ride.value._id || ride.value.id, // 关联的行程ID
              passenger_id: currentUserId,              // 乘客（当前用户）ID
              driver_name: ride.value.driver,           // 司机名字
              start: ride.value.start,                  // 出发地
              end: ride.value.end,                      // 目的地
              price: ride.value.price,                  // 价格
              status: 'completed',                      // 订单状态（已完成）
              create_time: Date.now()                   // 下单时间
            }
          })
          
          uni.hideLoading()
          uni.showToast({ title: '预订成功' })
          
          // 成功后，延迟跳转到历史订单页面
          setTimeout(() => uni.navigateTo({ url: '/pages/order/order' }), 1500)
          
        } catch (e) {
          uni.hideLoading()
          uni.showToast({ title: '预订失败', icon: 'error' })
          console.error('生成订单失败，请检查数据库设置:', e)
        }
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
</style>