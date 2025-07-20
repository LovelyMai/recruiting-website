package com.example.Recruitingsystem.service;

import com.example.Recruitingsystem.entities.User;
import com.example.Recruitingsystem.enums.UserRole;
import com.example.Recruitingsystem.repository.UserRepository;
import com.example.Recruitingsystem.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public Page<User> getAllUsers(int page, int size, String keyword) {
        int validatedSize = Math.min(size, 6);
        Pageable pageable = PageRequest.of(page, validatedSize);
        if (!keyword.isEmpty()) {
            return userRepository.findByAccountContaining(keyword, pageable);
        } else {
            return userRepository.findAll(pageable);
        }
    }

    public User createUser(User user) {
        if (userRepository.existsByAccount(user.getAccount())) {
            throw new RuntimeException("Account already exists");
        }
        return userRepository.save(user);
    }

    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User updateUser(Integer id, User userDetails) {
        if (userDetails.getUserId() != null && !userDetails.getUserId().equals(id)) {
            throw new IllegalArgumentException("User ID mismatch");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setEmail(userDetails.getEmail());
        user.setPhone(userDetails.getPhone());
        user.setAge(userDetails.getAge());
        user.setGender(userDetails.getGender());
        user.setCompany(userDetails.getCompany());
        user.setRealname(userDetails.getRealname());
        return userRepository.save(user);
    }

    public User updateUserRole(Integer id, UserRole role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setRole(role);
        return userRepository.save(user);
    }

    public void deleteUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }
}