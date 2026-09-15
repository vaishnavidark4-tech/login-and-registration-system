
        package com.vaishnavi.loginapp.controller;

import com.vaishnavi.loginapp.entity.User;
import com.vaishnavi.loginapp.service.UserManagementService;
import com.vaishnavi.loginapp.dto.UserResponseDTO;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://127.0.0.1:5500",
        "http://127.0.0.1:5501"
})
public class UserManagementController {

    private final UserManagementService userManagementService;

    public UserManagementController(
            UserManagementService userManagementService) {

        this.userManagementService = userManagementService;
    }


    // ==========================================
    // GET ALL USERS
    // ==========================================

    @GetMapping
    public List<UserResponseDTO> getAllUsers() {

        return userManagementService.getAllUsers()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // ==========================================
    // GET USER BY ID
    // ==========================================

    @GetMapping("/{id}")
    public UserResponseDTO getUserById(
            @PathVariable Long id) {

        return convertToDTO(
                userManagementService.getUserById(id)
        );
    }


    // ==========================================
    // ADD USER
    // ==========================================

    @PostMapping
    public UserResponseDTO addUser(
            @RequestBody User user) {

        return convertToDTO(
                userManagementService.addUser(user)
        );
    }


    // ==========================================
    // UPDATE USER
    // ==========================================

    @PutMapping("/{id}")
    public UserResponseDTO updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser) {

        return convertToDTO(
                userManagementService.updateUser(
                        id,
                        updatedUser
                )
        );
    }


    // ==========================================
    // DELETE USER
    // ==========================================

    @DeleteMapping("/{id}")
    public String deleteUser(
            @PathVariable Long id) {

        userManagementService.deleteUser(id);

        return "User deleted successfully";
    }


    // ==========================================
    // CONVERT USER TO DTO
    // ==========================================

    private UserResponseDTO convertToDTO(User user) {

        return new UserResponseDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getLastLogin(),
                user.getStatus()
        );
    }
}

