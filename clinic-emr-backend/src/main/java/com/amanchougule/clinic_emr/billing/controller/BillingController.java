package com.amanchougule.clinic_emr.billing.controller;

import com.amanchougule.clinic_emr.billing.dto.BillingRequest;
import com.amanchougule.clinic_emr.billing.dto.BillingResponse;
import com.amanchougule.clinic_emr.billing.service.BillingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billing")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;

    @PostMapping
    @PreAuthorize("hasAuthority('billing:create')")
    public BillingResponse createBill(
            @Valid @RequestBody BillingRequest request) {

        return billingService.createBill(request);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('billing:view')")
    public BillingResponse getBillById(
            @PathVariable Long id) {

        return billingService.getBillById(id);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('billing:view')")
    public List<BillingResponse> getAllBills() {

        return billingService.getAllBills();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('billing:update')")
    public BillingResponse updateBill(
            @PathVariable Long id,
            @Valid @RequestBody BillingRequest request) {

        return billingService.updateBill(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('billing:delete')")
    public String deleteBill(
            @PathVariable Long id) {

        billingService.deleteBill(id);

        return "Bill deleted successfully.";
    }
}