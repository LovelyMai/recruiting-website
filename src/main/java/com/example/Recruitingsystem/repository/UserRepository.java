package com.example.Recruitingsystem.repository;
import com.example.Recruitingsystem.entities.User;
import com.example.Recruitingsystem.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    // 检查账号是否存在
    boolean existsByAccount(String account);

    Page<User> findByRole(UserRole role, Pageable pageable);

    Optional<User> findByAccount(String account);

    Page<User> findByAccountContaining(String account, Pageable pageable);



    default Optional<User> findById(Long id) {
        if (id > Integer.MAX_VALUE) return Optional.empty();
        return findById(id.intValue());
    }




}