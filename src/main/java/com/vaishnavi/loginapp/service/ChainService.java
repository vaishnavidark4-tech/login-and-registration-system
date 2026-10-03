package com.vaishnavi.loginapp.service;

import com.vaishnavi.loginapp.entity.Chain;
import com.vaishnavi.loginapp.entity.Group;
import com.vaishnavi.loginapp.repository.ChainRepository;
import com.vaishnavi.loginapp.repository.GroupRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChainService {

    private final ChainRepository chainRepository;
    private final GroupRepository groupRepository;

    public ChainService(ChainRepository chainRepository,
                        GroupRepository groupRepository) {
        this.chainRepository = chainRepository;
        this.groupRepository = groupRepository;
    }

    // View all chains
    public List<Chain> getAllChains() {
        return chainRepository.findAll();
    }

    // View chain by ID
    public Chain getChainById(Long id) {
        return chainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chain not found"));
    }

    // Add new chain
    public Chain createChain(Chain chain) {

        // Company name validation
        if (chain.getCompanyName() == null ||
                chain.getCompanyName().trim().isEmpty()) {

            throw new RuntimeException("Company name is required");
        }

        // GSTN validation
        if (chain.getGstn() == null ||
                chain.getGstn().trim().isEmpty()) {

            throw new RuntimeException("GSTN is required");
        }

        // Group validation
        if (chain.getGroup() == null ||
                chain.getGroup().getId() == null) {

            throw new RuntimeException("Group is required");
        }

        // Duplicate GSTN validation
        Optional<Chain> existingChain =
                chainRepository.findByGstn(chain.getGstn());

        if (existingChain.isPresent()) {
            throw new RuntimeException("GSTN already exists");
        }

        // Check whether group exists
        Group group = groupRepository.findById(chain.getGroup().getId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        chain.setGroup(group);

        return chainRepository.save(chain);
    }

    // Update chain
    public Chain updateChain(Long id, Chain updatedChain) {

        Chain existingChain = chainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chain not found"));

        // Company name validation
        if (updatedChain.getCompanyName() == null ||
                updatedChain.getCompanyName().trim().isEmpty()) {

            throw new RuntimeException("Company name is required");
        }

        // GSTN validation
        if (updatedChain.getGstn() == null ||
                updatedChain.getGstn().trim().isEmpty()) {

            throw new RuntimeException("GSTN is required");
        }

        // Duplicate GSTN validation
        Optional<Chain> chainWithSameGstn =
                chainRepository.findByGstn(updatedChain.getGstn());

        if (chainWithSameGstn.isPresent() &&
                !chainWithSameGstn.get().getId().equals(id)) {

            throw new RuntimeException("GSTN already exists");
        }

        // Group validation
        if (updatedChain.getGroup() == null ||
                updatedChain.getGroup().getId() == null) {

            throw new RuntimeException("Group is required");
        }

        // Check whether group exists
        Group group = groupRepository.findById(
                updatedChain.getGroup().getId()
        ).orElseThrow(() -> new RuntimeException("Group not found"));

        existingChain.setCompanyName(updatedChain.getCompanyName());
        existingChain.setGstn(updatedChain.getGstn());
        existingChain.setGroup(group);

        return chainRepository.save(existingChain);
    }

    // Delete chain
    public void deleteChain(Long id) {

        if (!chainRepository.existsById(id)) {
            throw new RuntimeException("Chain not found");
        }

        chainRepository.deleteById(id);
    }
}