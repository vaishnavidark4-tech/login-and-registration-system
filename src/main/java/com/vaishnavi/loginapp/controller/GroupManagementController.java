package com.vaishnavi.loginapp.controller;

import com.vaishnavi.loginapp.dto.GroupResponseDTO;
import com.vaishnavi.loginapp.dto.UserResponseDTO;
import com.vaishnavi.loginapp.entity.Group;
import com.vaishnavi.loginapp.entity.User;
import com.vaishnavi.loginapp.service.GroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5500",
        "http://localhost:5501"
})
public class GroupManagementController {

    private final GroupService groupService;

    public GroupManagementController(GroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping
    public ResponseEntity<List<GroupResponseDTO>> getAllGroups() {

        List<GroupResponseDTO> groups =
                groupService.getAllGroups()
                        .stream()
                        .map(this::convertToDTO)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(groups);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupResponseDTO> getGroupById(
            @PathVariable Long id) {

        Group group = groupService.getGroupById(id);

        return ResponseEntity.ok(convertToDTO(group));
    }

    @PostMapping
    public ResponseEntity<GroupResponseDTO> createGroup(
            @RequestBody Group group) {

        Group createdGroup =
                groupService.createGroup(group);

        return ResponseEntity.ok(
                convertToDTO(createdGroup)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<GroupResponseDTO> updateGroup(
            @PathVariable Long id,
            @RequestBody Group group) {

        Group updatedGroup =
                groupService.updateGroup(id, group);

        return ResponseEntity.ok(
                convertToDTO(updatedGroup)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGroup(
            @PathVariable Long id) {

        groupService.deleteGroup(id);

        return ResponseEntity.ok(
                "Group deleted successfully"
        );
    }

    @PostMapping("/{groupId}/members/{userId}")
    public ResponseEntity<GroupResponseDTO> addMember(
            @PathVariable Long groupId,
            @PathVariable Long userId) {

        Group updatedGroup =
                groupService.addMember(groupId, userId);

        return ResponseEntity.ok(
                convertToDTO(updatedGroup)
        );
    }

    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<GroupResponseDTO> removeMember(
            @PathVariable Long groupId,
            @PathVariable Long userId) {

        Group updatedGroup =
                groupService.removeMember(groupId, userId);

        return ResponseEntity.ok(
                convertToDTO(updatedGroup)
        );
    }

    // Converts Group Entity into safe GroupResponseDTO
    private GroupResponseDTO convertToDTO(Group group) {

        List<UserResponseDTO> members =
                group.getMembers()
                        .stream()
                        .map(this::convertUserToDTO)
                        .collect(Collectors.toList());

        return new GroupResponseDTO(
                group.getId(),
                group.getName(),
                group.getDescription(),
                group.getCreatedAt(),
                group.getStatus(),
                members
        );
    }

    // Converts User Entity into safe UserResponseDTO
    private UserResponseDTO convertUserToDTO(User user) {

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