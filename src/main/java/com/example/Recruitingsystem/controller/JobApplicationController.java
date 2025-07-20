package com.example.Recruitingsystem.controller;

import com.example.Recruitingsystem.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    // ===================== 主要功能分块注释 =====================
    // 求职者申请职位
    @PostMapping("/apply")
    public ResponseEntity<?> applyForJob(@RequestBody Map<String, Object> request) {
        return jobApplicationService.applyForJob(request);
    }

    // 求职者查看自己的申请
    @GetMapping("/jobseeker/{jobseekerId}")
    public ResponseEntity<?> getJobseekerApplications(@PathVariable Integer jobseekerId) {
        return jobApplicationService.getJobseekerApplications(jobseekerId);
    }

    // 招聘者查看收到的申请
    @GetMapping("/employer/{employerId}")
    public ResponseEntity<?> getEmployerApplications(@PathVariable Integer employerId) {
        return jobApplicationService.getEmployerApplications(employerId);
    }

    // 招聘者处理申请（接受或拒绝）
    @PutMapping("/{applicationId}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Integer applicationId,
            @RequestBody Map<String, String> request) {
        return jobApplicationService.updateApplicationStatus(applicationId, request);
    }

    // 查看所有申请（管理员功能）
    @GetMapping("/all")
    public ResponseEntity<?> getAllApplications() {
        return jobApplicationService.getAllApplications();
    }

    // 根据状态查看申请
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getApplicationsByStatus(@PathVariable String status) {
        return jobApplicationService.getApplicationsByStatus(status);
    }
}