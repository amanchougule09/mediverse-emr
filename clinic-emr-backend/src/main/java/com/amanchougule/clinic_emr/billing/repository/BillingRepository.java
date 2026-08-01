package com.amanchougule.clinic_emr.billing.repository;

import com.amanchougule.clinic_emr.billing.entity.Billing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BillingRepository extends JpaRepository<Billing, Long> {

    Optional<Billing> findByBillNumber(String billNumber);

}