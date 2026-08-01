CREATE TABLE patients
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    patient_code VARCHAR(30) NOT NULL UNIQUE,

    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,

    gender VARCHAR(20) NOT NULL,

    date_of_birth DATE,

    blood_group VARCHAR(10),

    mobile VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(100),

    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    pincode VARCHAR(10),

    emergency_contact_name VARCHAR(100),
    emergency_contact_number VARCHAR(15),

    marital_status VARCHAR(30),
    occupation VARCHAR(100),

    aadhaar_number VARCHAR(20),
    insurance_number VARCHAR(50),

    photo_url VARCHAR(255),

    height DECIMAL(5,2),
    weight DECIMAL(5,2),

    allergies TEXT,
    chronic_diseases TEXT,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);