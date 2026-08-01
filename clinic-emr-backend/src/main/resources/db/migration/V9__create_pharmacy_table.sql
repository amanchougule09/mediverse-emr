CREATE TABLE pharmacy
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    medicine_code VARCHAR(30) NOT NULL UNIQUE,

    medicine_name VARCHAR(255) NOT NULL,

    manufacturer VARCHAR(255),

    category VARCHAR(100),

    batch_number VARCHAR(100),

    expiry_date DATE,

    quantity INT NOT NULL,

    unit_price DECIMAL(10,2),

    supplier_name VARCHAR(255),

    status VARCHAR(50),

    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);