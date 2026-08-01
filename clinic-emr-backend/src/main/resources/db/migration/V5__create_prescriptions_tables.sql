CREATE TABLE prescriptions
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    prescription_code VARCHAR(30) NOT NULL UNIQUE,

    appointment_id BIGINT NOT NULL,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,

    diagnosis TEXT,
    advice TEXT,

    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,

    CONSTRAINT fk_prescription_appointment
        FOREIGN KEY (appointment_id)
            REFERENCES appointments(id),

    CONSTRAINT fk_prescription_patient
        FOREIGN KEY (patient_id)
            REFERENCES patients(id),

    CONSTRAINT fk_prescription_doctor
        FOREIGN KEY (doctor_id)
            REFERENCES doctors(id)
);

CREATE TABLE prescription_items
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    prescription_id BIGINT NOT NULL,

    medicine_name VARCHAR(255) NOT NULL,

    dosage VARCHAR(100),

    frequency VARCHAR(100),

    duration VARCHAR(100),

    instructions VARCHAR(255),

    CONSTRAINT fk_item_prescription
        FOREIGN KEY (prescription_id)
            REFERENCES prescriptions(id)
);