

package com.vaishnavi.loginapp.repository;

import com.vaishnavi.loginapp.entity.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, Long> {

    List<Zone> findByBrandBrandId(Long brandId);

}
