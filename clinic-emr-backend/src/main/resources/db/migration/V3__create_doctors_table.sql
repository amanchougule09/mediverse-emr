CREATE TABLE doctors
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    doctor_code VARCHAR(30) NOT NULL UNIQUE,

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    gender VARCHAR(20),

    mobile VARCHAR(15) UNIQUE,
    email VARCHAR(100) UNIQUE,

    specialization VARCHAR(100) NOT NULL,

    qualification VARCHAR(255),

    experience INT,

    consultation_fee DECIMAL(10,2),

    room_number VARCHAR(30),

    active BOOLEAN DEFAULT TRUE,

    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);