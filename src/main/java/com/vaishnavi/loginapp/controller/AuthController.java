
        package com.vaishnavi.loginapp.controller;

import com.vaishnavi.loginapp.dto.LoginRequest;
import com.vaishnavi.loginapp.dto.LoginResponse;
import com.vaishnavi.loginapp.dto.RegisterRequest;
import com.vaishnavi.loginapp.dto.RegisterResponse;
import com.vaishnavi.loginapp.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @RequestBody RegisterRequest request) {

        RegisterResponse response =
                authService.register(request);

        return ResponseEntity.ok(response);
    }


    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        System.out.println("Login API Called");

        LoginResponse response =
                authService.login(request);

        return ResponseEntity.ok(response);
    }
}

