package com.amanchougule.clinic_emr.patient.service;

import com.amanchougule.clinic_emr.patient.dto.PatientRequest;
import com.amanchougule.clinic_emr.patient.dto.PatientResponse;

import java.util.List;
import org.springframework.data.domain.Page;

public interface PatientService {

    PatientResponse createPatient(PatientRequest request);

    PatientResponse getPatientById(Long id);

    List<PatientResponse> getAllPatients();

    List<PatientResponse> searchPatients(String keyword);

    Page<PatientResponse> getPatients(int page, int size);

    PatientResponse updatePatient(Long id, PatientRequest request);

    void deletePatient(Long id);
}