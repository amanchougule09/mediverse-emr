CREATE TABLE audit_logs
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    audit_code VARCHAR(30) NOT NULL UNIQUE,

    user_id BIGINT,

    username VARCHAR(100),

    action VARCHAR(100) NOT NULL,

    entity_name VARCHAR(100),

    entity_id BIGINT,

    description TEXT,

    ip_address VARCHAR(100),

    created_at DATETIME NOT NULL,

    updated_at DATETIME NOT NULL
);