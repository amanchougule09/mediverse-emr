package com.amanchougule.clinic_emr.file.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileRequest {

    private Long patientId;

    private Long doctorId;

    private String fileName;

    private String fileType;

    private String filePath;

    private String description;

}