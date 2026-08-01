package com.amanchougule.clinic_emr.dashboard.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private Long totalPatients;

    private Long totalDoctors;

    private Long totalAppointments;

    private Long totalConsultations;

    private Long totalPrescriptions;

    private Long totalBills;

    private Double totalRevenue;

    private Long totalMedicines;

    private Long totalLabTests;

    private Long totalFiles;

    private Long totalNotifications;

}