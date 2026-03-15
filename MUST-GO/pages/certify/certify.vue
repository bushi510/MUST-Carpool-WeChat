<template>
  <view class="certify-page">
    <view class="tips text-sub">为保障行程安全，请填写真实车辆与证件信息。</view>
    <view class="modern-card form-box">
      <uni-forms ref="formRef" :model="formData" :rules="rules" label-width="80">
        <uni-forms-item label="真实姓名" name="name" required>
          <uni-easyinput v-model="formData.name" placeholder="请输入姓名" />
        </uni-forms-item>
        <uni-forms-item label="车牌号码" name="plate" required>
          <uni-easyinput v-model="formData.plate" placeholder="例: 粤B12345" />
        </uni-forms-item>
        <uni-forms-item label="车辆型号" name="carType" required>
          <uni-easyinput v-model="formData.carType" placeholder="例: 丰田卡罗拉 白色" />
        </uni-forms-item>
      </uni-forms>
    </view>
    <button class="modern-btn" style="width: 100%" @click="submitCertify" :disabled="userStore.userInfo.isCertified">
      {{ userStore.userInfo.isCertified ? '已通过认证' : '提交认证' }}
    </button>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const formRef = ref(null)
const formData = ref({ name: '', plate: '', carType: '' })

const rules = {
  name: { rules: [{ required: true, errorMessage: '姓名不能为空' }] },
  plate: { rules: [{ required: true, errorMessage: '车牌不能为空' }] }
}

const submitCertify = () => {
  formRef.value.validate().then(() => {
    uni.showLoading({ title: '审核中' })
    setTimeout(() => {
      userStore.certify()
      uni.hideLoading()
      uni.showToast({ title: '认证成功，信用分+5' })
      setTimeout(() => uni.navigateBack(), 1500)
    }, 1500)
  }).catch(() => {})
}
</script>

<style scoped> .certify-page { padding: 30rpx; } .tips { margin-bottom: 20rpx; font-size: 26rpx; } .form-box { padding: 40rpx; margin-bottom: 40rpx; } </style>