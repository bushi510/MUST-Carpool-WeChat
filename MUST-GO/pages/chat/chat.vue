<template>
  <view class="chat-page">


    <scroll-view scroll-y class="msg-list" :scroll-into-view="bottomId" scroll-with-animation>
      <view v-for="msg in msgs" :key="msg.id" :class="['msg-row', msg.isMe ? 'me' : 'other']">
        <view v-if="!msg.isMe" class="avatar">
          <uni-icons type="person-filled" size="24" color="#fff"></uni-icons>
        </view>
        
        <view class="bubble-container">
          <text v-if="!msg.isMe" class="user-name">队友</text>
          <view class="bubble">{{ msg.text }}</view>
        </view>

        <view v-if="msg.isMe" class="avatar my-avatar">
          <uni-icons type="person-filled" size="24" color="#fff"></uni-icons>
        </view>
      </view>
      <view id="bottom-mark" style="height: 50rpx;"></view>
    </scroll-view>
    
    <view class="input-bar modern-card">
      <view class="input-wrapper">
        <uni-easyinput v-model="inputVal" placeholder="发消息..." :clearable="false" :inputBorder="false" />
      </view>
      <button class="send-btn" @click="send">发送</button>
    </view>
  </view>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'

const inputVal = ref('')
const bottomId = ref('')
const currentRideId = ref(null)
// 1. 这里必须是空数组，不能有假数据
const msgs = ref([]) 

const currentUserId = ref('')
let watcher = null

onLoad((options) => {
  const userInfo = uni.getStorageSync('userInfo')
  // ✨ 将后面的随机数替换为固定的字符串 'test_user_001'
  currentUserId.value = userInfo && userInfo._id ? userInfo._id : 'test_user_001'
// ...

  if (options.rideId) {
    currentRideId.value = options.rideId
    // 2. 开启微信云数据库监听
    startWatch()
  } else {
    uni.showToast({ title: '缺少行程参数', icon: 'none' })
  }
})

onUnload(() => {
  if (watcher) watcher.close()
})

const startWatch = () => {
  const db = wx.cloud.database()
  watcher = db.collection('chat_messages')
    .where({
      ride_id: currentRideId.value
    })
    .orderBy('create_time', 'asc')
    .watch({
      onChange: (snapshot) => {
        const newMsgs = snapshot.docs.map(doc => {
          return {
            id: doc._id,
            text: doc.content,
            isMe: doc.sender_id === currentUserId.value
          }
        })

        // 3. 把云端拉下来的真实数据展示出来
        msgs.value = [
          { id: 'sys', text: '大家可以在这里沟通上车地点', isMe: false },
          ...newMsgs
        ]
        scrollToBottom()
      },
      onError: (err) => {
        console.error('监听失败:', err)
      }
    })
}

const scrollToBottom = () => {
  nextTick(() => {
    bottomId.value = ''
    setTimeout(() => { bottomId.value = 'bottom-mark' }, 100)
  })
}

const send = async () => {
  if (!inputVal.value.trim()) return

  const textToSend = inputVal.value
  inputVal.value = '' 

  try {
    const db = wx.cloud.database()
    // 4. 将消息真正写入微信云数据库
    await db.collection('chat_messages').add({
      data: {
        ride_id: currentRideId.value,
        sender_id: currentUserId.value,
        content: textToSend,
        create_time: Date.now()
      }
    })
  } catch (e) {
    uni.showToast({ title: '发送失败', icon: 'none' })
    inputVal.value = textToSend 
    console.error('发送错误:', e)
  }
}
</script>

<style lang="scss" scoped>
.chat-page { 
  height: 100vh; 
  display: flex; 
  flex-direction: column; 
  background: #ededed; 
}

.msg-list { 
  flex: 1; 
  padding: 30rpx 40rpx;
  box-sizing: border-box;
}

.msg-row { 
  display: flex; 
  margin-bottom: 40rpx; 
  position: relative; 
  align-items: flex-start;
}

.avatar { 
  width: 85rpx;
  height: 85rpx;
  border-radius: 10rpx; 
  background: #ccc;
  flex-shrink: 0;
  display: flex;
  align-items: center; 
  justify-content: center;
  overflow: hidden;
}

.bubble { 
  padding: 20rpx 24rpx; 
  font-size: 30rpx; 
  max-width: 460rpx;
  word-break: break-all; 
  border-radius: 10rpx;
  position: relative;
  line-height: 1.5;
}

.msg-row.other {
  .avatar { margin-right: 25rpx; }
  .bubble { 
    background: #ffffff; 
    &::after {
      content: ''; position: absolute; width: 0; height: 0;
      left: -12rpx; top: 24rpx;
      border-top: 10rpx solid transparent;
      border-bottom: 10rpx solid transparent;
      border-right: 12rpx solid #ffffff;
    }
  }
}

.msg-row.me {
  justify-content: flex-end;
  .avatar { 
    margin-left: 25rpx; 
    order: 2;
  }
  .bubble { 
    background: #95ec69; 
    order: 1;
    &::after {
      content: ''; position: absolute; width: 0; height: 0;
      right: -12rpx; top: 24rpx;
      border-top: 10rpx solid transparent;
      border-bottom: 10rpx solid transparent;
      border-left: 12rpx solid #95ec69;
    }
  }
}

.input-bar {
  display: flex; 
  align-items: center; 
  padding: 20rpx 30rpx 60rpx;
  background: #f7f7f7; 
  border-top: 1rpx solid #ddd; 
  gap: 20rpx;
}
.input-wrapper { 
  flex: 1; 
  background: #fff; 
  border-radius: 8rpx; 
  padding: 10rpx 20rpx; 
}
.send-btn { 
  width: 120rpx; 
  height: 75rpx; 
  line-height: 75rpx; 
  font-size: 26rpx; 
  background: #07c160; 
  color: #fff; 
  margin: 0;
}
</style>