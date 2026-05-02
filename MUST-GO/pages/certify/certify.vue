<template>
  <view class="certify-page">
    <view class="tips text-sub">为保障校园拼车安全，请填写真实身份信息。</view>
    <view class="modern-card form-box">
      <uni-forms ref="formRef" :model="formData" :rules="rules" label-width="80">
        <uni-forms-item label="真实姓名" name="name" required>
          <uni-easyinput v-model="formData.name" placeholder="请输入姓名" />
        </uni-forms-item>
        
        <uni-forms-item label="学号" name="studentId" required>
          <uni-easyinput v-model="formData.studentId" placeholder="请输入M.U.S.T.学号" />
        </uni-forms-item>
        
        <uni-forms-item label="性别" name="gender" required>
          <uni-data-checkbox v-model="formData.gender" :localdata="genderOptions" />
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

const genderOptions = [
  { text: '男', value: '男' },
  { text: '女', value: '女' }
]

const formData = ref({ 
  name: '', 
  studentId: '', 
  gender: '男' 
})

// 保留了 ref 包装，确保 uni-forms 校验永远稳定生效
const rules = ref({
  name: { rules: [{ required: true, errorMessage: '姓名不能为空' }] },
  studentId: { rules: [{ required: true, errorMessage: '学号不能为空' }] },
  gender: { rules: [{ required: true, errorMessage: '请选择性别' }] }
})

const submitCertify = () => {
  if (!formRef.value) return

  formRef.value.validate().then(async () => {
    uni.showLoading({ title: '正在存入云端...' })

    try {
      // 核心上云逻辑
      const db = wx.cloud.database({
        env: 'cloudbase-d8gs0x2y67fedcaef' 
      })
      
      await db.collection('users').add({
        data: {
          realName: formData.value.name,
          studentId: formData.value.studentId,
          gender: formData.value.gender,
          isCertified: true,
          certifyTime: new Date()
        }
      })

      // 更新本地状态
      userStore.certify({
        name: formData.value.name,
        studentId: formData.value.studentId,
        gender: formData.value.gender
      })
      
      uni.hideLoading()
      uni.showToast({ title: '认证成功', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 1500)

    } catch (e) {
      uni.hideLoading()
      console.error('云端保存失败：', e)
      uni.showModal({ title: '上云失败', content: '网络异常或数据库权限错误', showCancel: false })
    }
  }).catch(() => {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
  })
}
</script>

<style scoped> 
.certify-page { padding: 30rpx; } 
.tips { margin-bottom: 20rpx; font-size: 26rpx; color: #666; } 
.form-box { padding: 40rpx; margin-bottom: 40rpx; background: #fff; border-radius: 12rpx; } 
</style>