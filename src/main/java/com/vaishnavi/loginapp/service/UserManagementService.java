package com.vaishnavi.loginapp.service;

import com.vaishnavi.loginapp.entity.User;
import com.vaishnavi.loginapp.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserManagementService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserManagementService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    // ==========================================
    // GET ALL USERS
    // ==========================================

    public List<User> getAllUsers() {

        List<User> users = userRepository.findAll();

        System.out.println("========== USER DEBUG ==========");
        System.out.println("Total users found: " + users.size());

        for (User user : users) {
            System.out.println("User ID: " + user.getId());
            System.out.println("User Email: " + user.getEmail());
        }

        System.out.println("================================");

        return users;
    }


    // ==========================================
    // GET USER BY ID
    // ==========================================

    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );
    }


    // ==========================================
    // ADD USER
    // ==========================================

    public User addUser(User user) {

        if (userRepository
                .findByEmail(user.getEmail())
                .isPresent()) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }


        // Encode password before saving

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );


        // Set default role

        if (user.getRole() == null ||
                user.getRole().trim().isEmpty()) {

            user.setRole("User");
        }


        // Set default status

        if (user.getStatus() == null ||
                user.getStatus().trim().isEmpty()) {

            user.setStatus("Active");
        }


        // Phone is not used in User Management

        user.setPhone(null);


        return userRepository.save(user);
    }


    // ==========================================
    // UPDATE USER
    // ==========================================

    public User updateUser(
            Long id,
            User updatedUser) {

        User existingUser =
                userRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        // Update full name

        existingUser.setFullName(
                updatedUser.getFullName()
        );


        // Update email

        existingUser.setEmail(
                updatedUser.getEmail()
        );


        // Update role

        if (updatedUser.getRole() != null &&
                !updatedUser.getRole().trim().isEmpty()) {

            existingUser.setRole(
                    updatedUser.getRole()
            );
        }


        // Update status

        if (updatedUser.getStatus() != null &&
                !updatedUser.getStatus().trim().isEmpty()) {

            existingUser.setStatus(
                    updatedUser.getStatus()
            );
        }


        // Update password only when
        // a new password is provided

        if (updatedUser.getPassword() != null &&
                !updatedUser.getPassword().trim().isEmpty()) {

            existingUser.setPassword(
                    passwordEncoder.encode(
                            updatedUser.getPassword()
                    )
            );
        }


        return userRepository.save(existingUser);
    }


    // ==========================================
    // DELETE USER
    // ==========================================

    @Transactional
    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {

            throw new RuntimeException(
                    "User not found"
            );
        }


        // Remove user from all groups first

        userRepository.removeUserFromGroups(id);


        // Delete user

        userRepository.deleteById(id);
    }
}