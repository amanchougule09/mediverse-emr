package com.amanchougule.clinic_emr.billing.service.impl;

import com.amanchougule.clinic_emr.appointment.entity.Appointment;
import com.amanchougule.clinic_emr.appointment.repository.AppointmentRepository;
import com.amanchougule.clinic_emr.billing.dto.BillingRequest;
import com.amanchougule.clinic_emr.billing.dto.BillingResponse;
import com.amanchougule.clinic_emr.billing.entity.Billing;
import com.amanchougule.clinic_emr.billing.repository.BillingRepository;
import com.amanchougule.clinic_emr.billing.service.BillingService;
import com.amanchougule.clinic_emr.exception.ResourceNotFoundException;
import com.amanchougule.clinic_emr.patient.entity.Patient;
import com.amanchougule.clinic_emr.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillingServiceImpl implements BillingService {

    private final BillingRepository billingRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    public BillingResponse createBill(BillingRequest request) {

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        Appointment appointment = null;

        if (request.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Appointment not found"));
        }

        BigDecimal consultationFee = value(request.getConsultationFee());
        BigDecimal medicineAmount = value(request.getMedicineAmount());
        BigDecimal laboratoryAmount = value(request.getLaboratoryAmount());
        BigDecimal discount = value(request.getDiscount());

        BigDecimal total = consultationFee
                .add(medicineAmount)
                .add(laboratoryAmount)
                .subtract(discount);

        Billing billing = Billing.builder()
                .billNumber(generateBillNumber())
                .patient(patient)
                .appointment(appointment)
                .consultationFee(consultationFee)
                .medicineAmount(medicineAmount)
                .laboratoryAmount(laboratoryAmount)
                .discount(discount)
                .totalAmount(total)
                .paymentStatus(request.getPaymentStatus())
                .paymentMethod(request.getPaymentMethod())
                .build();

        billing = billingRepository.save(billing);

        return mapToResponse(billing);
    }

    @Override
    public BillingResponse getBillById(Long id) {

        Billing billing = billingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Bill not found"));

        return mapToResponse(billing);
    }

    @Override
    public List<BillingResponse> getAllBills() {

        return billingRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public BillingResponse updateBill(Long id, BillingRequest request) {

        Billing billing = billingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Bill not found"));

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        Appointment appointment = null;

        if (request.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Appointment not found"));
        }

        BigDecimal consultationFee = value(request.getConsultationFee());
        BigDecimal medicineAmount = value(request.getMedicineAmount());
        BigDecimal laboratoryAmount = value(request.getLaboratoryAmount());
        BigDecimal discount = value(request.getDiscount());

        BigDecimal total = consultationFee
                .add(medicineAmount)
                .add(laboratoryAmount)
                .subtract(discount);

        billing.setPatient(patient);
        billing.setAppointment(appointment);
        billing.setConsultationFee(consultationFee);
        billing.setMedicineAmount(medicineAmount);
        billing.setLaboratoryAmount(laboratoryAmount);
        billing.setDiscount(discount);
        billing.setTotalAmount(total);
        billing.setPaymentStatus(request.getPaymentStatus());
        billing.setPaymentMethod(request.getPaymentMethod());

        billing = billingRepository.save(billing);

        return mapToResponse(billing);
    }

    @Override
    public void deleteBill(Long id) {

        Billing billing = billingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Bill not found"));

        billingRepository.delete(billing);
    }

    private BillingResponse mapToResponse(Billing billing) {

        return BillingResponse.builder()
                .id(billing.getId())
                .billNumber(billing.getBillNumber())
                .patientId(billing.getPatient().getId())
                .patientName(
                        billing.getPatient().getFirstName() + " " +
                                billing.getPatient().getLastName()
                )
                .appointmentId(
                        billing.getAppointment() != null
                                ? billing.getAppointment().getId()
                                : null
                )
                .consultationFee(billing.getConsultationFee())
                .medicineAmount(billing.getMedicineAmount())
                .laboratoryAmount(billing.getLaboratoryAmount())
                .discount(billing.getDiscount())
                .totalAmount(billing.getTotalAmount())
                .paymentStatus(billing.getPaymentStatus())
                .paymentMethod(billing.getPaymentMethod())
                .build();
    }

    private BigDecimal value(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private String generateBillNumber() {
        return "BILL-" + System.currentTimeMillis();
    }
}