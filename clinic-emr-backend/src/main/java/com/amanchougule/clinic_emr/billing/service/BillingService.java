package com.amanchougule.clinic_emr.billing.service;

import com.amanchougule.clinic_emr.billing.dto.BillingRequest;
import com.amanchougule.clinic_emr.billing.dto.BillingResponse;

import java.util.List;

public interface BillingService {

    BillingResponse createBill(BillingRequest request);

    BillingResponse getBillById(Long id);

    List<BillingResponse> getAllBills();

    BillingResponse updateBill(Long id, BillingRequest request);

    void deleteBill(Long id);
}