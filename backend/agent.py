# -*- coding: utf-8 -*-
"""
agent.py — LangChain + DeepSeek 智能对话（集成数据库查询）
"""
import os
import re
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from prediction import RULE_TEXT  # type: ignore[import]
from models import get_user_by_phone, get_user_orders, get_user_balance, get_user_certification, get_user_published_rides, get_user_info
from wechat_cloud import get_latest_cloud_rides

_prompt = ChatPromptTemplate.from_messages([
    ("system", RULE_TEXT),
    ("human", "{question}"),
])

_chain = None  # 懒加载，首次调用时初始化


def _get_chain():
    """获取基础对话链（不带工具）"""
    global _chain
    if _chain is None:
        api_key = os.getenv("DEEPSEEK_API_KEY", "")
        llm = ChatOpenAI(
            model="deepseek-chat",
            api_key=api_key,
            base_url="https://api.deepseek.com/v1",
            temperature=0.3,
        )
        _chain = _prompt | llm | StrOutputParser()
    return _chain


def _get_phone_from_question(question: str) -> str:
    """从问题中提取手机号（简单匹配任意连续11位数字）"""
    match = re.search(r'\d{11}', question)
    return match.group() if match else None


def _query_user_info(phone: str) -> str:
    """查询用户信息工具"""
    user = get_user_by_phone(phone)
    if not user:
        return f"未找到手机号为 {phone} 的用户"

    info = f"用户信息：\n"
    info += f"- 姓名：{user['name']}\n"
    info += f"- 手机：{user['phone']}\n"
    info += f"- 角色：{'司机' if user['role'] == 'driver' else '乘客'}\n"
    info += f"- 信用分：{user['credit_score']}\n"
    info += f"- 认证状态：{'已认证' if user['certified'] else '未认证'}"
    return info


def _query_user_orders(phone: str, status: str = None) -> str:
    """查询用户订单工具"""
    user = get_user_by_phone(phone)
    if not user:
        return f"未找到手机号为 {phone} 的用户"

    orders = get_user_orders(user['id'], status)
    if not orders:
        return f"用户 {user['name']} 暂无订单"

    result = f"用户 {user['name']} 的订单列表（共 {len(orders)} 条）：\n"
    for i, order in enumerate(orders, 1):
        status_map = {'pending': '待支付', 'paid': '已支付', 'completed': '已完成', 'cancelled': '已取消'}
        result += f"\n{i}. {order['ride_start']} → {order['ride_end']}\n"
        result += f"   司机：{order['driver_name']} | 出发时间：{order['departure_time']}\n"
        result += f"   座位：{order['seats']} | 价格：¥{order['total_price']}\n"
        result += f"   状态：{status_map.get(order['status'], order['status'])}\n"
    return result


def _query_user_balance(phone: str) -> str:
    """查询用户余额工具"""
    user = get_user_by_phone(phone)
    if not user:
        return f"未找到手机号为 {phone} 的用户"

    wallet = get_user_balance(user['id'])
    return f"用户 {user['name']} 的钱包信息：\n- 可用余额：¥{wallet['balance']:.2f}\n- 冻结金额：¥{wallet['frozen_balance']:.2f}"


def _query_user_certification(phone: str) -> str:
    """查询用户认证信息工具"""
    user = get_user_by_phone(phone)
    if not user:
        return f"未找到手机号为 {phone} 的用户"

    cert = get_user_certification(user['id'])
    if not cert:
        return f"用户 {user['name']} 尚未提交认证申请"

    status_map = {'pending': '审核中', 'approved': '已通过', 'rejected': '已拒绝'}
    return f"用户 {user['name']} 的认证信息：\n- 真实姓名：{cert['real_name']}\n- 车牌号：{cert['license_plate']}\n- 车辆型号：{cert['vehicle_model']}\n- 认证状态：{status_map.get(cert['status'], cert['status'])}\n- 提交时间：{cert['submit_time']}"


def _query_user_published_rides(phone: str) -> str:
    """查询用户发布的行程工具"""
    user = get_user_by_phone(phone)
    if not user:
        return f"未找到手机号为 {phone} 的用户"

    rides = get_user_published_rides(user['id'])
    if not rides:
        return f"用户 {user['name']} 尚未发布任何行程"

    result = f"用户 {user['name']} 发布的行程列表（共 {len(rides)} 条）：\n"
    status_map = {'recruiting': '招募中', 'full': '已满', 'completed': '已完成', 'cancelled': '已取消'}
    for i, ride in enumerate(rides, 1):
        result += f"\n{i}. {ride['start']} → {ride['end']}\n"
        result += f"   出发时间：{ride['departure_time']}\n"
        result += f"   剩余座位：{ride['seats']} | 价格：¥{ride['price']}\n"
        result += f"   状态：{status_map.get(ride['status'], ride['status'])}\n"
    return result


def _get_cloud_rides_context() -> str:
    """获取最新的云端真实拼车信息，提供给大模型参考"""
    try:
        rides = get_latest_cloud_rides(limit=5)
        if not rides:
            return "当前云端数据库中暂无最新的拼车招募信息。"
            
        result = "以下是当前微信云数据库中最新发布的拼车行程列表，供参考：\n"
        for i, ride in enumerate(rides, 1):
            result += f"[{i}] {ride.get('start')} -> {ride.get('end')}，"
            result += f"出发时间：{ride.get('time')}，"
            result += f"剩余座位：{ride.get('seats')}个，价格：¥{ride.get('price')} (司机：{ride.get('driver')})\n"
        return result
    except Exception as e:
        return f"获取云端行程数据失败：{e}"


def chat(question: str) -> str:
    """主对话函数"""
    api_key = os.getenv("DEEPSEEK_API_KEY", "")
    if not api_key:
        return "错误：未配置 DEEPSEEK_API_KEY，请在 .env 文件中填入您的 API Key。"

    phone = _get_phone_from_question(question)

    # 如果问题包含手机号且涉及订单、余额、认证查询，使用工具
    if phone:
        if any(keyword in question for keyword in ['订单', 'order', '行程', 'ride']):
            return _query_user_orders(phone)
        elif any(keyword in question for keyword in ['余额', 'balance', '钱包', 'wallet']):
            return _query_user_balance(phone)
        elif any(keyword in question for keyword in ['认证', 'certification', '审核', 'approve']):
            return _query_user_certification(phone)
        elif any(keyword in question for keyword in ['发布', 'publish', '我的行程', 'my rides']):
            return _query_user_published_rides(phone)
        elif any(keyword in question for keyword in ['信息', 'info', '用户', 'user', '资料']):
            return _query_user_info(phone)

    # 其他问题使用普通对话
    try:
        # 如果是寻车、查行程需求，抓取微信云数据库的数据附加给 AI
        if any(keyword in question for keyword in ['拼车', '行程', '车', '去', '回', '路线', '有']):
            cloud_context = _get_cloud_rides_context()
            enhanced_question = f"用户问题：{question}\n\n【系统提示：你可以参考以下最新云端数据来回答，如果云端有符合用户需求的行程，请主动推荐】\n{cloud_context}"
            return _get_chain().invoke({"question": enhanced_question})
        else:
            return _get_chain().invoke({"question": question})
    except Exception as e:
        err = str(e)
        if "402" in err or "balance" in err.lower() or "insufficient" in err.lower():
            return "错误：DeepSeek 账户余额不足，请前往 https://platform.deepseek.com 充值。"
        if "401" in err or "authentication" in err.lower():
            return "错误：API Key 无效，请检查 .env 文件中的 DEEPSEEK_API_KEY。"
        return f"错误：{err}"
