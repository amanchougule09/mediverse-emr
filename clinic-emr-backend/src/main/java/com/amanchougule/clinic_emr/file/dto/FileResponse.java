package com.amanchougule.clinic_emr.file.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileResponse {

    private Long id;

    private String fileCode;

    private Long patientId;

    private String patientName;

    private Long doctorId;

    private String doctorName;

    private String fileName;

    private String originalFileName;

    private String fileType;

    private String contentType;

    private String filePath;

    private Long fileSize;

    private String uploadedByName;

    private String description;

    private LocalDateTime uploadedAt;
}
