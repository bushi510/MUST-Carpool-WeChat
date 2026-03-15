<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { useRideStore } from '@/stores/ride'

onLaunch(() => {
  const userStore = useUserStore()
  const rideStore = useRideStore()
  userStore.init()
  rideStore.init()
})
</script>

<style lang="scss">
/* 标签选择器已清理完毕，所有页面顶级容器请使用 class="pc-page" */
</style>