<template>
  <view class="search-page">
    <view class="modern-card" style="padding: 20rpx; margin-bottom: 20rpx;">
      <uni-search-bar v-model="keyword" placeholder="搜索目的地" @confirm="doSearch" />
    </view>
    
    <uni-transition mode="slide-bottom" :show="isSearched">
      <view class="modern-card result-box" v-if="results.length > 0">
        <uni-list :border="false">
          <uni-list-item v-for="item in results" :key="item.id" :title="item.end" :note="`${item.time}出发 | ￥${item.price}`" clickable @click="goDetail(item.id)" />
        </uni-list>
      </view>
      <view class="empty text-sub" v-else-if="isSearched && results.length === 0">未找到匹配行程</view>
    </uni-transition>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useRideStore } from '@/stores/ride'

const keyword = ref('')
const isSearched = ref(false)
const results = ref([])
const rideStore = useRideStore()

onLoad((opts) => { if (opts.kw) { keyword.value = opts.kw; doSearch() } })

const doSearch = () => {
  if (!keyword.value) return
  uni.showLoading({ title: '搜索中' })
  setTimeout(() => {
    results.value = rideStore.rides.filter(r => r.end.includes(keyword.value))
    isSearched.value = true
    uni.hideLoading()
  }, 500)
}

const goDetail = (id) => uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
</script>

<style scoped> .search-page { padding: 30rpx; } .result-box { padding: 20rpx 0; } .empty { text-align: center; margin-top: 100rpx; } </style>