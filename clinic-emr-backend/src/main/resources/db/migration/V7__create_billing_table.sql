CREATE TABLE billing
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    bill_number VARCHAR(30) NOT NULL UNIQUE,

    patient_id BIGINT NOT NULL,

    appointment_id BIGINT,

    consultation_fee DECIMAL(10,2),

    medicine_amount DECIMAL(10,2),

    laboratory_amount DECIMAL(10,2),

    discount DECIMAL(10,2),

    total_amount DECIMAL(10,2),

    payment_status VARCHAR(30),

    payment_method VARCHAR(30),

    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,

    CONSTRAINT fk_bill_patient
        FOREIGN KEY(patient_id)
            REFERENCES patients(id),

    CONSTRAINT fk_bill_appointment
        FOREIGN KEY(appointment_id)
            REFERENCES appointments(id)
);