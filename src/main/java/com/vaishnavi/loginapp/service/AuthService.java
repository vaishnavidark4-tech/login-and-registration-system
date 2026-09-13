package com.vaishnavi.loginapp.service;

import com.vaishnavi.loginapp.security.JwtService;
import com.vaishnavi.loginapp.dto.LoginRequest;
import com.vaishnavi.loginapp.dto.LoginResponse;
import com.vaishnavi.loginapp.dto.RegisterRequest;
import com.vaishnavi.loginapp.dto.RegisterResponse;
import com.vaishnavi.loginapp.entity.User;
import com.vaishnavi.loginapp.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }


    // ==========================================
    // REGISTER USER
    // ==========================================

    public RegisterResponse register(
            RegisterRequest request) {

        if (userRepository
                .findByEmail(request.getEmail())
                .isPresent()) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        User user = new User();

        user.setFullName(
                request.getFullName()
        );

        user.setEmail(
                request.getEmail().trim()
        );

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setPhone(null);
        user.setRole("User");
        user.setStatus("Active");

        User savedUser =
                userRepository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail()
        );
    }


    // ==========================================
    // LOGIN USER
    // ==========================================

    public LoginResponse login(
            LoginRequest request) {

        String email =
                request.getEmail().trim();

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid Password"
            );
        }


        // Update last login

        String lastLogin =
                LocalDateTime.now()
                        .format(
                                DateTimeFormatter.ofPattern(
                                        "yyyy-MM-dd HH:mm:ss"
                                )
                        );

        user.setLastLogin(lastLogin);

        userRepository.save(user);


        // Generate JWT

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );


        return new LoginResponse(token);
    }
}
