package com.amanchougule.clinic_emr.file.repository;

import com.amanchougule.clinic_emr.file.entity.PatientFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientFileRepository extends JpaRepository<PatientFile, Long> {

    Optional<PatientFile> findByFileCode(String fileCode);

}