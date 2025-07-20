package com.example.Recruitingsystem.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
  @NotBlank
  private String account;
  @NotBlank
  private String password;
  @NotBlank
  private String role;
}