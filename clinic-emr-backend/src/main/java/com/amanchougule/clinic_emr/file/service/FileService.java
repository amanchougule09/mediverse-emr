package com.amanchougule.clinic_emr.file.service;

import com.amanchougule.clinic_emr.file.dto.FileRequest;
import com.amanchougule.clinic_emr.file.dto.FileResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileService {

    FileResponse uploadFile(MultipartFile file, String description, Long patientId, Long doctorId);

    FileResponse getFileById(Long id);

    List<FileResponse> getAllFiles();

    FileResponse updateFile(Long id, FileRequest request);

    void deleteFile(Long id);

    void deleteFiles(List<Long> ids);

    Resource downloadFile(Long id);
}
