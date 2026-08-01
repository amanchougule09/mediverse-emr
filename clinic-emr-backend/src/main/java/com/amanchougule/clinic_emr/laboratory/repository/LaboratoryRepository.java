package com.amanchougule.clinic_emr.laboratory.repository;

import com.amanchougule.clinic_emr.laboratory.entity.LaboratoryTest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LaboratoryRepository
        extends JpaRepository<LaboratoryTest, Long> {

    Optional<LaboratoryTest> findByTestCode(String testCode);

}