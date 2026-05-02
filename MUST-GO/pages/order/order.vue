<template>
  <view class="pc-page order-page">
    <!-- 顶部 Tab 切换 -->
    <view class="tab-header modern-card">
      <uni-segmented-control 
        :current="currentTab" 
        :values="['我参与的 (乘客)', '我发布的 (车主)']" 
        @clickItem="onClickItem" 
        styleType="text" 
        activeColor="#00C853">
      </uni-segmented-control>
    </view>

    <!-- 订单列表展示区 -->
    <scroll-view scroll-y class="order-list">
      <!-- 空状态提示 -->
      <view v-if="orderList.length === 0" class="empty-state">
        <uni-icons type="list" size="60" color="#ccc"></uni-icons>
        <text class="text-sub mt-20">暂无相关历史订单</text>
      </view>

      <!-- 订单卡片 -->
      <view v-for="item in orderList" :key="item._id" class="modern-card order-card">
        <view class="card-header">
          <text class="time text-sub">{{ formatTime(item.create_time) }}</text>
          <text class="status text-primary">已完成</text>
        </view>
        
        <view class="card-body">
          <view class="route font-bold text-main">{{ item.start }} ➔ {{ item.end }}</view>
          <view class="driver text-sub mt-10">车主: {{ item.driver_name || '未知' }}</view>
        </view>
        
        <view class="card-footer">
          <text class="price text-main font-bold">￥{{ item.price }}</text>
          <button class="modern-btn small-btn" @click="goDetail(item.ride_id)">查看行程</button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const currentTab = ref(0)
const orderList = ref([])
const currentUserId = ref('')

// 每次进入页面时都会触发拉取最新数据
onShow(() => {
  const userInfo = uni.getStorageSync('userInfo')
  currentUserId.value = userInfo && userInfo._id ? userInfo._id : 'test_user_001'
  
  fetchOrders()
})

// 切换 Tab 时触发
const onClickItem = (e) => {
  if (currentTab.value !== e.currentIndex) {
    currentTab.value = e.currentIndex
    fetchOrders()
  }
}

// 核心：从微信云数据库获取订单数据
const fetchOrders = async () => {
  uni.showLoading({ title: '加载中...' })
  const db = wx.cloud.database()
  
  try {
    let query = {}
    if (currentTab.value === 0) {
      // Tab 0: 我作为乘客，查询 passenger_id 是我的订单
      query = { passenger_id: currentUserId.value }
    } else {
      // Tab 1: 我作为车主，这里暂时演示查所有我发布的行程
      // 如果你的 ride_list 表里存了车主的 _openid，你可以改成查 ride_list
      query = { driver_id: currentUserId.value } // 需根据你实际的车主ID字段调整
    }

    // 执行数据库查询
    const res = await db.collection('order_list')
      .where(query)
      .orderBy('create_time', 'desc') // 按时间倒序（最新的在最上面）
      .get()
      
    orderList.value = res.data
  } catch (e) {
    console.error('获取订单失败:', e)
    uni.showToast({ title: '获取数据失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

// 跳转回行程详情
const goDetail = (rideId) => {
  if (rideId) {
    uni.navigateTo({ url: `/pages/ride-detail/ride-detail?id=${rideId}` })
  }
}

// 辅助函数：格式化时间戳
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const d = date.getDate().toString().padStart(2, '0')
  const h = date.getHours().toString().padStart(2, '0')
  const min = date.getMinutes().toString().padStart(2, '0')
  return `${m}-${d} ${h}:${min}`
}
</script>

<style lang="scss" scoped>
.order-page { height: 100vh; display: flex; flex-direction: column; background: #f7f7f7; }
.tab-header { margin-bottom: 20rpx; border-radius: 0 0 30rpx 30rpx; }
.order-list { flex: 1; padding: 20rpx 30rpx; box-sizing: border-box; }

.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50vh; }
.mt-20 { margin-top: 20rpx; }
.mt-10 { margin-top: 10rpx; }

.order-card { padding: 30rpx; margin-bottom: 30rpx; display: flex; flex-direction: column; gap: 20rpx; }
.card-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 20rpx; }
.card-body { padding: 10rpx 0; }
.route { font-size: 32rpx; }
.card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 10rpx; border-top: 1px dashed #f0f0f0; }
.price { font-size: 36rpx; }
.small-btn { width: 180rpx; height: 60rpx; line-height: 60rpx; font-size: 24rpx; margin: 0; }
</style>