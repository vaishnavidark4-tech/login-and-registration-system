package com.vaishnavi.loginapp.repository;

import com.vaishnavi.loginapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Modifying
    @Query(
            value = "DELETE FROM group_members WHERE user_id = :userId",
            nativeQuery = true
    )
    void removeUserFromGroups(@Param("userId") Long userId);
}