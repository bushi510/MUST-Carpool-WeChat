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
        
        <uni-forms-item label="备注信息" name="remark">
          <uni-easyinput 
            type="textarea" 
            v-model="formData.remark" 
            placeholder="例如: 准时出发, 不抽烟, 有大件行李请提前告知..." 
            autoHeight 
            maxlength="100"
          />
        </uni-forms-item>
      </uni-forms>
    </view>
    <button class="modern-btn publish-btn" @click="submit">确认发布</button>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRideStore } from '@/stores/ride'
import { useUserStore } from '@/stores/user'

const rideStore = useRideStore()
const userStore = useUserStore()
const formRef = ref(null)
const isSubmitting = ref(false) // 新增：提交锁，防止重复发布

// 优化1：完善数据结构，同时存储起点和终点的坐标及详细地址
const formData = reactive({ 
  start: '', 
  end: '', 
  time: '', 
  seats: 1, 
  price: '',
  remark: '', // 新增：备注字段
  start_location: { lat: null, lng: null, address: '' },
  end_location: { lat: null, lng: null, address: '' }
})

const rules = {
  start: { rules: [{ required: true, errorMessage: '请选择出发地' }] },
  end: { rules: [{ required: true, errorMessage: '请选择目的地' }] },
  time: { 
    rules: [
      { required: true, errorMessage: '请选择时间' },
      // 优化2：功能逻辑校验，禁止发布过去的时间
      { validateFunction: (rule, value, data, callback) => {
          if (new Date(value).getTime() < Date.now()) callback('出发时间不能早于当前时间')
          return true
      }}
    ] 
  },
  price: { 
    rules: [
      { required: true, errorMessage: '请填写金额' },
      { validateFunction: (rule, value, data, callback) => {
          if (parseFloat(value) <= 0) callback('金额必须大于0')
          return true
      }}
    ] 
  }
}

const pickLocation = (field) => {
  uni.chooseLocation({
    success: (res) => {
      formData[field] = res.name
      // 优化3：完整记录经纬度信息，这是后续“匹配算法”计算成功率的核心数据
      formData[`${field}_location`] = {
        lat: res.latitude,
        lng: res.longitude,
        address: res.address
      }
    },
    fail: (err) => {
      // 优化4：权限拒绝后的功能引导
      if (err.errMsg.includes('auth deny')) {
        uni.showModal({
          title: '提示',
          content: '请在设置中开启定位权限以选择地点',
          success: (res) => { if (res.confirm) uni.openSetting() }
        })
      }
    }
  })
}

const submit = async () => {
  if (isSubmitting.value) return // 防抖锁
  
  if (!userStore.isLogged) return uni.navigateTo({ url: '/pages/login/login' })
  if (!userStore.userInfo.isCertified) return uni.showToast({ title: '请先完成车主认证', icon: 'none' })

  try {
    await formRef.value.validate()
    isSubmitting.value = true // 开启提交锁
    
    uni.showLoading({ title: '发布中', mask: true })
    
    // 优化5：将提交逻辑改为异步处理，并清理过期数据
    // 注意：这里由于传入了 {...formData}，所以 remark 会自动一起传给 pinia 和云数据库
    const success = await rideStore.publishRide({ ...formData })
    
    uni.hideLoading()
    if (success) {
      uni.showToast({ title: '发布成功', icon: 'success' })
      // 延时跳转，确保用户看到成功状态
      setTimeout(() => {
        isSubmitting.value = false
        uni.switchTab({ url: '/pages/index/index' })
      }, 1500)
    }
  } catch (error) {
    isSubmitting.value = false
    console.error('校验失败:', error)
  }
}
</script>