<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { useRideStore } from '@/stores/ride'

onLaunch(() => {
  // ✨ 第一步：必须先初始化微信云开发环境！
  if (!wx.cloud) {
    console.error('请使用 2.2.3 或以上的基础库以使用云能力')
  } else {
    wx.cloud.init({
      env: 'cloudbase-d8gs0x2y67fedcaef', 
      traceUser: true,
    })
  }

  // ✨ 第二步：云环境准备就绪后，再初始化 Store 和拉取数据
  const userStore = useUserStore()
  const rideStore = useRideStore()
  userStore.init()
  rideStore.init()
})
</script>

<style lang="scss">
/* 标签选择器已清理完毕，所有页面顶级容器请使用 class="pc-page" */
</style>