package com.example.Recruitingsystem.dto;

import lombok.Data;

@Data
public class ApplyForJobRequest {
  private Integer jobseekerId;
  private Integer jobId;
  private String coverLetter;
}