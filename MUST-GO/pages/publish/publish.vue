<template>
  <view class="publish-page">
    <view class="modern-card form-wrap">
      <uni-forms ref="formRef" :model="formData" :rules="rules" label-position="top">
        <uni-forms-item label="出发地" name="start" required>
          <view class="location-picker text-main" @click="pickLocation('start')">{{ formData.start || '点击选择出发地' }}</view>
        </uni-forms-item>
        <uni-forms-item label="目的地" name="end" required>
          <view class="location-picker text-main" @click="pickLocation('end')">{{ formData.end || '点击选择目的地' }}</view>
        </uni-forms-item>
        <uni-forms-item label="出发时间" name="time" required>
          <uni-datetime-picker type="datetime" v-model="formData.time" />
        </uni-forms-item>
        <uni-forms-item label="提供座位数" name="seats" required>
          <uni-number-box v-model="formData.seats" :min="1" :max="6" />
        </uni-forms-item>
        <uni-forms-item label="预期分摊(元/人)" name="price" required>
          <uni-easyinput v-model="formData.price" type="digit" placeholder="输入金额" />
        </uni-forms-item>
      </uni-forms>
    </view>
    <button class="modern-btn publish-btn" @click="submit">确认发布</button>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useRideStore } from '@/stores/ride'
import { useUserStore } from '@/stores/user'

const rideStore = useRideStore()
const userStore = useUserStore()
const formRef = ref(null)

const formData = ref({ start: '', end: '', time: '', seats: 1, price: '', lat: 22.54, lng: 113.93 })

const rules = {
  start: { rules: [{ required: true, errorMessage: '请选择出发地' }] },
  end: { rules: [{ required: true, errorMessage: '请选择目的地' }] },
  time: { rules: [{ required: true, errorMessage: '请选择时间' }] },
  price: { rules: [{ required: true, errorMessage: '请填写金额' }] }
}

const pickLocation = (field) => {
  uni.chooseLocation({
    success: (res) => {
      formData.value[field] = res.name
      if (field === 'start') { formData.value.lat = res.latitude; formData.value.lng = res.longitude }
    }
  })
}

const submit = () => {
  if (!userStore.isLogged) return uni.navigateTo({ url: '/pages/login/login' })
  if (!userStore.userInfo.isCertified) return uni.showToast({ title: '请先完成车主认证', icon: 'none' })

  formRef.value.validate().then(() => {
    uni.showLoading({ title: '发布中' })
    setTimeout(() => {
      rideStore.publishRide(formData.value)
      uni.hideLoading()
      uni.showToast({ title: '发布成功' })
      setTimeout(() => uni.switchTab({ url: '/pages/index/index' }), 1500)
    }, 1000)
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.publish-page { padding: 30rpx; }
.form-wrap { padding: 40rpx; margin-bottom: 40rpx; }
.location-picker { padding: 20rpx; background: var(--pc-bg); border-radius: 12rpx; border: 1px solid var(--pc-border); min-height: 80rpx; display: flex; align-items: center; }
.publish-btn { width: 100%; height: 90rpx; line-height: 90rpx; font-size: 34rpx; }
</style>