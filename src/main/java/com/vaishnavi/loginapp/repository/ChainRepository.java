package com.vaishnavi.loginapp.repository;

import com.vaishnavi.loginapp.entity.Chain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChainRepository extends JpaRepository<Chain, Long> {

    Optional<Chain> findByGstn(String gstn);
}