package com.vaishnavi.loginapp.controller;

import com.vaishnavi.loginapp.entity.Chain;
import com.vaishnavi.loginapp.service.ChainService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chains")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://localhost:5501",
        "http://127.0.0.1:5501"
})
public class ChainManagementController {

    private final ChainService chainService;

    public ChainManagementController(ChainService chainService) {
        this.chainService = chainService;
    }

    // View all chains
    @GetMapping
    public ResponseEntity<List<Chain>> getAllChains() {
        return ResponseEntity.ok(chainService.getAllChains());
    }

    // View chain by ID
    @GetMapping("/{id}")
    public ResponseEntity<Chain> getChainById(@PathVariable Long id) {
        return ResponseEntity.ok(chainService.getChainById(id));
    }

    // Add new chain
    @PostMapping
    public ResponseEntity<Chain> createChain(@RequestBody Chain chain) {
        return ResponseEntity.ok(chainService.createChain(chain));
    }

    // Update chain
    @PutMapping("/{id}")
    public ResponseEntity<Chain> updateChain(
            @PathVariable Long id,
            @RequestBody Chain chain) {

        return ResponseEntity.ok(
                chainService.updateChain(id, chain)
        );
    }

    // Delete chain
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteChain(@PathVariable Long id) {

        chainService.deleteChain(id);

        return ResponseEntity.ok("Chain deleted successfully");
    }
}