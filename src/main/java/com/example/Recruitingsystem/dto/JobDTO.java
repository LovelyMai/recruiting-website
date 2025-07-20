package com.example.Recruitingsystem.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class JobDTO {
    private Integer jobId;
    private String title;
    private String description;
    private String address;
    private String jobType;
    private String eduReq;
    private String salary;
    private String workExp;
    private String companyIndustry;
    private String companyScale;
    private Integer createdBy; // 只传递 userId
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}