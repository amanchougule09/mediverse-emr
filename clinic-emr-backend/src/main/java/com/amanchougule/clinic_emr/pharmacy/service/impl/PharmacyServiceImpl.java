package com.amanchougule.clinic_emr.pharmacy.service.impl;

import com.amanchougule.clinic_emr.exception.BadRequestException;
import com.amanchougule.clinic_emr.exception.ResourceNotFoundException;
import com.amanchougule.clinic_emr.pharmacy.dto.PharmacyRequest;
import com.amanchougule.clinic_emr.pharmacy.dto.PharmacyResponse;
import com.amanchougule.clinic_emr.pharmacy.entity.Pharmacy;
import com.amanchougule.clinic_emr.pharmacy.repository.PharmacyRepository;
import com.amanchougule.clinic_emr.pharmacy.service.PharmacyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PharmacyServiceImpl implements PharmacyService {

    private final PharmacyRepository pharmacyRepository;

    @Override
    public PharmacyResponse createMedicine(PharmacyRequest request) {

        if (pharmacyRepository.existsByMedicineName(request.getMedicineName())) {
            throw new BadRequestException("Medicine already exists.");
        }

        Pharmacy medicine = Pharmacy.builder()
                .medicineCode(generateMedicineCode())
                .medicineName(request.getMedicineName())
                .manufacturer(request.getManufacturer())
                .category(request.getCategory())
                .batchNumber(request.getBatchNumber())
                .expiryDate(request.getExpiryDate())
                .quantity(request.getQuantity())
                .unitPrice(request.getUnitPrice())
                .supplierName(request.getSupplierName())
                .status(request.getStatus())
                .build();

        medicine = pharmacyRepository.save(medicine);

        return mapToResponse(medicine);
    }

    @Override
    public PharmacyResponse getMedicineById(Long id) {

        Pharmacy medicine = pharmacyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Medicine not found"));

        return mapToResponse(medicine);
    }

    @Override
    public List<PharmacyResponse> getAllMedicines() {

        return pharmacyRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public PharmacyResponse updateMedicine(Long id,
                                           PharmacyRequest request) {

        Pharmacy medicine = pharmacyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Medicine not found"));

        medicine.setMedicineName(request.getMedicineName());
        medicine.setManufacturer(request.getManufacturer());
        medicine.setCategory(request.getCategory());
        medicine.setBatchNumber(request.getBatchNumber());
        medicine.setExpiryDate(request.getExpiryDate());
        medicine.setQuantity(request.getQuantity());
        medicine.setUnitPrice(request.getUnitPrice());
        medicine.setSupplierName(request.getSupplierName());
        medicine.setStatus(request.getStatus());

        medicine = pharmacyRepository.save(medicine);

        return mapToResponse(medicine);
    }

    @Override
    public void deleteMedicine(Long id) {

        Pharmacy medicine = pharmacyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Medicine not found"));

        pharmacyRepository.delete(medicine);
    }

    private PharmacyResponse mapToResponse(Pharmacy medicine) {

        return PharmacyResponse.builder()
                .id(medicine.getId())
                .medicineCode(medicine.getMedicineCode())
                .medicineName(medicine.getMedicineName())
                .manufacturer(medicine.getManufacturer())
                .category(medicine.getCategory())
                .batchNumber(medicine.getBatchNumber())
                .expiryDate(medicine.getExpiryDate())
                .quantity(medicine.getQuantity())
                .unitPrice(medicine.getUnitPrice())
                .supplierName(medicine.getSupplierName())
                .status(medicine.getStatus())
                .build();
    }

    private String generateMedicineCode() {
        return "MED-" + System.currentTimeMillis();
    }
}