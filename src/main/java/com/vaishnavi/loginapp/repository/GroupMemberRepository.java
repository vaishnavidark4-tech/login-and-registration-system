package com.vaishnavi.loginapp.repository;

import com.vaishnavi.loginapp.entity.Group;
import com.vaishnavi.loginapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupMemberRepository extends JpaRepository<Group, Long> {

    @Modifying
    @Query(value = "DELETE FROM group_members WHERE user_id = :userId", nativeQuery = true)
    void deleteUserFromGroups(@Param("userId") Long userId);
}