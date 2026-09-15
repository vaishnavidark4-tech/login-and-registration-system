package com.vaishnavi.loginapp.dto;

public class UserResponseDTO {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String lastLogin;
    private String status;

    public UserResponseDTO() {
    }

    public UserResponseDTO(
            Long id,
            String fullName,
            String email,
            String phone,
            String role,
            String lastLogin,
            String status) {

        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.lastLogin = lastLogin;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(String lastLogin) {
        this.lastLogin = lastLogin;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}