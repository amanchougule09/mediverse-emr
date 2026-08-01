ALTER TABLE patient_files
    MODIFY patient_id BIGINT NULL,
    ADD COLUMN original_file_name VARCHAR(255) AFTER file_code,
    ADD COLUMN content_type VARCHAR(100) AFTER file_type,
    ADD COLUMN file_size BIGINT AFTER file_path,
    ADD COLUMN uploaded_by BIGINT AFTER file_size,
    ADD CONSTRAINT fk_patient_files_uploaded_by
        FOREIGN KEY (uploaded_by) REFERENCES users(id);
