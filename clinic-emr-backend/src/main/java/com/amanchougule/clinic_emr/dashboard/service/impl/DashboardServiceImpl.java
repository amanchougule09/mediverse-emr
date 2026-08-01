package com.amanchougule.clinic_emr.dashboard.service.impl;

import com.amanchougule.clinic_emr.appointment.repository.AppointmentRepository;
import com.amanchougule.clinic_emr.billing.entity.Billing;
import com.amanchougule.clinic_emr.billing.repository.BillingRepository;
import com.amanchougule.clinic_emr.consultation.repository.ConsultationRepository;
import com.amanchougule.clinic_emr.dashboard.dto.DashboardResponse;
import com.amanchougule.clinic_emr.dashboard.service.DashboardService;
import com.amanchougule.clinic_emr.doctor.repository.DoctorRepository;
import com.amanchougule.clinic_emr.file.repository.PatientFileRepository;
import com.amanchougule.clinic_emr.laboratory.repository.LaboratoryRepository;
import com.amanchougule.clinic_emr.notification.repository.NotificationRepository;
import com.amanchougule.clinic_emr.patient.repository.PatientRepository;
import com.amanchougule.clinic_emr.pharmacy.repository.PharmacyRepository;
import com.amanchougule.clinic_emr.prescription.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final ConsultationRepository consultationRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final BillingRepository billingRepository;
    private final PharmacyRepository pharmacyRepository;
    private final LaboratoryRepository laboratoryRepository;
    private final PatientFileRepository patientFileRepository;
    private final NotificationRepository notificationRepository;


    @Override
    public DashboardResponse getDashboardData() {

        Double totalRevenue = billingRepository.findAll()
                .stream()
                .map(Billing::getTotalAmount)
                .filter(Objects::nonNull)
                .map(BigDecimal::doubleValue)
                .reduce(0.0, Double::sum);


        return DashboardResponse.builder()
                .totalPatients(patientRepository.count())
                .totalDoctors(doctorRepository.count())
                .totalAppointments(appointmentRepository.count())
                .totalConsultations(consultationRepository.count())
                .totalPrescriptions(prescriptionRepository.count())
                .totalBills(billingRepository.count())
                .totalRevenue(totalRevenue)
                .totalMedicines(pharmacyRepository.count())
                .totalLabTests(laboratoryRepository.count())
                .totalFiles(patientFileRepository.count())
                .totalNotifications(notificationRepository.count())
                .build();
    }
}