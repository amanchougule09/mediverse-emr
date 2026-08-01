package com.amanchougule.clinic_emr.doctor.repository;

import com.amanchougule.clinic_emr.doctor.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByDoctorCode(String doctorCode);

    Optional<Doctor> findByMobile(String mobile);

    boolean existsByDoctorCode(String doctorCode);

    boolean existsByMobile(String mobile);
}