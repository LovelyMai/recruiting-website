package com.example.Recruitingsystem.service;

import com.example.Recruitingsystem.entities.Job;
import com.example.Recruitingsystem.entities.JobApplication;
import com.example.Recruitingsystem.entities.User;
import com.example.Recruitingsystem.enums.UserRole;
import com.example.Recruitingsystem.repository.JobApplicationRepository;
import com.example.Recruitingsystem.repository.JobRepository;
import com.example.Recruitingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class JobApplicationService {
    @Autowired
    private JobApplicationRepository jobApplicationRepository;
    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<?> applyForJob(Map<String, Object> request) {
        try {
            Integer jobseekerId = (Integer) request.get("jobseekerId");
            Integer jobId = (Integer) request.get("jobId");
            String coverLetter = (String) request.get("coverLetter");

            // 验证求职者
            User jobseeker = userRepository.findById(jobseekerId).orElse(null);
            if (jobseeker == null || jobseeker.getRole() != UserRole.JOBSEEKER) {
                return ResponseEntity.badRequest().body("Invalid jobseeker");
            }

            // 验证职位
            Job job = jobRepository.findById(jobId).orElse(null);
            if (job == null) {
                return ResponseEntity.badRequest().body("Job not found");
            }

            // 检查是否已经申请过
            JobApplication existingApplication = jobApplicationRepository
                    .findByJobseekerUserIdAndJobJobId(jobseekerId, jobId);
            if (existingApplication != null) {
                return ResponseEntity.badRequest().body("Already applied for this job");
            }

            // 创建申请
            JobApplication application = new JobApplication();
            application.setJobseeker(jobseeker);
            application.setJob(job);
            application.setCoverLetter(coverLetter);
            application.setStatus("PENDING");

            JobApplication savedApplication = jobApplicationRepository.save(application);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Application submitted successfully");
            response.put("applicationId", savedApplication.getApplicationId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error submitting application: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getJobseekerApplications(Integer jobseekerId) {
        try {
            List<JobApplication> applications = jobApplicationRepository.findByJobseekerUserId(jobseekerId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching applications: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getEmployerApplications(Integer employerId) {
        try {
            List<JobApplication> applications = jobApplicationRepository.findByEmployerId(employerId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching applications: " + e.getMessage());
        }
    }

    public ResponseEntity<?> updateApplicationStatus(Integer applicationId, Map<String, String> request) {
        try {
            String status = request.get("status");
            if (!status.equals("ACCEPTED") && !status.equals("REJECTED")) {
                return ResponseEntity.badRequest().body("Invalid status. Use ACCEPTED or REJECTED");
            }

            JobApplication application = jobApplicationRepository.findById(applicationId).orElse(null);
            if (application == null) {
                return ResponseEntity.badRequest().body("Application not found");
            }

            application.setStatus(status);
            jobApplicationRepository.save(application);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Application status updated successfully");
            response.put("status", status);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating application status: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getAllApplications() {
        try {
            List<JobApplication> applications = jobApplicationRepository.findAll();
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching all applications: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getApplicationsByStatus(String status) {
        try {
            List<JobApplication> applications = jobApplicationRepository.findByStatus(status);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching applications by status: " + e.getMessage());
        }
    }
} 