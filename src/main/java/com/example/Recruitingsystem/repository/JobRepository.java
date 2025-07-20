package com.example.Recruitingsystem.repository;

import com.example.Recruitingsystem.entities.Job;
import com.example.Recruitingsystem.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Integer> {
    List<Job> findByCreatedBy(User user);

    // 根据创建者ID分页查询
    Page<Job> findByCreatedByUserId(Integer userId, Pageable pageable);

    Page<Job> findByCreatedByUserIdAndTitleContaining(
            Integer userId,
            String keyword,
            Pageable pageable);

    // 在 CourseRepository 中添加
    Page<Job> findByTitleContaining(String keyword, Pageable pageable);

    Page<Job> findAll(Specification<Job> spec, Pageable pageable);
}