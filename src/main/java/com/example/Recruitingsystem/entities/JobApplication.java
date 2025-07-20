package com.example.Recruitingsystem.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "job_applications")
public class JobApplication {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Integer applicationId;
    
    @ManyToOne
    @JoinColumn(name = "jobseeker_id", referencedColumnName = "user_id", nullable = false)
    private User jobseeker; // 求职者
    
    @ManyToOne
    @JoinColumn(name = "job_id", referencedColumnName = "job_id", nullable = false)
    private Job job; // 申请的职位
    
    @Column(name = "status", length = 20, nullable = false)
    private String status = "PENDING"; // 申请状态：PENDING, ACCEPTED, REJECTED
    
    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter; // 求职信
    
    @CreationTimestamp
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @Column(name = "applied_at", updatable = false)
    private LocalDateTime appliedAt; // 申请时间
} 