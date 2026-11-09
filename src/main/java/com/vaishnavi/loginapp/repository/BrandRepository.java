package com.vaishnavi.loginapp.repository;

import com.vaishnavi.loginapp.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand, Long> {
}