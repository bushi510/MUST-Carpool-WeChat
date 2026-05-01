"""
models.py — SQLite 数据模型（建表 + 示例数据）
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "carpool.db")


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_conn()
    c = conn.cursor()

    c.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            name          TEXT NOT NULL,
            phone         TEXT UNIQUE NOT NULL,
            avatar        TEXT DEFAULT '',
            role          TEXT DEFAULT 'passenger',
            credit_score  INTEGER DEFAULT 100,
            certified     INTEGER DEFAULT 0
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS routes (
            id      INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            start   TEXT NOT NULL,
            end     TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS history (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER NOT NULL,
            start      TEXT NOT NULL,
            end        TEXT NOT NULL,
            hour       INTEGER NOT NULL,
            weekday    INTEGER NOT NULL,
            success    INTEGER NOT NULL,
            created_at TEXT DEFAULT (datetime('now','localtime')),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS ride_publish (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id          INTEGER NOT NULL,
            start            TEXT NOT NULL,
            end              TEXT NOT NULL,
            start_lat        REAL,
            start_lng        REAL,
            end_lat          REAL,
            end_lng          REAL,
            departure_time   TEXT NOT NULL,
            seats            INTEGER DEFAULT 4,
            price            REAL NOT NULL,
            status           TEXT DEFAULT 'recruiting',
            created_at       TEXT DEFAULT (datetime('now','localtime')),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            ride_publish_id  INTEGER NOT NULL,
            passenger_id     INTEGER NOT NULL,
            seats            INTEGER DEFAULT 1,
            status           TEXT DEFAULT 'pending',
            total_price      REAL NOT NULL,
            created_at       TEXT DEFAULT (datetime('now','localtime')),
            FOREIGN KEY (ride_publish_id) REFERENCES ride_publish(id),
            FOREIGN KEY (passenger_id) REFERENCES users(id)
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS wallets (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id          INTEGER UNIQUE NOT NULL,
            balance          REAL DEFAULT 0,
            frozen_balance   REAL DEFAULT 0,
            updated_at       TEXT DEFAULT (datetime('now','localtime')),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS certifications (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id          INTEGER UNIQUE NOT NULL,
            real_name        TEXT NOT NULL,
            license_plate    TEXT NOT NULL,
            vehicle_model    TEXT NOT NULL,
            status           TEXT DEFAULT 'pending',
            submit_time      TEXT DEFAULT (datetime('now','localtime')),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    conn.commit()

    if c.execute("SELECT COUNT(*) FROM users").fetchone()[0] == 0:
        c.execute("INSERT INTO users (name, phone, role, credit_score, certified) VALUES ('张三','13800000001','driver',85,1)")
        c.execute("INSERT INTO users (name, phone, role, credit_score, certified) VALUES ('李四','13800000002','passenger',90,0)")
        c.execute("INSERT INTO users (name, phone, role, credit_score, certified) VALUES ('王五','13800000003','driver',75,1)")

        c.execute("INSERT INTO routes (user_id, start, end) VALUES (1,'科技园南区','高铁站')")
        c.execute("INSERT INTO routes (user_id, start, end) VALUES (1,'高铁站','科技园南区')")
        c.execute("INSERT INTO routes (user_id, start, end) VALUES (2,'大学城','体育中心')")

        sample = [
            (1, "科技园南区", "高铁站", 8, 0, 1),
            (1, "科技园南区", "高铁站", 8, 1, 1),
            (1, "科技园南区", "高铁站", 8, 2, 1),
            (1, "科技园南区", "高铁站", 8, 3, 0),
            (1, "科技园南区", "高铁站", 8, 4, 1),
            (1, "科技园南区", "高铁站", 9, 0, 1),
            (1, "科技园南区", "高铁站", 9, 1, 0),
            (2, "大学城",     "体育中心", 18, 5, 1),
            (2, "大学城",     "体育中心", 18, 6, 0),
            (2, "大学城",     "体育中心", 17, 5, 1),
        ]
        c.executemany(
            "INSERT INTO history (user_id, start, end, hour, weekday, success) VALUES (?,?,?,?,?,?)",
            sample,
        )

        c.execute("INSERT INTO wallets (user_id, balance) VALUES (1, 500.00)")
        c.execute("INSERT INTO wallets (user_id, balance) VALUES (2, 150.00)")
        c.execute("INSERT INTO wallets (user_id, balance) VALUES (3, 300.00)")

        c.execute("INSERT INTO certifications (user_id, real_name, license_plate, vehicle_model, status) VALUES (1,'张三','粤A88888','丰田凯美瑞','approved')")
        c.execute("INSERT INTO certifications (user_id, real_name, license_plate, vehicle_model, status) VALUES (3,'王五','粤B12345','本田雅阁','pending')")

        c.execute("INSERT INTO ride_publish (user_id, start, end, start_lat, start_lng, end_lat, end_lng, departure_time, seats, price, status) VALUES (1,'科技园南区','高铁站',22.5431,114.0579,22.6153,114.1234,'2026-04-30 08:00',3,25.00,'recruiting')")
        c.execute("INSERT INTO ride_publish (user_id, start, end, start_lat, start_lng, end_lat, end_lng, departure_time, seats, price, status) VALUES (3,'大学城','体育中心',23.1201,113.3442,23.1456,113.3890,'2026-04-30 18:30',2,30.00,'recruiting')")

        c.execute("INSERT INTO orders (ride_publish_id, passenger_id, seats, status, total_price) VALUES (1,2,2,'completed',50.00)")
        c.execute("INSERT INTO orders (ride_publish_id, passenger_id, seats, status, total_price) VALUES (2,1,1,'pending',30.00)")

        conn.commit()

    conn.close()


# ── 数据库查询工具函数 ────────────────────────────────────────────────────────

def get_user_by_phone(phone: str):
    """根据手机号获取用户"""
    conn = get_conn()
    user = conn.execute("SELECT * FROM users WHERE phone=?", (phone,)).fetchone()
    conn.close()
    return dict(user) if user else None


def get_user_orders(user_id: int, status: str = None):
    """获取用户的订单列表"""
    conn = get_conn()
    if status:
        rows = conn.execute("""
            SELECT o.*, r.start as ride_start, r.end as ride_end, r.departure_time, u.name as driver_name
            FROM orders o
            JOIN ride_publish r ON o.ride_publish_id = r.id
            JOIN users u ON r.user_id = u.id
            WHERE o.passenger_id=? AND o.status=?
            ORDER BY o.created_at DESC
        """, (user_id, status)).fetchall()
    else:
        rows = conn.execute("""
            SELECT o.*, r.start as ride_start, r.end as ride_end, r.departure_time, u.name as driver_name
            FROM orders o
            JOIN ride_publish r ON o.ride_publish_id = r.id
            JOIN users u ON r.user_id = u.id
            WHERE o.passenger_id=?
            ORDER BY o.created_at DESC
        """, (user_id,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_user_balance(user_id: int):
    """获取用户余额"""
    conn = get_conn()
    wallet = conn.execute("SELECT * FROM wallets WHERE user_id=?", (user_id,)).fetchone()
    conn.close()
    return dict(wallet) if wallet else {"balance": 0, "frozen_balance": 0}


def get_user_certification(user_id: int):
    """获取用户认证信息"""
    conn = get_conn()
    cert = conn.execute("SELECT * FROM certifications WHERE user_id=?", (user_id,)).fetchone()
    conn.close()
    return dict(cert) if cert else None


def get_user_published_rides(user_id: int, status: str = None):
    """获取用户发布的行程"""
    conn = get_conn()
    if status:
        rows = conn.execute("SELECT * FROM ride_publish WHERE user_id=? AND status=?", (user_id, status)).fetchall()
    else:
        rows = conn.execute("SELECT * FROM ride_publish WHERE user_id=?", (user_id,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_user_info(user_id: int):
    """获取用户完整信息"""
    conn = get_conn()
    user = conn.execute("SELECT id, name, phone, role, credit_score, certified FROM users WHERE id=?", (user_id,).fetchone())
    conn.close()
    return dict(user) if user else None
