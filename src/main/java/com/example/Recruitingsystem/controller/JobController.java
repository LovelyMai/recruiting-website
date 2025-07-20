package com.example.Recruitingsystem.controller;

import com.example.Recruitingsystem.entities.Job;
import com.example.Recruitingsystem.repository.UserRepository;
import com.example.Recruitingsystem.service.JobService;
import com.example.Recruitingsystem.dto.JobDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/jobs")
public class JobController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobService jobService;

    // ===================== 主要功能分块注释 =====================
    // 创建新职位
    @PostMapping
    public ResponseEntity<JobDTO> createJob(@Valid @RequestBody JobDTO jobDTO) {
        Job job = new Job();
        // 这里可以用 MapStruct 或手动赋值
        job.setTitle(jobDTO.getTitle());
        job.setDescription(jobDTO.getDescription());
        job.setJobType(jobDTO.getJobType());
        job.setEduReq(jobDTO.getEduReq());
        job.setSalary(jobDTO.getSalary());
        job.setWorkExp(jobDTO.getWorkExp());
        job.setCompanyScale(jobDTO.getCompanyScale());
        job.setCompanyIndustry(jobDTO.getCompanyIndustry());
        job.setAddress(jobDTO.getAddress());
        // createdBy 需要查找 User
        if (jobDTO.getCreatedBy() != null) {
            job.setCreatedBy(userRepository.findById(jobDTO.getCreatedBy()).orElseThrow(
                    () -> new ResourceNotFoundException("User not found with id: " + jobDTO.getCreatedBy())));
        }
        Job createdJob = jobService.createJob(job);
        JobDTO result = toJobDTO(createdJob);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    // 更新工作
    @PutMapping("/{id}")
    public ResponseEntity<JobDTO> updateJob(
            @PathVariable Integer id,
            @Valid @RequestBody JobDTO jobDTO) {
        Job jobDetails = new Job();
        jobDetails.setJobId(id);
        jobDetails.setTitle(jobDTO.getTitle());
        jobDetails.setDescription(jobDTO.getDescription());
        jobDetails.setJobType(jobDTO.getJobType());
        jobDetails.setEduReq(jobDTO.getEduReq());
        jobDetails.setSalary(jobDTO.getSalary());
        jobDetails.setWorkExp(jobDTO.getWorkExp());
        jobDetails.setCompanyScale(jobDTO.getCompanyScale());
        jobDetails.setCompanyIndustry(jobDTO.getCompanyIndustry());
        jobDetails.setAddress(jobDTO.getAddress());
        Job updatedJob = jobService.updateJob(id, jobDetails);
        JobDTO result = toJobDTO(updatedJob);
        return ResponseEntity.ok(result);
    }

    // 获取所有职位（带筛选功能）
    @GetMapping
    public ResponseEntity<Page<JobDTO>> getAllJobs(
            @RequestParam(required = false) Integer createdBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size,
            @RequestParam(defaultValue = "不限") String jobType,
            @RequestParam(defaultValue = "全部") String eduReq,
            @RequestParam(defaultValue = "全部") String salary,
            @RequestParam(defaultValue = "全部") String workExp,
            @RequestParam(defaultValue = "全部") String companyScale,
            @RequestParam(defaultValue = "全部") String companyIndustry,
            @RequestParam(defaultValue = "") String keyword) {
        Page<Job> jobs = jobService.getAllJobs(createdBy, page, size, jobType, eduReq, salary, workExp, companyScale,
                companyIndustry, keyword);
        Page<JobDTO> jobDTOs = jobs.map(this::toJobDTO);
        return ResponseEntity.ok(jobDTOs);
    }

    // 根据ID获取职位
    @GetMapping("/{id}")
    public ResponseEntity<JobDTO> getJobsById(@PathVariable Integer id) {
        Job job = jobService.getJobById(id);
        return ResponseEntity.ok(toJobDTO(job));
    }

    // 删除职位
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Integer id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    private JobDTO toJobDTO(Job job) {
        JobDTO dto = new JobDTO();
        dto.setJobId(job.getJobId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setJobType(job.getJobType());
        dto.setEduReq(job.getEduReq());
        dto.setSalary(job.getSalary());
        dto.setWorkExp(job.getWorkExp());
        dto.setCompanyScale(job.getCompanyScale());
        dto.setCompanyIndustry(job.getCompanyIndustry());
        dto.setAddress(job.getAddress());
        dto.setCreatedBy(job.getCreatedBy() != null ? job.getCreatedBy().getUserId() : null);
        dto.setCreatedAt(job.getCreatedAt());
        dto.setUpdatedAt(job.getUpdatedAt());
        return dto;
    }
}