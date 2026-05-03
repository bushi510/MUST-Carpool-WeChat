// utils/request.js — 统一请求封装
// 注意：如果是在电脑微信开发者工具模拟器中测试，可以使用 127.0.0.1。
// 如果是扫码在【手机真机】上测试，必须将 127.0.0.1 替换为你电脑此时真实的局域网 IPv4 地址（如 10.6.12.59）。
//本地ipv4地址在终端输入ipconfig查看
const BASE_URL = 'http://127.0.0.1:5000'

export function request(method, path, data = {}) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + path,
      method,
      data,
      header: { 'Content-Type': 'application/json' },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(new Error(`HTTP ${res.statusCode}`))
        }
      },
      fail: (err) => reject(err)
    })
  })
}

// 语义化方法
export const post = (path, data) => request('POST', path, data)
export const get  = (path)       => request('GET',  path)


