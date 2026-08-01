CREATE TABLE appointments
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    appointment_code VARCHAR(30) NOT NULL UNIQUE,

    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,

    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,

    reason VARCHAR(255),

    status VARCHAR(30) NOT NULL,

    notes TEXT,

    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,

    CONSTRAINT fk_appointment_patient
        FOREIGN KEY (patient_id)
            REFERENCES patients(id),

    CONSTRAINT fk_appointment_doctor
        FOREIGN KEY (doctor_id)
            REFERENCES doctors(id)
);