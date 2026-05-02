<template>
  <view class="wallet-page">
    <view class="tips text-sub">上传收款码或凭证，上传后可点击图片更换。</view>
    
    <view class="modern-card upload-box" @click="chooseImage">
      <image v-if="displayPath" :src="displayPath" mode="aspectFit" class="preview-img"></image>
      <view v-else class="placeholder">
        <uni-icons type="camera-filled" size="50" color="#c0c4cc"></uni-icons>
        <text class="placeholder-text">点击上传收款码</text>
      </view>
    </view>

    <button class="modern-btn" style="width: 100%; margin-top: 40rpx;" @click="submitUpload" :disabled="!tempImagePath || isUploading">
      {{ isUploading ? '处理中...' : (hasOldRecord ? '更新图片' : '确认上传') }}
    </button>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const tempImagePath = ref('') // 刚选的本地图
const cloudFileID = ref('')   // 云端存的旧图ID
const hasOldRecord = ref(false) // 数据库是否已有记录
const isUploading = ref(false)

// 计算最终显示的路径
const displayPath = computed(() => tempImagePath.value || cloudFileID.value)

// 页面加载时：检查云端是否已经传过图
onMounted(async () => {
  const db = wx.cloud.database()
  try {
    const res = await db.collection('wallet_records').where({
      _openid: '{openid}' // 微信会自动识别当前用户
    }).get()
    
    if (res.data.length > 0) {
      cloudFileID.value = res.data[0].imageFileID
      hasOldRecord.value = true
      // 如果已上传，确保本地 store 状态也是正确的
      userStore.userInfo.walletUploaded = true
    }
  } catch (e) {
    console.error('获取旧记录失败', e)
  }
})

const chooseImage = () => {
  uni.chooseMedia({
    count: 1,
    mediaType: ['image'],
    success: (res) => {
      tempImagePath.value = res.tempFiles[0].tempFilePath
    }
  })
}

const submitUpload = async () => {
  if (!tempImagePath.value) return
  isUploading.value = true
  uni.showLoading({ title: '正在同步至云端...' })

  try {
    // 1. 上传图片到云存储
    const cloudPath = `wallet/${Date.now()}-${Math.floor(Math.random()*1000)}.png`
    const uploadRes = await wx.cloud.uploadFile({
      cloudPath,
      filePath: tempImagePath.value
    })

    const db = wx.cloud.database()
    const newFileID = uploadRes.fileID

    // 2. 更新或新增数据库记录
    if (hasOldRecord.value) {
      // 如果已有记录，则更新（用 where 找到自己的记录）
      await wx.cloud.callFunction({
        name: 'quickstartFunctions', // 如果没写云函数，可直接用 db 操作，但权限需设为所有人可读写
        data: { type: 'updateWallet', fileID: newFileID }
      }).catch(async () => {
        // 兜底方案：直接操作数据库（需确保权限开启）
        const record = await db.collection('wallet_records').where({ _openid: '{openid}' }).get()
        await db.collection('wallet_records').doc(record.data[0]._id).update({
          data: { imageFileID: newFileID, updateTime: new Date() }
        })
      })
    } else {
      // 如果没有记录，则新增
      await db.collection('wallet_records').add({
        data: { imageFileID: newFileID, uploadTime: new Date() }
      })
    }

    // 3. 更新本地全局状态
    userStore.userInfo.walletUploaded = true
    
    uni.hideLoading()
    uni.showToast({ title: '保存成功' })
    setTimeout(() => uni.navigateBack(), 1500)

  } catch (err) {
    uni.hideLoading()
    isUploading.value = false
    console.error('操作失败', err)
    uni.showModal({ title: '保存失败', content: '请重试', showCancel: false })
  }
}
</script>

<style scoped>
.wallet-page { padding: 30rpx; }
.upload-box { 
  background: #fdfdfd; border: 2rpx dashed #ddd; height: 450rpx;
  display: flex; justify-content: center; align-items: center; border-radius: 20rpx;
}
.preview-img { width: 100%; height: 100%; border-radius: 20rpx; }
.placeholder { text-align: center; color: #999; }
</style>