package com.vaishnavi.loginapp.dto;

import java.util.List;

public class GroupResponseDTO {

    private Long id;
    private String name;
    private String description;
    private String createdAt;
    private String status;
    private List<UserResponseDTO> members;

    public GroupResponseDTO() {
    }

    public GroupResponseDTO(
            Long id,
            String name,
            String description,
            String createdAt,
            String status,
            List<UserResponseDTO> members) {

        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.status = status;
        this.members = members;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<UserResponseDTO> getMembers() {
        return members;
    }

    public void setMembers(List<UserResponseDTO> members) {
        this.members = members;
    }
}