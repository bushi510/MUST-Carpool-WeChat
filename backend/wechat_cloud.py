import os
import json
import urllib.request
import urllib.error
import time
from dotenv import load_dotenv

load_dotenv()

# 从 .env 读取配置
WECHAT_APPID = os.getenv("WECHAT_APPID", "")
WECHAT_APPSECRET = os.getenv("WECHAT_APPSECRET", "")
CLOUD_ENV = "cloudbase-d8gs0x2y67fedcaef" # 从前端 App.vue 中提取的环境 ID

_access_token = None
_token_expires_at = 0

def get_access_token():
    """获取微信接口调用的凭证 access_token"""
    global _access_token, _token_expires_at
    now = time.time()
    
    # 优先使用缓存的 token（2小时有效）
    if _access_token and now < _token_expires_at:
        return _access_token
        
    if not WECHAT_APPID or not WECHAT_APPSECRET:
        raise ValueError("请在 backend/.env 中配置 WECHAT_APPID 和 WECHAT_APPSECRET")
        
    url = f"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={WECHAT_APPID}&secret={WECHAT_APPSECRET}"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            if 'access_token' in data:
                _access_token = data['access_token']
                # 提前一分钟过期（微信 token 有效期 7200 秒）
                _token_expires_at = now + data['expires_in'] - 60
                return _access_token
            else:
                raise Exception(f"获取 token 失败: {data}")
    except Exception as e:
        raise Exception(f"获取微信 Access Token 请求失败: {e}")

def query_cloud_database(query_str: str):
    """
    通过 HTTP API 查询云开发数据库
    例如 query_str: 'db.collection("ride_list").limit(10).get()'
    """
    token = get_access_token()
    url = f"https://api.weixin.qq.com/tcb/databasequery?access_token={token}"
    
    payload = {
        "env": CLOUD_ENV,
        "query": query_str
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    
    try:
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode('utf-8'))
            if res.get('errcode') == 0:
                # 微信返回的 data 是一个包含 JSON 字符串的数组，需要额外解析一次
                parsed_data = [json.loads(item) for item in res.get('data', [])]
                return parsed_data
            else:
                raise Exception(f"查询失败: {res}")
    except Exception as e:
        print(f"云数据库查询出错: {e}")
        return []

def get_latest_cloud_rides(limit=10):
    """获取最新发布的行程"""
    query = f'db.collection("ride_list").orderBy("createTime", "desc").limit({limit}).get()'
    return query_cloud_database(query)
