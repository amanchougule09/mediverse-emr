package com.amanchougule.clinic_emr.doctor.service;

import com.amanchougule.clinic_emr.doctor.dto.DoctorRequest;
import com.amanchougule.clinic_emr.doctor.dto.DoctorResponse;

import java.util.List;

public interface DoctorService {

    DoctorResponse createDoctor(DoctorRequest request);

    DoctorResponse getDoctorById(Long id);

    List<DoctorResponse> getAllDoctors();

    DoctorResponse updateDoctor(Long id, DoctorRequest request);

    void deleteDoctor(Long id);
}