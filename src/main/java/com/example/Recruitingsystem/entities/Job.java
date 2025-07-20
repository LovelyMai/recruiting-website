package com.example.Recruitingsystem.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Integer jobId;

    @JsonProperty("title")
    @Column(name = "title", length = 100, nullable = false)
    private String title; // 职位名字 - 使用大驼峰命名

    @Column(name = "description", columnDefinition = "TEXT")
    private String description; // 职位描述 - 使用大驼峰命名

    @Column(name = "address", length = 200)
    private String address; // 位置 - 使用大驼峰命名

    @Column(name = "job_type", nullable = false)
    private String jobType; // 求职类型 - 小驼峰命名

    @Column(name = "edu_req", nullable = false)
    private String eduReq; // 学历要求 - 大驼峰命名

    @Column(name = "salary", nullable = false)
    private String salary; // 薪资待遇 - 大驼峰命名

    @Column(name = "work_exp", nullable = false)
    private String workExp; // 工作经验 - 大驼峰命名

    @Column(name = "company_industry", nullable = false)
    private String companyIndustry; // 公司行业 - 大驼峰命名

    @Column(name = "company_scale", nullable = false)
    private String companyScale; // 公司规模 - 大驼峰命名

    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "user_id", nullable = false)
    private User createdBy; // 招聘者关联 - 小驼峰命名

    @JsonProperty("created")
    @CreationTimestamp
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "job", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    private List<JobApplication> jobApplications;
}