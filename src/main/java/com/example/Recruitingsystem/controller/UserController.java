package com.example.Recruitingsystem.controller;

import com.example.Recruitingsystem.repository.UserRepository;
import com.example.Recruitingsystem.entities.User;
import com.example.Recruitingsystem.enums.UserRole;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import com.example.Recruitingsystem.service.UserService;
import com.example.Recruitingsystem.dto.UserDTO;

// ===================== 主要功能分块注释 =====================
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // 分页获取所有用户（修改后）
    @GetMapping
    public ResponseEntity<Page<UserDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(defaultValue = "") String keyword) {
        Page<User> users = userService.getAllUsers(page, size, keyword);
        Page<UserDTO> userDTOs = users.map(this::toUserDTO);
        return ResponseEntity.ok(userDTOs);
    }

    // 创建用户
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserDTO userDTO) {
        User user = new User();
        user.setAccount(userDTO.getAccount());
        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());
        user.setAge(userDTO.getAge());
        user.setGender(userDTO.getGender());
        user.setCompany(userDTO.getCompany());
        user.setSchool(userDTO.getSchool());
        user.setIntroduction(userDTO.getIntroduction());
        user.setRealname(userDTO.getRealname());
        user.setRole(userDTO.getRole());
        User createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(toUserDTO(createdUser));
    }

    // 根据ID获取用户
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Integer id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(toUserDTO(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Integer id,
            @Valid @RequestBody UserDTO userDTO) {
        User userDetails = new User();
        userDetails.setUserId(id);
        userDetails.setEmail(userDTO.getEmail());
        userDetails.setPhone(userDTO.getPhone());
        userDetails.setAge(userDTO.getAge());
        userDetails.setGender(userDTO.getGender());
        userDetails.setCompany(userDTO.getCompany());
        userDetails.setRealname(userDTO.getRealname());
        User updatedUser = userService.updateUser(id, userDetails);
        return ResponseEntity.ok(toUserDTO(updatedUser));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<UserDTO> updateUserRole(
            @PathVariable Integer id,
            @Valid @RequestBody RoleUpdateRequest request) {
        User updatedUser = userService.updateUserRole(id, request.getRole());
        return ResponseEntity.ok(toUserDTO(updatedUser));
    }

    // 内部类用于接收角色更新请求
    private static class RoleUpdateRequest {
        @NotNull(message = "Role cannot be null")
        private UserRole role;

        // Getter and Setter
        public UserRole getRole() {
            return role;
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    private UserDTO toUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setAccount(user.getAccount());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setAge(user.getAge());
        dto.setGender(user.getGender());
        dto.setCompany(user.getCompany());
        dto.setSchool(user.getSchool());
        dto.setIntroduction(user.getIntroduction());
        dto.setRealname(user.getRealname());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

}
