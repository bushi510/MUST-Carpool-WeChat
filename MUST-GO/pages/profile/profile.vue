<template>
  <view class="pc-page pc-box profile-page">
    <view class="header-bg"></view>
    <view class="user-card modern-card" @click="checkLogin">
      
      <view class="avatar-placeholder">
        <uni-icons type="person-filled" size="50" color="#fff"></uni-icons>
      </view>

      <view class="info">
        <text class="name font-bold">{{ userStore.isLogged ? userStore.userInfo.name : '点击登录' }}</text>
        <view class="tags" v-if="userStore.isLogged">
          <uni-tag :text="`信用分 ${userStore.userInfo.creditScore}`" type="success" size="small" circle />
          <uni-tag :text="userStore.userInfo.isCertified ? '已认证学生' : '未认证'":type="userStore.userInfo.isCertified ? 'primary' : 'default'" size="small" circle style="margin-left: 10rpx;" />
        </view>
      </view>
    </view>
    
    <view class="menu-list modern-card">
      <uni-list :border="false">
        <uni-list-item title="学生认证" clickable showArrow showExtraIcon :extraIcon="{type: 'vip', size: '22', color: '#00C853'}" @click="navTo('/pages/certify/certify')" />
        
        <uni-list-item 
          title="我的钱包" 
          clickable 
          showArrow 
          showExtraIcon 
          :extraIcon="{type: 'wallet', size: '22', color: '#00C853'}" 
          :rightText="userStore.isLogged && userStore.userInfo.walletUploaded ? '已上传' : '未上传'" 
          @click="navTo('/pages/wallet/wallet')" 
        />
        
        <uni-list-item title="联系客服" clickable showArrow showExtraIcon :extraIcon="{type: 'headphones', size: '22', color: '#00C853'}" @click="navTo('/pages/service/service')" />
      </uni-list>
    </view>
    
    <button v-if="userStore.isLogged" class="modern-btn logout-btn" @click="handleLogout">退出登录</button>
  </view>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

const checkLogin = () => { if (!userStore.isLogged) uni.navigateTo({ url: '/pages/login/login' }) }
const navTo = (url) => { if (userStore.isLogged) uni.navigateTo({ url }); else checkLogin() }

const handleLogout = () => {
  uni.showModal({
    title: '提示', content: '确定要退出登录吗？',
    success: (res) => { if (res.confirm) userStore.logout() }
  })
}
</script>

<style lang="scss" scoped>
.profile-page { padding: 30rpx; position: relative; }
.header-bg { position: absolute; top: 0; left: 0; width: 100%; height: 300rpx; background: linear-gradient(135deg, #00C853, #00E676); z-index: 0; border-radius: 0 0 50rpx 50rpx; }
.user-card { position: relative; z-index: 1; display: flex; align-items: center; padding: 40rpx; margin-top: 60rpx; margin-bottom: 40rpx; }
.avatar-placeholder { width: 120rpx; height: 120rpx; border-radius: 50%; margin-right: 30rpx; border: 4rpx solid #fff; background-color: #ccc; display: flex; align-items: center; justify-content: center; }
.info { display: flex; flex-direction: column; gap: 10rpx; }
.name { font-size: 40rpx; }
.tags { display: flex; }
.menu-list { margin-bottom: 60rpx; padding: 10rpx 0; }
.logout-btn { background: var(--pc-card-bg); color: #ff5252; box-shadow: var(--pc-shadow); }
</style>