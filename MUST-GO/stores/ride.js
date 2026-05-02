import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRideStore = defineStore('ride', () => {
  // 默认 Mock 数据，防止云端没数据时页面空白
  const defaultRides = [
    { id: 101, driver: '张师傅', start: '科技园南区', end: '高铁站', time: '14:30', seats: 2, price: 25, status: 'recruiting' },
    { id: 102, driver: '李女士', start: '市中心广场', end: '机场', time: '15:00', seats: 3, price: 40, status: 'recruiting' }
  ]

  const rides = ref([])
  const userOrders = ref([])

  // 初始化：从云数据库拉取真实数据
  const init = async () => {
    try {
      const db = wx.cloud.database()
      // 按创建时间倒序排列，获取最新的行程
      const res = await db.collection('ride_list').orderBy('createTime', 'desc').get()
      
      if (res.data && res.data.length > 0) {
        rides.value = res.data
      } else {
        rides.value = defaultRides
      }
    } catch (e) {
      console.error('初始化获取云端数据失败，使用默认数据', e)
      rides.value = defaultRides
    }
  }

  // 发布行程：将数据真实存入微信云数据库 ride_list
  const publishRide = async (rideData) => {
    try {
      const db = wx.cloud.database()
      const newRide = { 
        ...rideData, 
        driver: '我(车主)', 
        status: 'recruiting',
        createTime: db.serverDate() // 使用服务器时间，避免手机时间不对导致校验失败
      }

      // 1. 核心步骤：向云数据库添加记录
      const res = await db.collection('ride_list').add({
        data: newRide
      })
      
      // 2. 将新数据同步到本地显示的列表中
      const rideWithId = { ...newRide, id: res._id }
      rides.value.unshift(rideWithId)
      userOrders.value.unshift({ ...rideWithId, orderId: `DD${Date.now()}`, orderStatus: '进行中', role: 'driver' })
      
      return true 
    } catch (e) {
      console.error('存入云数据库失败：', e)
      return false
    }
  }

  const joinRide = (rideId) => {
    const ride = rides.value.find(r => r.id === rideId)
    if (ride && ride.seats > 0) {
      ride.seats -= 1
      if (ride.seats === 0) ride.status = 'full'
      return true
    }
    return false
  }

  return { rides, userOrders, init, publishRide, joinRide }
})