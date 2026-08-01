package com.amanchougule.clinic_emr.patient.repository;

import com.amanchougule.clinic_emr.patient.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByPatientCode(String patientCode);

    Optional<Patient> findByMobile(String mobile);

    boolean existsByPatientCode(String patientCode);

    boolean existsByMobile(String mobile);

    long count();

    List<Patient> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrMobileContaining(
            String firstName,
            String lastName,
            String mobile
    );
}
