"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://127.0.0.1:5000";
function request(method, path, data = {}) {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: BASE_URL + path,
      method,
      data,
      header: { "Content-Type": "application/json" },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      },
      fail: (err) => reject(err)
    });
  });
}
const post = (path, data) => request("POST", path, data);
exports.post = post;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
