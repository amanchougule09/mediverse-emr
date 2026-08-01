package com.amanchougule.clinic_emr.patient.service.impl;

import com.amanchougule.clinic_emr.exception.BadRequestException;
import com.amanchougule.clinic_emr.patient.dto.PatientRequest;
import com.amanchougule.clinic_emr.patient.dto.PatientResponse;
import com.amanchougule.clinic_emr.patient.entity.Patient;
import com.amanchougule.clinic_emr.patient.repository.PatientRepository;
import com.amanchougule.clinic_emr.patient.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.amanchougule.clinic_emr.exception.ResourceNotFoundException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    @Override
    public PatientResponse createPatient(PatientRequest request) {

        if (patientRepository.existsByMobile(request.getMobile())) {
            throw new BadRequestException("Mobile number already exists.");
        }

        String patientCode = generatePatientCode();

        Patient patient = Patient.builder()
                .patientCode(patientCode)
                .firstName(request.getFirstName())
                .middleName(request.getMiddleName())
                .lastName(request.getLastName())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .bloodGroup(request.getBloodGroup())
                .mobile(request.getMobile())
                .email(request.getEmail())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .pincode(request.getPincode())
                .emergencyContactName(request.getEmergencyContactName())
                .emergencyContactNumber(request.getEmergencyContactNumber())
                .maritalStatus(request.getMaritalStatus())
                .occupation(request.getOccupation())
                .aadhaarNumber(request.getAadhaarNumber())
                .insuranceNumber(request.getInsuranceNumber())
                .height(request.getHeight())
                .weight(request.getWeight())
                .allergies(request.getAllergies())
                .chronicDiseases(request.getChronicDiseases())
                .active(true)
                .build();

        patientRepository.save(patient);

        return PatientResponse.builder()
                .id(patient.getId())
                .patientCode(patient.getPatientCode())
                .fullName(patient.getFirstName() + " " + patient.getLastName())
                .gender(patient.getGender())
                .mobile(patient.getMobile())
                .email(patient.getEmail())
                .active(patient.getActive())
                .build();
    }

    @Override
    public PatientResponse getPatientById(Long id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        return mapToResponse(patient);
    }

    @Override
    public List<PatientResponse> getAllPatients() {

        return patientRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private PatientResponse mapToResponse(Patient patient) {

        return PatientResponse.builder()
                .id(patient.getId())
                .patientCode(patient.getPatientCode())
                .fullName(patient.getFirstName() + " " + patient.getLastName())
                .gender(patient.getGender())
                .mobile(patient.getMobile())
                .email(patient.getEmail())
                .active(patient.getActive())
                .build();
    }
    private String generatePatientCode() {

        long count = patientRepository.count() + 1;

        return String.format("PAT%06d", count);
    }

    @Override
    public List<PatientResponse> searchPatients(String keyword) {

        return patientRepository
                .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrMobileContaining(
                        keyword,
                        keyword,
                        keyword
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    @Override
    public Page<PatientResponse> getPatients(int page, int size) {

        return patientRepository
                .findAll(PageRequest.of(page, size))
                .map(this::mapToResponse);
    }

    @Override
    public PatientResponse updatePatient(Long id, PatientRequest request) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        patient.setFirstName(request.getFirstName());
        patient.setMiddleName(request.getMiddleName());
        patient.setLastName(request.getLastName());
        patient.setGender(request.getGender());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setMobile(request.getMobile());
        patient.setEmail(request.getEmail());
        patient.setAddress(request.getAddress());
        patient.setCity(request.getCity());
        patient.setState(request.getState());
        patient.setCountry(request.getCountry());
        patient.setPincode(request.getPincode());
        patient.setEmergencyContactName(request.getEmergencyContactName());
        patient.setEmergencyContactNumber(request.getEmergencyContactNumber());
        patient.setMaritalStatus(request.getMaritalStatus());
        patient.setOccupation(request.getOccupation());
        patient.setAadhaarNumber(request.getAadhaarNumber());
        patient.setInsuranceNumber(request.getInsuranceNumber());
        patient.setHeight(request.getHeight());
        patient.setWeight(request.getWeight());
        patient.setAllergies(request.getAllergies());
        patient.setChronicDiseases(request.getChronicDiseases());

        patientRepository.save(patient);

        return mapToResponse(patient);
    }

    @Override
    public void deletePatient(Long id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        patient.setActive(false);

        patientRepository.save(patient);
    }
}