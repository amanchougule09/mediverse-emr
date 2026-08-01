package com.amanchougule.clinic_emr.dashboard.controller;

import com.amanchougule.clinic_emr.dashboard.dto.DashboardResponse;
import com.amanchougule.clinic_emr.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;


    @GetMapping
    @PreAuthorize("hasAuthority('dashboard:view')")
    public DashboardResponse getDashboard() {

        return dashboardService.getDashboardData();
    }
}