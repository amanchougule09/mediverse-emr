CREATE TABLE roles (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(50) NOT NULL UNIQUE,
                       description VARCHAR(255),
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             name VARCHAR(100) NOT NULL UNIQUE,
                             description VARCHAR(255),
                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
                                  role_id BIGINT NOT NULL,
                                  permission_id BIGINT NOT NULL,
                                  PRIMARY KEY(role_id, permission_id),

                                  CONSTRAINT fk_role_permission_role
                                      FOREIGN KEY(role_id)
                                          REFERENCES roles(id),

                                  CONSTRAINT fk_role_permission_permission
                                      FOREIGN KEY(permission_id)
                                          REFERENCES permissions(id)
);

CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,

                       username VARCHAR(50) NOT NULL UNIQUE,

                       email VARCHAR(100) NOT NULL UNIQUE,

                       password VARCHAR(255) NOT NULL,

                       first_name VARCHAR(100),

                       last_name VARCHAR(100),

                       phone VARCHAR(20),

                       enabled BOOLEAN DEFAULT TRUE,

                       account_non_locked BOOLEAN DEFAULT TRUE,

                       credentials_non_expired BOOLEAN DEFAULT TRUE,

                       account_non_expired BOOLEAN DEFAULT TRUE,

                       last_login TIMESTAMP NULL,

                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
                            user_id BIGINT NOT NULL,
                            role_id BIGINT NOT NULL,

                            PRIMARY KEY(user_id, role_id),

                            CONSTRAINT fk_user_role_user
                                FOREIGN KEY(user_id)
                                    REFERENCES users(id),

                            CONSTRAINT fk_user_role_role
                                FOREIGN KEY(role_id)
                                    REFERENCES roles(id)
);