-- =============================================
-- 户外俱乐部网站数据库设计
-- Database: outdoor_club
-- Version: 1.0
-- Created: 2024
-- =============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS outdoor_club DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE outdoor_club;

-- =============================================
-- 1. 用户表
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
    password VARCHAR(255) NOT NULL COMMENT '密码（加密）',
    phone VARCHAR(20) COMMENT '手机号',
    avatar VARCHAR(500) COMMENT '头像URL',
    points INT DEFAULT 0 COMMENT '积分',
    level VARCHAR(20) DEFAULT '普通会员' COMMENT '会员等级',
    is_admin TINYINT(1) DEFAULT 0 COMMENT '是否管理员（0:否, 1:是）',
    status TINYINT(1) DEFAULT 1 COMMENT '状态（0:禁用, 1:启用）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- =============================================
-- 2. 活动表
-- =============================================
CREATE TABLE IF NOT EXISTS activities (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '活动ID',
    name VARCHAR(100) NOT NULL COMMENT '活动名称',
    type ENUM('hiking', 'climbing', 'cycling', 'camping', 'mountain') NOT NULL COMMENT '活动类型',
    location VARCHAR(200) NOT NULL COMMENT '活动地点',
    description TEXT COMMENT '活动描述',
    difficulty ENUM('初级', '中等', '较高', '高', '困难') COMMENT '难度等级',
    duration VARCHAR(50) COMMENT '活动时长',
    altitude VARCHAR(50) COMMENT '海拔（仅雪山攀登）',
    height VARCHAR(50) COMMENT '高度（仅攀岩）',
    image VARCHAR(500) COMMENT '活动图片URL',
    max_participants INT COMMENT '最大参与人数',
    current_participants INT DEFAULT 0 COMMENT '当前参与人数',
    status ENUM('draft', 'published', 'closed', 'cancelled') DEFAULT 'draft' COMMENT '活动状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_type (type),
    INDEX idx_difficulty (difficulty),
    INDEX idx_status (status),
    INDEX idx_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动表';

-- =============================================
-- 3. 俱乐部表
-- =============================================
CREATE TABLE IF NOT EXISTS clubs (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '俱乐部ID',
    name VARCHAR(100) NOT NULL COMMENT '俱乐部名称',
    logo VARCHAR(500) COMMENT '俱乐部Logo URL',
    image VARCHAR(500) COMMENT '俱乐部图片URL',
    rating DECIMAL(3,2) DEFAULT 0.00 COMMENT '评分',
    review_count INT DEFAULT 0 COMMENT '评价数量',
    founded VARCHAR(50) COMMENT '成立时间',
    experience VARCHAR(50) COMMENT '经验年限',
    guides VARCHAR(100) COMMENT '向导数量',
    description TEXT COMMENT '俱乐部描述',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    contact_email VARCHAR(100) COMMENT '联系邮箱',
    address VARCHAR(500) COMMENT '地址',
    status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_status (status),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='俱乐部表';

-- =============================================
-- 4. 俱乐部路线表
-- =============================================
CREATE TABLE IF NOT EXISTS club_routes (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '路线ID',
    club_id INT NOT NULL COMMENT '俱乐部ID',
    name VARCHAR(100) NOT NULL COMMENT '路线名称',
    price DECIMAL(10,2) NOT NULL COMMENT '价格',
    description TEXT COMMENT '路线描述',
    difficulty ENUM('初级', '中等', '较高', '高', '困难') COMMENT '难度等级',
    duration VARCHAR(50) COMMENT '活动时长',
    location VARCHAR(200) COMMENT '路线地点',
    image VARCHAR(500) COMMENT '路线图片URL',
    status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    INDEX idx_club_id (club_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='俱乐部路线表';

-- =============================================
-- 5. 俱乐部优势表
-- =============================================
CREATE TABLE IF NOT EXISTS club_highlights (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '优势ID',
    club_id INT NOT NULL COMMENT '俱乐部ID',
    highlight_text VARCHAR(200) NOT NULL COMMENT '优势文本',
    sort_order INT DEFAULT 0 COMMENT '排序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    INDEX idx_club_id (club_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='俱乐部优势表';

-- =============================================
-- 6. 俱乐部向导表
-- =============================================
CREATE TABLE IF NOT EXISTS club_guides (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '向导ID',
    club_id INT NOT NULL COMMENT '俱乐部ID',
    name VARCHAR(50) NOT NULL COMMENT '向导姓名',
    experience TEXT COMMENT '经验描述',
    specialties JSON COMMENT '专长（JSON数组）',
    rating DECIMAL(3,2) DEFAULT 0.00 COMMENT '评分',
    activities INT DEFAULT 0 COMMENT '活动次数',
    certifications VARCHAR(200) COMMENT '认证资质',
    avatar VARCHAR(500) COMMENT '头像URL',
    status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    INDEX idx_club_id (club_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='俱乐部向导表';

-- =============================================
-- 7. 课程表
-- =============================================
CREATE TABLE IF NOT EXISTS courses (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '课程ID',
    name VARCHAR(100) NOT NULL COMMENT '课程名称',
    image VARCHAR(500) COMMENT '课程图片URL',
    short_description VARCHAR(500) COMMENT '简短描述',
    detailed_description TEXT COMMENT '详细描述',
    difficulty ENUM('初级', '中级', '高级') COMMENT '难度等级',
    duration VARCHAR(50) COMMENT '课程时长',
    prerequisites VARCHAR(200) COMMENT '前置要求',
    target_audience VARCHAR(200) COMMENT '目标人群',
    category VARCHAR(50) COMMENT '课程分类',
    price DECIMAL(10,2) NOT NULL COMMENT '价格',
    max_participants INT COMMENT '最大参与人数',
    current_participants INT DEFAULT 0 COMMENT '当前参与人数',
    status ENUM('draft', 'published', 'closed', 'cancelled') DEFAULT 'draft' COMMENT '课程状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_category (category),
    INDEX idx_difficulty (difficulty),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程表';

-- =============================================
-- 8. 用户活动记录表
-- =============================================
CREATE TABLE IF NOT EXISTS user_activities (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '记录ID',
    user_id INT NOT NULL COMMENT '用户ID',
    activity_id INT NOT NULL COMMENT '活动ID',
    club_id INT COMMENT '俱乐部ID',
    status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending' COMMENT '状态',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '报名日期',
    activity_date DATE COMMENT '活动日期',
    form_data JSON COMMENT '报名表单数据（JSON）',
    payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid' COMMENT '支付状态',
    payment_amount DECIMAL(10,2) COMMENT '支付金额',
    payment_time TIMESTAMP NULL COMMENT '支付时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_activity_id (activity_id),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户活动记录表';

-- =============================================
-- 9. 用户课程记录表
-- =============================================
CREATE TABLE IF NOT EXISTS user_courses (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '记录ID',
    user_id INT NOT NULL COMMENT '用户ID',
    course_id INT NOT NULL COMMENT '课程ID',
    status ENUM('pending', 'confirmed', 'learning', 'completed', 'cancelled') DEFAULT 'pending' COMMENT '状态',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '报名日期',
    start_date DATE COMMENT '开始日期',
    end_date DATE COMMENT '结束日期',
    form_data JSON COMMENT '报名表单数据（JSON）',
    payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid' COMMENT '支付状态',
    payment_amount DECIMAL(10,2) COMMENT '支付金额',
    payment_time TIMESTAMP NULL COMMENT '支付时间',
    progress INT DEFAULT 0 COMMENT '学习进度（0-100）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_course_id (course_id),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户课程记录表';

-- =============================================
-- 10. 证书表
-- =============================================
CREATE TABLE IF NOT EXISTS certificates (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '证书ID',
    user_id INT NOT NULL COMMENT '用户ID',
    course_id INT NOT NULL COMMENT '课程ID',
    certificate_number VARCHAR(100) UNIQUE NOT NULL COMMENT '证书编号',
    certificate_type ENUM('course', 'activity', 'achievement') DEFAULT 'course' COMMENT '证书类型',
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '颁发日期',
    expiry_date TIMESTAMP NULL COMMENT '过期日期',
    status ENUM('active', 'expired', 'revoked') DEFAULT 'active' COMMENT '状态',
    certificate_url VARCHAR(500) COMMENT '证书文件URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_course_id (course_id),
    INDEX idx_certificate_number (certificate_number),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='证书表';

-- =============================================
-- 11. 评价表
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '评价ID',
    user_id INT NOT NULL COMMENT '用户ID',
    activity_id INT COMMENT '活动ID',
    course_id INT COMMENT '课程ID',
    club_id INT COMMENT '俱乐部ID',
    rating TINYINT(1) NOT NULL COMMENT '评分（1-5）',
    content TEXT COMMENT '评价内容',
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT '审核状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_activity_id (activity_id),
    INDEX idx_course_id (course_id),
    INDEX idx_club_id (club_id),
    INDEX idx_rating (rating),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评价表';

-- =============================================
-- 12. AI推荐记录表
-- =============================================
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '推荐ID',
    user_id INT NOT NULL COMMENT '用户ID',
    user_info JSON COMMENT '用户信息（JSON）',
    recommendations JSON COMMENT '推荐结果（JSON）',
    recommendation_type ENUM('activity', 'route', 'course') DEFAULT 'activity' COMMENT '推荐类型',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (recommendation_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI推荐记录表';

-- =============================================
-- 13. 支付记录表
-- =============================================
CREATE TABLE IF NOT EXISTS payments (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '支付ID',
    user_id INT NOT NULL COMMENT '用户ID',
    order_type ENUM('activity', 'course', 'points') NOT NULL COMMENT '订单类型',
    order_id INT NOT NULL COMMENT '订单ID',
    amount DECIMAL(10,2) NOT NULL COMMENT '支付金额',
    payment_method ENUM('alipay', 'wechat', 'bank', 'points') NOT NULL COMMENT '支付方式',
    transaction_id VARCHAR(100) COMMENT '交易流水号',
    status ENUM('pending', 'success', 'failed', 'refunded') DEFAULT 'pending' COMMENT '支付状态',
    paid_at TIMESTAMP NULL COMMENT '支付时间',
    refunded_at TIMESTAMP NULL COMMENT '退款时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_order (order_type, order_id),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='支付记录表';

-- =============================================
-- 14. 积分记录表
-- =============================================
CREATE TABLE IF NOT EXISTS point_records (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '记录ID',
    user_id INT NOT NULL COMMENT '用户ID',
    type ENUM('recharge', 'consume', 'refund', 'reward') NOT NULL COMMENT '类型',
    amount INT NOT NULL COMMENT '积分数量',
    balance_before INT NOT NULL COMMENT '变动前余额',
    balance_after INT NOT NULL COMMENT '变动后余额',
    description VARCHAR(200) COMMENT '描述',
    related_order_type VARCHAR(50) COMMENT '关联订单类型',
    related_order_id INT COMMENT '关联订单ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='积分记录表';

-- =============================================
-- 15. 客服对话记录表
-- =============================================
CREATE TABLE IF NOT EXISTS customer_service_chats (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '对话ID',
    user_id INT COMMENT '用户ID（游客可为NULL）',
    club_id INT COMMENT '俱乐部ID',
    session_id VARCHAR(100) NOT NULL COMMENT '会话ID',
    status ENUM('active', 'closed', 'archived') DEFAULT 'active' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    closed_at TIMESTAMP NULL COMMENT '关闭时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_club_id (club_id),
    INDEX idx_session_id (session_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='客服对话记录表';

-- =============================================
-- 16. 客服消息表
-- =============================================
CREATE TABLE IF NOT EXISTS customer_service_messages (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '消息ID',
    chat_id INT NOT NULL COMMENT '对话ID',
    sender_type ENUM('user', 'service', 'system') NOT NULL COMMENT '发送者类型',
    sender_id INT COMMENT '发送者ID',
    content TEXT NOT NULL COMMENT '消息内容',
    message_type ENUM('text', 'image', 'file', 'quick_reply') DEFAULT 'text' COMMENT '消息类型',
    is_read TINYINT(1) DEFAULT 0 COMMENT '是否已读',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (chat_id) REFERENCES customer_service_chats(id) ON DELETE CASCADE,
    INDEX idx_chat_id (chat_id),
    INDEX idx_sender_type (sender_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='客服消息表';

-- =============================================
-- 17. 视频新闻表
-- =============================================
CREATE TABLE IF NOT EXISTS video_news (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '新闻ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    description TEXT COMMENT '描述',
    cover_image VARCHAR(500) COMMENT '封面图片URL',
    video_url VARCHAR(500) COMMENT '视频URL',
    video_type ENUM('upload', 'external') DEFAULT 'upload' COMMENT '视频类型',
    category VARCHAR(50) COMMENT '分类',
    author VARCHAR(50) COMMENT '作者',
    view_count INT DEFAULT 0 COMMENT '浏览次数',
    like_count INT DEFAULT 0 COMMENT '点赞次数',
    comment_count INT DEFAULT 0 COMMENT '评论次数',
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft' COMMENT '状态',
    publish_date TIMESTAMP NULL COMMENT '发布时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_publish_date (publish_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='视频新闻表';

-- =============================================
-- 18. 系统配置表
-- =============================================
CREATE TABLE IF NOT EXISTS system_configs (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '配置ID',
    config_key VARCHAR(100) UNIQUE NOT NULL COMMENT '配置键',
    config_value TEXT COMMENT '配置值',
    config_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string' COMMENT '配置类型',
    description VARCHAR(200) COMMENT '描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_config_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- =============================================
-- 19. 活动与俱乐部关联表
-- =============================================
CREATE TABLE IF NOT EXISTS activity_clubs (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '关联ID',
    activity_id INT NOT NULL COMMENT '活动ID',
    club_id INT NOT NULL COMMENT '俱乐部ID',
    price DECIMAL(10,2) COMMENT '俱乐部价格',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    UNIQUE KEY uk_activity_club (activity_id, club_id),
    INDEX idx_activity_id (activity_id),
    INDEX idx_club_id (club_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动与俱乐部关联表';

-- =============================================
-- 初始化数据
-- =============================================

-- 插入默认管理员用户
INSERT INTO users (username, email, password, points, is_admin, status) VALUES
('admin', 'mmm@qq.com', '$2b$10$YourHashedPasswordHere', 1000, 1, 1)
ON DUPLICATE KEY UPDATE email=email;

-- 插入系统配置
INSERT INTO system_configs (config_key, config_value, config_type, description) VALUES
('site_name', '户外俱乐部', 'string', '网站名称'),
('site_description', '探索自然的奇妙，开启您的户外冒险之旅', 'string', '网站描述'),
('contact_email', 'contact@outdoorclub.com', 'string', '联系邮箱'),
('contact_phone', '400-888-8888', 'string', '联系电话'),
('points_recharge_ratio', '1', 'number', '积分充值比例（1元=1积分）'),
('min_points_recharge', '100', 'number', '最小充值积分'),
('payment_methods', '["alipay", "wechat", "bank"]', 'json', '支持的支付方式')
ON DUPLICATE KEY UPDATE config_value=config_value;

-- =============================================
-- 创建视图
-- =============================================

-- 用户活动详情视图
CREATE OR REPLACE VIEW v_user_activities_detail AS
SELECT
    ua.id,
    ua.user_id,
    u.username,
    ua.activity_id,
    a.name AS activity_name,
    a.type AS activity_type,
    a.location,
    a.difficulty,
    a.duration,
    ua.club_id,
    c.name AS club_name,
    ua.status,
    ua.registration_date,
    ua.activity_date,
    ua.payment_status,
    ua.payment_amount,
    ua.form_data
FROM user_activities ua
LEFT JOIN users u ON ua.user_id = u.id
LEFT JOIN activities a ON ua.activity_id = a.id
LEFT JOIN clubs c ON ua.club_id = c.id;

-- 用户课程详情视图
CREATE OR REPLACE VIEW v_user_courses_detail AS
SELECT
    uc.id,
    uc.user_id,
    u.username,
    uc.course_id,
    co.name AS course_name,
    co.category,
    co.difficulty,
    co.duration,
    co.price,
    uc.status,
    uc.registration_date,
    uc.start_date,
    uc.end_date,
    uc.payment_status,
    uc.payment_amount,
    uc.progress,
    uc.form_data
FROM user_courses uc
LEFT JOIN users u ON uc.user_id = u.id
LEFT JOIN courses co ON uc.course_id = co.id;

-- 俱乐部统计视图
CREATE OR REPLACE VIEW v_club_statistics AS
SELECT
    c.id,
    c.name,
    c.rating,
    c.review_count,
    COUNT(DISTINCT cr.id) AS route_count,
    COUNT(DISTINCT cg.id) AS guide_count,
    COUNT(DISTINCT ua.id) AS activity_count,
    COUNT(DISTINCT r.id) AS review_count
FROM clubs c
LEFT JOIN club_routes cr ON c.id = cr.club_id AND cr.status = 'active'
LEFT JOIN club_guides cg ON c.id = cg.club_id AND cg.status = 'active'
LEFT JOIN user_activities ua ON c.id = ua.club_id
LEFT JOIN reviews r ON c.id = r.club_id AND r.status = 'approved'
WHERE c.status = 'active'
GROUP BY c.id;

-- =============================================
-- 创建存储过程
-- =============================================

DELIMITER //

-- 更新用户积分存储过程
CREATE PROCEDURE sp_update_user_points(
    IN p_user_id INT,
    IN p_amount INT,
    IN p_type VARCHAR(20),
    IN p_description VARCHAR(200),
    IN p_related_order_type VARCHAR(50),
    IN p_related_order_id INT
)
BEGIN
    DECLARE v_balance_before INT;
    DECLARE v_balance_after INT;
    
    -- 获取当前余额
    SELECT points INTO v_balance_before FROM users WHERE id = p_user_id;
    
    -- 计算新余额
    IF p_type IN ('recharge', 'reward', 'refund') THEN
        SET v_balance_after = v_balance_before + p_amount;
    ELSEIF p_type = 'consume' THEN
        SET v_balance_after = v_balance_before - p_amount;
    END IF;
    
    -- 更新用户积分
    UPDATE users SET points = v_balance_after WHERE id = p_user_id;
    
    -- 插入积分记录
    INSERT INTO point_records (
        user_id, type, amount, balance_before, balance_after,
        description, related_order_type, related_order_id
    ) VALUES (
        p_user_id, p_type, p_amount, v_balance_before, v_balance_after,
        p_description, p_related_order_type, p_related_order_id
    );
    
    SELECT v_balance_after AS new_balance;
END //

-- 更新俱乐部评分存储过程
CREATE PROCEDURE sp_update_club_rating(
    IN p_club_id INT
)
BEGIN
    UPDATE clubs c
    SET
        rating = (SELECT AVG(rating) FROM reviews WHERE club_id = p_club_id AND status = 'approved'),
        review_count = (SELECT COUNT(*) FROM reviews WHERE club_id = p_club_id AND status = 'approved')
    WHERE c.id = p_club_id;
END //

DELIMITER ;

-- =============================================
-- 创建触发器
-- =============================================

DELIMITER //

-- 用户活动插入后更新活动参与人数
CREATE TRIGGER tr_user_activities_insert
AFTER INSERT ON user_activities
FOR EACH ROW
BEGIN
    IF NEW.status IN ('confirmed', 'in_progress', 'completed') THEN
        UPDATE activities
        SET current_participants = current_participants + 1
        WHERE id = NEW.activity_id;
    END IF;
END //

-- 用户课程插入后更新课程参与人数
CREATE TRIGGER tr_user_courses_insert
AFTER INSERT ON user_courses
FOR EACH ROW
BEGIN
    IF NEW.status IN ('confirmed', 'learning', 'completed') THEN
        UPDATE courses
        SET current_participants = current_participants + 1
        WHERE id = NEW.course_id;
    END IF;
END //

-- 评价插入后更新俱乐部评分
CREATE TRIGGER tr_reviews_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    IF NEW.club_id IS NOT NULL AND NEW.status = 'approved' THEN
        CALL sp_update_club_rating(NEW.club_id);
    END IF;
END //

DELIMITER ;

-- =============================================
-- 数据库初始化完成
-- =============================================
