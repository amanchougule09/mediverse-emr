package com.amanchougule.clinic_emr.laboratory.service;

import com.amanchougule.clinic_emr.laboratory.dto.LaboratoryRequest;
import com.amanchougule.clinic_emr.laboratory.dto.LaboratoryResponse;

import java.util.List;

public interface LaboratoryService {

    LaboratoryResponse createTest(LaboratoryRequest request);

    LaboratoryResponse getTestById(Long id);

    List<LaboratoryResponse> getAllTests();

    LaboratoryResponse updateTest(Long id, LaboratoryRequest request);

    void deleteTest(Long id);
}