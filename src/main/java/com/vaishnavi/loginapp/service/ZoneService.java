

package com.vaishnavi.loginapp.service;

import com.vaishnavi.loginapp.entity.Brand;
import com.vaishnavi.loginapp.entity.Zone;
import com.vaishnavi.loginapp.repository.BrandRepository;
import com.vaishnavi.loginapp.repository.ZoneRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ZoneService {

    private final ZoneRepository zoneRepository;
    private final BrandRepository brandRepository;

    public ZoneService(ZoneRepository zoneRepository,
                       BrandRepository brandRepository) {
        this.zoneRepository = zoneRepository;
        this.brandRepository = brandRepository;
    }

    // Get all zones
    public List<Zone> getAllZones() {
        return zoneRepository.findAll();
    }

    // Get zones by brand
    public List<Zone> getZonesByBrand(Long brandId) {
        return zoneRepository.findByBrandBrandId(brandId);
    }

    // Add zone
    public Zone addZone(Zone zone) {

        if (zone.getZoneName() == null ||
                zone.getZoneName().trim().isEmpty()) {
            throw new RuntimeException("Zone name is required");
        }

        if (zone.getBrand() == null ||
                zone.getBrand().getBrandId() == null) {
            throw new RuntimeException("Please select a brand");
        }

        Brand brand = brandRepository.findById(
                zone.getBrand().getBrandId()
        ).orElseThrow(() ->
                new RuntimeException("Brand not found"));

        zone.setBrand(brand);
        zone.setZoneName(zone.getZoneName().trim());

        return zoneRepository.save(zone);
    }

    // Update zone
    public Zone updateZone(Long id, Zone updatedZone) {

        Zone existingZone = zoneRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Zone not found"));

        if (updatedZone.getZoneName() == null ||
                updatedZone.getZoneName().trim().isEmpty()) {
            throw new RuntimeException("Zone name is required");
        }

        if (updatedZone.getBrand() == null ||
                updatedZone.getBrand().getBrandId() == null) {
            throw new RuntimeException("Please select a brand");
        }

        Brand brand = brandRepository.findById(
                updatedZone.getBrand().getBrandId()
        ).orElseThrow(() ->
                new RuntimeException("Brand not found"));

        existingZone.setZoneName(updatedZone.getZoneName().trim());
        existingZone.setBrand(brand);

        return zoneRepository.save(existingZone);
    }

    // Delete zone
    public void deleteZone(Long id) {

        if (!zoneRepository.existsById(id)) {
            throw new RuntimeException("Zone not found");
        }

        zoneRepository.deleteById(id);
    }
}
