package com.example.Recruitingsystem.entities;

import com.example.Recruitingsystem.enums.UserRole;
import jakarta.persistence.*;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "account", length = 50, nullable = false, unique = true)
    private String account;

    @Column(name = "password", length = 100, nullable = false)
    private String password;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "phone")
    private Integer phone;

    @Column(name = "age")
    private Integer age;

    @Column(name = "gender")
    private String gender;

    @Column(name = "company")
    private String company;

    @Column(name = "school")
    private String school;

    @Column(name = "introduction")
    private String introduction;

    @Column(name = "realname", length = 100)
    private String realname;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // ... existing code ...
    @JsonIgnore
    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.REMOVE)
    private java.util.List<Job> jobs;

    // 新增：级联删除用户的所有JobApplication
    @JsonIgnore
    @OneToMany(mappedBy = "jobseeker", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private java.util.List<JobApplication> jobApplications;
    // ... existing code ...
}
