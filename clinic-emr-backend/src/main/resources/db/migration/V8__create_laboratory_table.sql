CREATE TABLE laboratory_tests
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    test_code VARCHAR(30) NOT NULL UNIQUE,

    patient_id BIGINT NOT NULL,

    doctor_id BIGINT NOT NULL,

    appointment_id BIGINT,

    test_name VARCHAR(150) NOT NULL,

    sample_type VARCHAR(100),

    test_status VARCHAR(50),

    result TEXT,

    remarks TEXT,

    test_date DATE,

    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,

    CONSTRAINT fk_lab_patient
        FOREIGN KEY (patient_id)
            REFERENCES patients(id),

    CONSTRAINT fk_lab_doctor
        FOREIGN KEY (doctor_id)
            REFERENCES doctors(id),

    CONSTRAINT fk_lab_appointment
        FOREIGN KEY (appointment_id)
            REFERENCES appointments(id)
);