package com.example.Recruitingsystem.service;

import com.example.Recruitingsystem.dto.RegisterRequest;
import com.example.Recruitingsystem.dto.LoginRequest;
import com.example.Recruitingsystem.dto.ChangePasswordRequest;
import com.example.Recruitingsystem.entities.User;
import com.example.Recruitingsystem.enums.UserRole;
import com.example.Recruitingsystem.repository.UserRepository;
import com.example.Recruitingsystem.exception.ResourceNotFoundException;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Map;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    private static final String SALT = "someStaticSalt";
    private static final String SESSION_USER_KEY = "currentUser";

    public ResponseEntity<Map<String, Object>> register(RegisterRequest request, HttpSession session) {
        if (userRepository.findByAccount(request.getAccount()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("success", false, "message", "账号已存在"));
        }

        User user = new User();
        user.setAccount(request.getAccount());
        user.setPassword(hashPassword(request.getPassword()));

        try {
            user.setRole(UserRole.valueOf(request.getRole().toUpperCase()));
        } catch (IllegalArgumentException e) {
            user.setRole(UserRole.EMPLOYER);
        }

        User savedUser = userRepository.save(user);
        session.setAttribute(SESSION_USER_KEY, savedUser.getUserId());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "注册成功",
                "id", savedUser.getUserId(),
                "role", savedUser.getRole().name()));
    }

    public ResponseEntity<Map<String, Object>> login(LoginRequest request, HttpSession session) {
        User user = userRepository.findByAccount(request.getAccount())
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));

        if (!hashPassword(request.getPassword()).equals(user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "密码错误"));
        }

        session.setAttribute(SESSION_USER_KEY, user.getUserId());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "id", user.getUserId(),
                "account", user.getAccount(),
                "role", user.getRole().name()));
    }

    public ResponseEntity<Map<String, Object>> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("success", true, "message", "已退出登录"));
    }

    public ResponseEntity<Map<String, Object>> changePassword(ChangePasswordRequest request, HttpSession session) {
        Integer intUserId = (Integer) session.getAttribute(SESSION_USER_KEY);
        if (intUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "请先登录"));
        }
        Long userId = intUserId.longValue();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));

        if (!hashPassword(request.getOldPassword()).equals(user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "旧密码错误"));
        }

        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "新密码与确认密码不一致"));
        }

        user.setPassword(hashPassword(request.getNewPassword()));
        userRepository.save(user);
        session.invalidate();

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "密码修改成功，请重新登录"));
    }

    public ResponseEntity<Map<String, Object>> checkAuth(HttpSession session) {
        Long userId = (Long) session.getAttribute(SESSION_USER_KEY);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("authenticated", false));
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));

        return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "id", user.getUserId(),
                "account", user.getAccount(),
                "role", user.getRole().name()));
    }

    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String saltedPassword = SALT + password;
            byte[] hash = digest.digest(saltedPassword.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("哈希算法不可用", e);
        }
    }
}