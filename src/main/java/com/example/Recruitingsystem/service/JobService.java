package com.example.Recruitingsystem.service;

import com.example.Recruitingsystem.entities.Job;
import com.example.Recruitingsystem.repository.JobRepository;
import com.example.Recruitingsystem.repository.UserRepository;
import com.example.Recruitingsystem.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.List;

@Service
public class JobService {
    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private UserRepository userRepository;

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    public Job updateJob(Integer id, Job jobDetails) {
        if (jobDetails.getJobId() != null && !jobDetails.getJobId().equals(id)) {
            throw new IllegalArgumentException("Job ID mismatch");
        }
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        job.setTitle(jobDetails.getTitle());
        job.setDescription(jobDetails.getDescription());
        job.setJobType(jobDetails.getJobType());
        job.setEduReq(jobDetails.getEduReq());
        job.setSalary(jobDetails.getSalary());
        job.setWorkExp(jobDetails.getWorkExp());
        job.setCompanyScale(jobDetails.getCompanyScale());
        job.setCompanyIndustry(jobDetails.getCompanyIndustry());
        job.setAddress(jobDetails.getAddress());
        return jobRepository.save(job);
    }

    public Page<Job> getAllJobs(Integer createdBy, int page, int size, String jobType, String eduReq, String salary,
            String workExp, String companyScale, String companyIndustry, String keyword) {
        int validatedSize = Math.min(size, 4);
        Pageable pageable = PageRequest.of(page, validatedSize);
        if (createdBy != null && !userRepository.existsById(createdBy)) {
            throw new ResourceNotFoundException("User not found with id: " + createdBy);
        }
        Specification<Job> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (createdBy != null) {
                predicates.add(cb.equal(root.get("createdBy").get("userId"), createdBy));
            }
            if (!keyword.trim().isEmpty()) {
                Predicate keywordPredicate = cb.or(
                        cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("description")), "%" + keyword.toLowerCase() + "%"));
                predicates.add(keywordPredicate);
            }
            if (!"不限".equals(jobType)) {
                predicates.add(cb.equal(root.get("jobType"), jobType));
            }
            if (!"全部".equals(eduReq)) {
                predicates.add(cb.equal(root.get("eduReq"), eduReq));
            }
            if (!"全部".equals(salary)) {
                predicates.add(cb.equal(root.get("salary"), salary));
            }
            if (!"全部".equals(workExp)) {
                predicates.add(cb.equal(root.get("workExp"), workExp));
            }
            if (!"全部".equals(companyScale)) {
                predicates.add(cb.equal(root.get("companyScale"), companyScale));
            }
            if (!"全部".equals(companyIndustry)) {
                predicates.add(cb.equal(root.get("companyIndustry"), companyIndustry));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return jobRepository.findAll(spec, pageable);
    }

    public Job getJobById(Integer id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
    }

    public void deleteJob(Integer id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        jobRepository.delete(job);
    }
}