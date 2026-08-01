package com.amanchougule.clinic_emr.file.controller;

import com.amanchougule.clinic_emr.file.dto.FileRequest;
import com.amanchougule.clinic_emr.file.dto.FileResponse;
import com.amanchougule.clinic_emr.file.service.FileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping
    @PreAuthorize("hasAuthority('file:create')")
    public FileResponse uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "patientId", required = false) Long patientId,
            @RequestParam(value = "doctorId", required = false) Long doctorId) {

        return fileService.uploadFile(file, description, patientId, doctorId);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('file:view')")
    public FileResponse getFileById(@PathVariable Long id) {
        return fileService.getFileById(id);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('file:view')")
    public List<FileResponse> getAllFiles() {
        return fileService.getAllFiles();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('file:update')")
    public FileResponse updateFile(@PathVariable Long id, @Valid @RequestBody FileRequest request) {
        return fileService.updateFile(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('file:delete')")
    public String deleteFile(@PathVariable Long id) {
        fileService.deleteFile(id);
        return "Patient file deleted successfully.";
    }

    @PostMapping("/batch-delete")
    @PreAuthorize("hasAuthority('file:delete')")
    public String deleteFiles(@RequestBody Map<String, List<Long>> request) {
        List<Long> ids = request.get("ids");
        if (ids == null || ids.isEmpty()) {
            return "No file IDs provided.";
        }
        fileService.deleteFiles(ids);
        return ids.size() + " file(s) deleted successfully.";
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasAuthority('file:download')")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        FileResponse fileMeta = fileService.getFileById(id);
        Resource resource = fileService.downloadFile(id);

        String contentType = fileMeta.getContentType() != null
                ? fileMeta.getContentType()
                : "application/octet-stream";

        String originalFileName = fileMeta.getOriginalFileName() != null
                ? fileMeta.getOriginalFileName()
                : fileMeta.getFileName();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + originalFileName + "\"")
                .body(resource);
    }
}
