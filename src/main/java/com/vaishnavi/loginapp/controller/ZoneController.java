
package com.vaishnavi.loginapp.controller;

import com.vaishnavi.loginapp.entity.Zone;
import com.vaishnavi.loginapp.service.ZoneService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zones")
@CrossOrigin(origins = "*")
public class ZoneController {

    private final ZoneService zoneService;

    public ZoneController(ZoneService zoneService) {
        this.zoneService = zoneService;
    }

    // Get all zones
    @GetMapping
    public List<Zone> getAllZones() {
        return zoneService.getAllZones();
    }

    // Get zones by brand
    @GetMapping("/brand/{brandId}")
    public List<Zone> getZonesByBrand(@PathVariable Long brandId) {
        return zoneService.getZonesByBrand(brandId);
    }

    // Add zone
    @PostMapping
    public Zone addZone(@RequestBody Zone zone) {
        return zoneService.addZone(zone);
    }

    // Update zone
    @PutMapping("/{id}")
    public Zone updateZone(@PathVariable Long id,
                           @RequestBody Zone zone) {
        return zoneService.updateZone(id, zone);
    }

    // Delete zone
    @DeleteMapping("/{id}")
    public String deleteZone(@PathVariable Long id) {
        zoneService.deleteZone(id);
        return "Zone deleted successfully";
    }
}
