CREATE TABLE notifications
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    notification_code VARCHAR(30) NOT NULL UNIQUE,

    patient_id BIGINT,

    doctor_id BIGINT,

    title VARCHAR(255) NOT NULL,

    message TEXT NOT NULL,

    notification_type VARCHAR(50),

    notification_status VARCHAR(50),

    sent_at DATETIME,

    created_at DATETIME NOT NULL,

    updated_at DATETIME NOT NULL,

    CONSTRAINT fk_notification_patient
        FOREIGN KEY (patient_id)
            REFERENCES patients(id),

    CONSTRAINT fk_notification_doctor
        FOREIGN KEY (doctor_id)
            REFERENCES doctors(id)
);