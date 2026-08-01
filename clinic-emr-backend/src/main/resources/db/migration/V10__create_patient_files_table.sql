CREATE TABLE patient_files
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    file_code VARCHAR(30) NOT NULL UNIQUE,

    patient_id BIGINT NOT NULL,

    doctor_id BIGINT,

    file_name VARCHAR(255) NOT NULL,

    file_type VARCHAR(100),

    file_path VARCHAR(500),

    description TEXT,

    uploaded_at DATETIME NOT NULL,

    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,

    CONSTRAINT fk_patient_files_patient
        FOREIGN KEY (patient_id)
            REFERENCES patients(id),

    CONSTRAINT fk_patient_files_doctor
        FOREIGN KEY (doctor_id)
            REFERENCES doctors(id)
);