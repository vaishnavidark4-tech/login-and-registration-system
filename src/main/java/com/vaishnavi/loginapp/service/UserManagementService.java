package com.vaishnavi.loginapp.service;

import com.vaishnavi.loginapp.entity.User;
import com.vaishnavi.loginapp.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

        return userRepository.findAll();
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


        // Default values

        user.setRole("User");

        user.setStatus("Active");

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


        existingUser.setFullName(
                updatedUser.getFullName()
        );

        existingUser.setEmail(
                updatedUser.getEmail()
        );


        return userRepository.save(existingUser);
    }


    // ==========================================
    // DELETE USER
    // ==========================================

    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {

            throw new RuntimeException(
                    "User not found"
            );
        }


        userRepository.deleteById(id);
    }
}