<template>
  <view class="chat-page">
    <scroll-view scroll-y class="msg-list" :scroll-into-view="bottomId">
      <view v-for="msg in msgs" :key="msg.id" :class="['msg-row', msg.isMe ? 'me' : 'other']">
        <view class="bubble modern-card">{{ msg.text }}</view>
      </view>
      <view id="bottom-mark" style="height: 20rpx;"></view>
    </scroll-view>
    
    <view class="input-bar modern-card">
      <uni-easyinput v-model="inputVal" placeholder="发消息..." :clearable="false" />
      <button class="modern-btn send-btn" @click="send">发送</button>
    </view>
  </view>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const inputVal = ref('')
const bottomId = ref('')
const msgs = ref([
  { id: 1, text: '你好，拼车还在吗？', isMe: true },
  { id: 2, text: '在的，随时可以预订', isMe: false }
])

const send = () => {
  if (!inputVal.value.trim()) return
  msgs.value.push({ id: Date.now(), text: inputVal.value, isMe: true })
  inputVal.value = ''
  nextTick(() => { bottomId.value = 'bottom-mark' })
}
</script>

<style lang="scss" scoped>
.chat-page { height: 100vh; display: flex; flex-direction: column; background: var(--pc-bg); }
.msg-list { flex: 1; padding: 30rpx; }
.msg-row { display: flex; margin-bottom: 40rpx; }
.msg-row.me { justify-content: flex-end; }
.bubble { padding: 20rpx 30rpx; max-width: 70%; word-break: break-all; }
.msg-row.me .bubble { background: var(--pc-primary); color: #fff; }
.input-bar { display: flex; padding: 20rpx 30rpx 60rpx; gap: 20rpx; border-radius: 40rpx 40rpx 0 0; }
.send-btn { width: 140rpx; height: 72rpx; line-height: 72rpx; font-size: 28rpx; margin: 0; }
</style>