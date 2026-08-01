package com.amanchougule.clinic_emr.consultation.service;

import com.amanchougule.clinic_emr.consultation.dto.ConsultationRequest;
import com.amanchougule.clinic_emr.consultation.dto.ConsultationResponse;

import java.util.List;

public interface ConsultationService {

    ConsultationResponse createConsultation(ConsultationRequest request);

    ConsultationResponse getConsultationById(Long id);

    List<ConsultationResponse> getAllConsultations();

    ConsultationResponse updateConsultation(Long id,
                                            ConsultationRequest request);

    void deleteConsultation(Long id);
}