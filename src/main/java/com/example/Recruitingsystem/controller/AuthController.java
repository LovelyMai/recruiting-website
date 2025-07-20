package com.example.Recruitingsystem.controller;

import com.example.Recruitingsystem.repository.UserRepository;
import com.example.Recruitingsystem.service.AuthService;
import com.example.Recruitingsystem.dto.RegisterRequest;
import com.example.Recruitingsystem.dto.LoginRequest;
import com.example.Recruitingsystem.dto.ChangePasswordRequest;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // ===================== 用户认证相关接口 =====================
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpSession session) {
        return authService.register(request, session);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @Valid @RequestBody LoginRequest request,
            HttpSession session) {
        return authService.login(request, session);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpSession session) {
        return authService.logout(session);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            HttpSession session) {
        return authService.changePassword(request, session);
    }

    @GetMapping("/check-auth")
    public ResponseEntity<Map<String, Object>> checkAuth(HttpSession session) {
        return authService.checkAuth(session);
    }

}
