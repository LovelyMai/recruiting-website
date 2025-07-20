package com.example.Recruitingsystem.repository;

import com.example.Recruitingsystem.entities.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Integer> {
    
    // 查找求职者的所有申请
    List<JobApplication> findByJobseekerUserId(Integer jobseekerId);
    
    // 查找某个职位的所有申请
    List<JobApplication> findByJobJobId(Integer jobId);
    
    // 查找某个求职者对某个职位的申请
    JobApplication findByJobseekerUserIdAndJobJobId(Integer jobseekerId, Integer jobId);
    
    // 查找某个招聘者收到的所有申请
    @Query("SELECT ja FROM JobApplication ja WHERE ja.job.createdBy.userId = :employerId")
    List<JobApplication> findByEmployerId(@Param("employerId") Integer employerId);
    
    // 根据状态查找申请
    List<JobApplication> findByStatus(String status);
} 