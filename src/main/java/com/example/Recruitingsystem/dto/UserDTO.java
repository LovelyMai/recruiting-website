package com.example.Recruitingsystem.dto;

import com.example.Recruitingsystem.enums.UserRole;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Integer userId;
    private String account;
    private String email;
    private Integer phone;
    private Integer age;
    private String gender;
    private String company;
    private String school;
    private String introduction;
    private String realname;
    private UserRole role;
    private LocalDateTime createdAt;
} 