package com.amanchougule.clinic_emr.consultation.repository;

import com.amanchougule.clinic_emr.consultation.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    Optional<Consultation> findByConsultationCode(String consultationCode);

}