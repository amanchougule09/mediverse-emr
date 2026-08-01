package com.amanchougule.clinic_emr.doctor.service.impl;

import com.amanchougule.clinic_emr.doctor.dto.DoctorRequest;
import com.amanchougule.clinic_emr.doctor.dto.DoctorResponse;
import com.amanchougule.clinic_emr.doctor.entity.Doctor;
import com.amanchougule.clinic_emr.doctor.repository.DoctorRepository;
import com.amanchougule.clinic_emr.doctor.service.DoctorService;
import com.amanchougule.clinic_emr.exception.BadRequestException;
import com.amanchougule.clinic_emr.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    @Override
    public DoctorResponse createDoctor(DoctorRequest request) {

        if (doctorRepository.existsByMobile(request.getMobile())) {
            throw new BadRequestException("Mobile number already exists.");
        }

        Doctor doctor = Doctor.builder()
                .doctorCode(generateDoctorCode())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .specialization(request.getSpecialization())
                .mobile(request.getMobile())
                .email(request.getEmail())
                .qualification(request.getQualification())
                .experience(request.getExperience())
                .gender(request.getGender())
                .build();

        doctor = doctorRepository.save(doctor);

        return mapToResponse(doctor);
    }

    @Override
    public DoctorResponse getDoctorById(Long id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        return mapToResponse(doctor);
    }

    @Override
    public List<DoctorResponse> getAllDoctors() {

        return doctorRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public DoctorResponse updateDoctor(Long id, DoctorRequest request) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        doctor.setFirstName(request.getFirstName());
        doctor.setLastName(request.getLastName());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setMobile(request.getMobile());
        doctor.setEmail(request.getEmail());
        doctor.setQualification(request.getQualification());
        doctor.setExperience(request.getExperience());
        doctor.setGender(request.getGender());

        doctorRepository.save(doctor);

        return mapToResponse(doctor);
    }

    @Override
    public void deleteDoctor(Long id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        doctor.setActive(false);

        doctorRepository.save(doctor);
    }

    private DoctorResponse mapToResponse(Doctor doctor) {

        return DoctorResponse.builder()
                .id(doctor.getId())
                .doctorCode(doctor.getDoctorCode())
                .firstName(doctor.getFirstName())
                .lastName(doctor.getLastName())
                .specialization(doctor.getSpecialization())
                .mobile(doctor.getMobile())
                .email(doctor.getEmail())
                .qualification(doctor.getQualification())
                .experience(doctor.getExperience())
                .gender(doctor.getGender())
                .active(doctor.getActive())
                .build();
    }

    private String generateDoctorCode() {
        return "DOC-" + System.currentTimeMillis();
    }
}