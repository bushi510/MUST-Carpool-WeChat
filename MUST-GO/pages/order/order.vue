<template>
  <view class="order-page">
   <scroll-view scroll-y class="list-wrap">
     <view v-if="rideStore.userOrders.length === 0" class="empty text-sub">暂无行程订单</view>
     
     <view v-for="(order, index) in rideStore.userOrders" :key="order.orderId">
       <uni-transition mode="fade,slide-bottom" :show="true" :duration="300" :delay="index * 100">
         <view class="modern-card order-card">
           <view class="order-header border-bottom">
             <text class="time text-sub">{{ order.time }} 出发</text>
             <uni-tag :text="order.orderStatus" :type="order.orderStatus === '进行中' ? 'primary' : 'success'" size="small" inverted />
           </view>
           
           <view class="order-body" @click="goDetail(order.id)">
             <view class="route text-main">
               <view>{{ order.start }}</view>
               <view style="color:var(--pc-border)">↓</view>
               <view>{{ order.end }}</view>
             </view>
             <view class="price text-primary font-bold">￥{{ order.price }}</view>
           </view>
           
           <view class="order-footer">
             <text class="role text-sub">角色: {{ order.role === 'driver' ? '车主' : '乘客' }}</text>
             <button class="modern-btn small-btn" @click.stop="goChat">联系对方</button>
           </view>
         </view>
       </uni-transition>
     </view>
   </scroll-view>
  </view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { useRideStore } from '@/stores/ride'
const rideStore = useRideStore()

onShow(() => { /* 数据已通过 Pinia watch 自动保持响应，这里可调用接口同步远端 */ })

const goDetail = (id) => uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
const goChat = () => uni.navigateTo({ url: '/pages/chat/chat' })
</script>

<style lang="scss" scoped>
.order-page { height: 100vh; padding: 30rpx; }
.list-wrap { height: 100%; }
.empty { text-align: center; margin-top: 200rpx; }
.order-card { margin-bottom: 30rpx; padding: 0; }
.order-header, .order-body, .order-footer { padding: 20rpx 30rpx; }
.border-bottom { border-bottom: 1px solid var(--pc-border); }
.order-header { display: flex; justify-content: space-between; align-items: center; }
.order-body { display: flex; justify-content: space-between; align-items: center; padding: 30rpx; }
.route { font-size: 32rpx; font-weight: bold; line-height: 1.5; }
.price { font-size: 44rpx; }
.order-footer { display: flex; justify-content: space-between; align-items: center; background: var(--pc-bg); }
.small-btn { margin: 0; width: 160rpx; height: 60rpx; line-height: 60rpx; font-size: 24rpx; }
</style>