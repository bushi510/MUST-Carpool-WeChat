<template>
  <view class="pc-page pc-box wallet-page">
    <view class="balance-card modern-card">
      <text class="label text-sub">总余额 (元)</text>
      <text class="amount text-primary font-bold">0.00</text>
      
      <view class="action-group">
        <button class="modern-btn action-btn" @click="handleAction('充值')">充值</button>
        <button class="modern-btn action-btn outline" @click="handleAction('提现')">提现</button>
      </view>
    </view>

    <view class="history-section">
      <text class="section-title text-main font-bold">账单明细</text>
      <view class="empty-state">
        <uni-icons type="wallet" size="50" color="#ccc"></uni-icons>
        <text class="text-sub mt-20">暂无交易记录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
const handleAction = (type) => {
  uni.showToast({ title: `${type}功能开发中`, icon: 'none' })
}
</script>

<style lang="scss" scoped>
.wallet-page { padding: 30rpx; }
.balance-card { padding: 60rpx 40rpx; display: flex; flex-direction: column; align-items: center; text-align: center; background: linear-gradient(to bottom, #f0fdf4, #ffffff); border: 1px solid var(--pc-border); }
.label { font-size: 28rpx; }
.amount { font-size: 80rpx; margin: 20rpx 0 40rpx; }
.action-group { display: flex; gap: 30rpx; width: 100%; justify-content: center; }
.action-btn { width: 45%; height: 80rpx; line-height: 80rpx; font-size: 30rpx; margin: 0; }
.action-btn.outline { background: transparent; color: var(--pc-primary); border: 2rpx solid var(--pc-primary); box-shadow: none; }

.history-section { margin-top: 60rpx; }
.section-title { font-size: 32rpx; margin-bottom: 30rpx; display: block; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100rpx 0; }
.mt-20 { margin-top: 20rpx; }
</style>