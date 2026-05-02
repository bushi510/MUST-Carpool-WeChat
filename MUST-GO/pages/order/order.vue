<template>
  <!-- 外层加上浅灰背景色 -->
  <view class="order-page">
   <scroll-view scroll-y class="list-wrap">
     <view v-if="orderList.length === 0" class="empty text-sub">暂无行程订单</view>
     
     <view v-for="(order, index) in orderList" :key="order._id">
       <uni-transition mode="fade,slide-bottom" :show="true" :duration="300" :delay="index * 100">
         <!-- 全新设计的精美卡片 -->
         <view class="beautiful-card">
           
           <!-- 卡片头部：时间与状态 -->
           <view class="card-header">
             <view class="time-box">
               <uni-icons type="shop" size="16" color="#888" style="margin-right: 8rpx;"></uni-icons>
               <text class="time">{{ order.time ? order.time + ' 出发' : '行程预约' }}</text>
             </view>
             <uni-tag text="已支付" size="small" custom-style="background-color: #E8F5E9; border-color: #E8F5E9; color: #00C853;" />
           </view>
           
           <!-- 卡片主体：时间轴式路线设计 -->
           <view class="card-body" @click="goDetail(order.ride_id)">
             <view class="route-timeline">
               <!-- 起点 -->
               <view class="route-node">
                 <view class="dot start-dot"></view>
                 <text class="location text-main">{{ order.start }}</text>
               </view>
               <!-- 终点 -->
               <view class="route-node">
                 <view class="dot end-dot"></view>
                 <text class="location text-main">{{ order.end }}</text>
               </view>
               <!-- 连接起终点的竖线 -->
               <view class="timeline-line"></view>
             </view>
           </view>
           
           <!-- 卡片底部：虚线分割，价格与操作按钮对齐 -->
           <view class="card-footer">
             <view class="price-box">
               <text class="currency">￥</text>
               <text class="price-num">{{ order.price }}</text>
             </view>
             <button class="action-btn" @click.stop="goChat(order.ride_id)">联系对方</button>
           </view>
           
         </view>
       </uni-transition>
     </view>
   </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const orderList = ref([])

onShow(async () => {
  const userInfo = uni.getStorageSync('userInfo')
  const currentUserId = userInfo && userInfo._id ? userInfo._id : 'test_user_001'
  
  uni.showLoading({ title: '加载订单...' })
  try {
    const db = wx.cloud.database()
    const res = await db.collection('order_list')
      .where({ passenger_id: currentUserId })
      .orderBy('create_time', 'desc')
      .get()
      
    orderList.value = res.data
  } catch (e) {
    console.error('获取云端订单失败:', e)
  } finally {
    uni.hideLoading()
  }
})

const goDetail = (rideId) => uni.navigateTo({ url: `/pages/ride-detail/ride-detail?id=${rideId}` })
const goChat = (rideId) => uni.navigateTo({ url: `/pages/chat/chat?rideId=${rideId}` })
</script>

<style lang="scss" scoped>
/* 整个页面的背景改为非常浅的灰色，让白色的卡片凸显出来 */
.order-page { 
  min-height: 100vh; 
  background-color: #F4F5F7; 
  padding: 24rpx; 
  box-sizing: border-box;
}

.list-wrap { height: 100%; }
.empty { text-align: center; margin-top: 200rpx; }

/* 核心卡片样式：圆角、纯白背景、轻微阴影 */
.beautiful-card {
  background-color: #FFFFFF;
  border-radius: 24rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

/* 头部样式：虚线下边框 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 30rpx;
  border-bottom: 2rpx dashed #EEEEEE;
}
.time-box { display: flex; align-items: center; }
.time { font-size: 26rpx; color: #888888; }

/* 主体路线样式：时间轴 */
.card-body {
  padding: 30rpx;
}
.route-timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24rpx; /* 起点和终点的间距 */
}
.route-node {
  display: flex;
  align-items: center;
  z-index: 2;
}
.dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  margin-right: 24rpx;
}
/* 绿色的起点圆点 */
.start-dot { 
  background-color: #00C853; 
  box-shadow: 0 0 0 6rpx #E8F5E9; 
}
/* 橘色的终点圆点 */
.end-dot { 
  background-color: #FF7043; 
  box-shadow: 0 0 0 6rpx #FBE9E7; 
}
/* 起终点之间的连线 */
.timeline-line {
  position: absolute;
  left: 7rpx; /* 对齐圆点中心 */
  top: 24rpx;
  bottom: 24rpx;
  width: 2rpx;
  background-color: #EEEEEE;
  z-index: 1;
}
.location {
  font-size: 32rpx;
  font-weight: bold;
}

/* 底部样式：价格与按钮 */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx 24rpx;
  background-color: #FAFAFA; /* 底部使用极浅的灰色划分区域 */
}
.price-box {
  color: #00C853;
  display: flex;
  align-items: baseline;
}
.currency { font-size: 24rpx; font-weight: bold; }
.price-num { font-size: 44rpx; font-weight: bold; margin-left: 4rpx; }

/* 精致的小按钮 */
.action-btn {
  margin: 0;
  padding: 0 40rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 26rpx;
  border-radius: 30rpx;
  background-color: #00C853;
  color: #FFFFFF;
  border: none;
  font-weight: 500;
}
.action-btn::after { border: none; }
</style>