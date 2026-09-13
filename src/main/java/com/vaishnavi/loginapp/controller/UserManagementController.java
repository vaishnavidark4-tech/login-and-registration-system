
        package com.vaishnavi.loginapp.controller;

import com.vaishnavi.loginapp.entity.User;
import com.vaishnavi.loginapp.service.UserManagementService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public List<User> getAllUsers() {

        return userManagementService.getAllUsers();
    }


    // ==========================================
    // GET USER BY ID
    // ==========================================

    @GetMapping("/{id}")
    public User getUserById(
            @PathVariable Long id) {

        return userManagementService.getUserById(id);
    }


    // ==========================================
    // ADD USER
    // ==========================================

    @PostMapping
    public User addUser(
            @RequestBody User user) {

        return userManagementService.addUser(user);
    }


    // ==========================================
    // UPDATE USER
    // ==========================================

    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser) {

        return userManagementService.updateUser(
                id,
                updatedUser
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
}

