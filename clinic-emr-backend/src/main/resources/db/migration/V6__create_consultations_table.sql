CREATE TABLE consultations
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    consultation_code VARCHAR(30) NOT NULL UNIQUE,

    appointment_id BIGINT NOT NULL,

    symptoms TEXT,

    diagnosis TEXT,

    examination TEXT,

    doctor_notes TEXT,

    follow_up_date DATE,

    status VARCHAR(30),

    created_at DATETIME NOT NULL,

    updated_at DATETIME NOT NULL,

    CONSTRAINT fk_consultation_appointment
        FOREIGN KEY (appointment_id)
            REFERENCES appointments(id)
);