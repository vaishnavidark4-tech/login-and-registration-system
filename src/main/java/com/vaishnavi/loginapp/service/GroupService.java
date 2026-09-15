package com.vaishnavi.loginapp.service;

import com.vaishnavi.loginapp.entity.Group;
import com.vaishnavi.loginapp.entity.User;
import com.vaishnavi.loginapp.repository.GroupRepository;
import com.vaishnavi.loginapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    public GroupService(GroupRepository groupRepository,
                        UserRepository userRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
    }


    // =========================
    // GET ALL GROUPS
    // =========================

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }


    // =========================
    // GET GROUP BY ID
    // =========================

    public Group getGroupById(Long id) {
        return groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found"));
    }


    // =========================
    // CREATE GROUP
    // =========================

    public Group createGroup(Group group) {
        return groupRepository.save(group);
    }


    // =========================
    // UPDATE GROUP
    // =========================

    public Group updateGroup(Long id, Group updatedGroup) {

        Group existingGroup = groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        existingGroup.setName(updatedGroup.getName());
        existingGroup.setDescription(updatedGroup.getDescription());
        existingGroup.setStatus(updatedGroup.getStatus());

        return groupRepository.save(existingGroup);
    }


    // =========================
    // DELETE GROUP
    // =========================

    public void deleteGroup(Long id) {

        if (!groupRepository.existsById(id)) {
            throw new RuntimeException("Group not found");
        }

        groupRepository.deleteById(id);
    }


    // =========================
    // ADD MEMBER TO GROUP
    // =========================

    public Group addMember(Long groupId, Long userId) {

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        group.getMembers().add(user);

        return groupRepository.save(group);
    }


    // =========================
    // REMOVE MEMBER FROM GROUP
    // =========================

    public Group removeMember(Long groupId, Long userId) {

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        group.getMembers()
                .removeIf(user -> user.getId().equals(userId));

        return groupRepository.save(group);
    }
}