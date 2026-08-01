package com.amanchougule.clinic_emr.file.service.impl;

import com.amanchougule.clinic_emr.auth.entity.User;
import com.amanchougule.clinic_emr.doctor.entity.Doctor;
import com.amanchougule.clinic_emr.doctor.repository.DoctorRepository;
import com.amanchougule.clinic_emr.exception.ResourceNotFoundException;
import com.amanchougule.clinic_emr.file.dto.FileRequest;
import com.amanchougule.clinic_emr.file.dto.FileResponse;
import com.amanchougule.clinic_emr.file.entity.PatientFile;
import com.amanchougule.clinic_emr.file.repository.PatientFileRepository;
import com.amanchougule.clinic_emr.file.service.FileService;
import com.amanchougule.clinic_emr.patient.entity.Patient;
import com.amanchougule.clinic_emr.patient.repository.PatientRepository;
import com.amanchougule.clinic_emr.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final PatientFileRepository patientFileRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Override
    @Transactional
    public FileResponse uploadFile(MultipartFile file, String description, Long patientId, Long doctorId) {
        User currentUser = getCurrentUser();

        Patient patient = null;
        if (patientId != null) {
            patient = patientRepository.findById(patientId)
                    .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        }

        Doctor doctor = null;
        if (doctorId != null) {
            doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        }

        String originalFileName = file.getOriginalFilename();
        String storedFileName = UUID.randomUUID() + "_" + (originalFileName != null ? originalFileName : "unknown");
        String contentType = file.getContentType();
        long fileSize = file.getSize();

        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
            Path targetPath = uploadPath.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            PatientFile patientFile = PatientFile.builder()
                    .fileCode("FILE-" + System.currentTimeMillis())
                    .originalFileName(originalFileName)
                    .patient(patient)
                    .doctor(doctor)
                    .fileName(originalFileName != null ? originalFileName : "unknown")
                    .fileType(contentType)
                    .contentType(contentType)
                    .filePath(targetPath.toString())
                    .fileSize(fileSize)
                    .uploadedBy(currentUser)
                    .description(description)
                    .build();

            patientFile = patientFileRepository.save(patientFile);
            return mapToResponse(patientFile);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }

    @Override
    public FileResponse getFileById(Long id) {
        PatientFile file = patientFileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));
        return mapToResponse(file);
    }

    @Override
    public List<FileResponse> getAllFiles() {
        return patientFileRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public FileResponse updateFile(Long id, FileRequest request) {
        PatientFile file = patientFileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));

        if (request.getPatientId() != null) {
            Patient patient = patientRepository.findById(request.getPatientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
            file.setPatient(patient);
        }

        if (request.getDoctorId() != null) {
            Doctor doctor = doctorRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
            file.setDoctor(doctor);
        }

        if (request.getFileName() != null) file.setFileName(request.getFileName());
        if (request.getFileType() != null) file.setFileType(request.getFileType());
        if (request.getFilePath() != null) file.setFilePath(request.getFilePath());
        if (request.getDescription() != null) file.setDescription(request.getDescription());

        file = patientFileRepository.save(file);
        return mapToResponse(file);
    }

    @Override
    public void deleteFile(Long id) {
        PatientFile file = patientFileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));

        deletePhysicalFile(file.getFilePath());
        patientFileRepository.delete(file);
    }

    @Override
    public void deleteFiles(List<Long> ids) {
        List<PatientFile> files = patientFileRepository.findAllById(ids);
        for (PatientFile file : files) {
            deletePhysicalFile(file.getFilePath());
        }
        patientFileRepository.deleteAll(files);
    }

    @Override
    public Resource downloadFile(Long id) {
        PatientFile file = patientFileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));

        try {
            Path filePath = Paths.get(file.getFilePath());
            if (!Files.exists(filePath)) {
                throw new ResourceNotFoundException("File not found on disk");
            }
            InputStream inputStream = Files.newInputStream(filePath);
            return new InputStreamResource(inputStream);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file: " + e.getMessage(), e);
        }
    }

    private void deletePhysicalFile(String filePath) {
        if (filePath != null) {
            try {
                Files.deleteIfExists(Paths.get(filePath));
            } catch (IOException ignored) {
            }
        }
    }

    private FileResponse mapToResponse(PatientFile file) {
        String uploadedByName = null;
        if (file.getUploadedBy() != null) {
            User u = file.getUploadedBy();
            uploadedByName = (u.getFirstName() != null ? u.getFirstName() : "")
                    + " " + (u.getLastName() != null ? u.getLastName() : "");
            uploadedByName = uploadedByName.trim();
            if (uploadedByName.isEmpty()) uploadedByName = u.getUsername();
        }

        return FileResponse.builder()
                .id(file.getId())
                .fileCode(file.getFileCode())
                .patientId(file.getPatient() != null ? file.getPatient().getId() : null)
                .patientName(file.getPatient() != null
                        ? file.getPatient().getFirstName() + " " + file.getPatient().getLastName()
                        : null)
                .doctorId(file.getDoctor() != null ? file.getDoctor().getId() : null)
                .doctorName(file.getDoctor() != null
                        ? file.getDoctor().getFirstName() + " " + file.getDoctor().getLastName()
                        : null)
                .fileName(file.getFileName())
                .originalFileName(file.getOriginalFileName())
                .fileType(file.getFileType())
                .contentType(file.getContentType())
                .filePath(file.getFilePath())
                .fileSize(file.getFileSize())
                .uploadedByName(uploadedByName)
                .description(file.getDescription())
                .uploadedAt(file.getUploadedAt())
                .build();
    }

    private User getCurrentUser() {
        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserPrincipal userPrincipal) {
            return userPrincipal.getUser();
        }
        return null;
    }
}
