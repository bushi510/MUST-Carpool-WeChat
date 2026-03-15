<template>
  <view class="pc-page pc-box home-page">
    <view class="search-wrap">
      <uni-search-bar placeholder="你要去哪里？" radius="100" bgColor="var(--pc-card-bg)" @confirm="goSearch" />
    </view>
    
    <map class="map-view" 
         :latitude="currentLoc.lat" 
         :longitude="currentLoc.lng" 
         :markers="markers"
         :polyline="polyline"
         show-location>
    </map>
    
    <scroll-view scroll-y class="bottom-panel modern-card">
      <view class="panel-header">
        <text class="title text-main">附近行程</text>
        <uni-icons type="loop" size="24" color="var(--pc-primary)" @click="refreshData"></uni-icons>
      </view>
      
      <uni-transition mode="fade" :show="true">
        <uni-list :border="false">
          <uni-list-item v-for="ride in rideStore.rides.filter(r => r.status === 'recruiting')" :key="ride.id" clickable @click="goDetail(ride.id)">
            <template v-slot:body>
              <view class="ride-item">
                <view class="route">
                  <text class="text-main font-bold">{{ ride.start }} ➔ {{ ride.end }}</text>
                  <text class="time text-sub">{{ ride.time }} 出发 | 剩余 {{ ride.seats }} 座</text>
                </view>
                <view class="price text-primary">￥{{ ride.price }}</view>
              </view>
            </template>
          </uni-list-item>
        </uni-list>
      </uni-transition>
    </scroll-view>

    <view class="fab-btn" @click="goPublish">
      <uni-icons type="plusempty" size="30" color="#fff"></uni-icons>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import { useRideStore } from '@/stores/ride'

const rideStore = useRideStore()
const currentLoc = ref({ lat: 22.543099, lng: 113.938036 })

const markers = computed(() => {
  return rideStore.rides.map(r => ({
    id: r.id, latitude: r.lat, longitude: r.lng, title: r.driver,
    iconPath: '../../static/car.png', 
    width: 32, height: 32,
    callout: { content: ` ${r.start} ➔ ${r.end} `, color: '#fff', bgColor: '#00C853', padding: 8, borderRadius: 10, display: 'ALWAYS' }
  }))
})

const polyline = ref([{
  points: [{latitude: 22.543099, longitude: 113.938036}, {latitude: 22.550000, longitude: 113.950000}],
  color: "#00C853", width: 6, arrowLine: true
}])

onLoad(() => { getLocation() })

// 添加下拉刷新生命周期
onPullDownRefresh(() => {
  refreshData('下拉刷新成功')
})

const getLocation = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => { currentLoc.value = { lat: res.latitude, lng: res.longitude } },
	fail: () => {
	      // 增加错误处理 Toast
	      uni.showToast({ title: '定位失败，使用默认位置', icon: 'none', duration: 2000 })
	    }
  })
}

const refreshData = (msg = '已更新最新行程') => {
  uni.showLoading({ title: '加载中...' })
  // 模拟网络请求延迟与数据刷新
  setTimeout(() => { 
    uni.hideLoading()
    uni.stopPullDownRefresh() // 停止下拉动画
    uni.showToast({ title: msg, icon: 'success' }) 
  }, 800)
}

const goSearch = (e) => uni.navigateTo({ url: `/pages/search/search?kw=${e.value}` })
// 这里修正了跳转路径，与 pages.json 保持一致
const goDetail = (id) => uni.navigateTo({ url: `/pages/ride-detail/ride-detail?id=${id}` })
const goPublish = () => uni.navigateTo({ url: `/pages/publish/publish` })
</script>

<style lang="scss" scoped>
.home-page { height: 100vh; display: flex; flex-direction: column; position: relative; }
.search-wrap { position: absolute; top: 20rpx; left: 20rpx; right: 20rpx; z-index: 10; }
.map-view { width: 100%; height: 55vh; }
.bottom-panel { height: 45vh; margin-top: -40rpx; z-index: 5; padding: 30rpx; }
.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20rpx; }
.title { font-size: 36rpx; font-weight: bold; }
.ride-item { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 20rpx 0; border-bottom: 1px solid var(--pc-border); }
.route { display: flex; flex-direction: column; gap: 10rpx; }
.time { font-size: 26rpx; }
.price { font-size: 40rpx; font-weight: bold; }
.fab-btn { position: fixed; right: 40rpx; bottom: 100rpx; width: 100rpx; height: 100rpx; background: var(--pc-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--pc-shadow-primary); z-index: 100; }
</style>