
package com.vaishnavi.loginapp.service;

import com.vaishnavi.loginapp.entity.Brand;
import com.vaishnavi.loginapp.entity.Chain;
import com.vaishnavi.loginapp.repository.BrandRepository;
import com.vaishnavi.loginapp.repository.ChainRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BrandService {

    private final BrandRepository brandRepository;
    private final ChainRepository chainRepository;

    public BrandService(BrandRepository brandRepository,
                        ChainRepository chainRepository) {
        this.brandRepository = brandRepository;
        this.chainRepository = chainRepository;
    }

    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    public Brand getBrandById(Long id) {
        return brandRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Brand not found with ID: " + id));
    }

    public Brand createBrand(Brand brand) {
        validateBrand(brand);
       brand.setBrandName(brand.getBrandName().trim());
brand.setChain(getChain(brand));
        return brandRepository.save(brand);
    }

    public Brand updateBrand(Long id, Brand updatedBrand) {
        Brand existingBrand = getBrandById(id);

        validateBrand(updatedBrand);

        existingBrand.setBrandName(updatedBrand.getBrandName().trim());
        existingBrand.setChain(getChain(updatedBrand));

        if (updatedBrand.getIsActive() != null) {
            existingBrand.setIsActive(updatedBrand.getIsActive());
        }

        return brandRepository.save(existingBrand);
    }

    public void deleteBrand(Long id) {
        Brand brand = getBrandById(id);
        brandRepository.delete(brand);
    }

    private void validateBrand(Brand brand) {
        if (brand.getBrandName() == null
                || brand.getBrandName().trim().isEmpty()) {
            throw new RuntimeException("Brand name is required");
        }

        if (brand.getBrandName().trim().length() > 50) {
            throw new RuntimeException(
                    "Brand name must not exceed 50 characters");
        }

        if (brand.getChain() == null
                || brand.getChain().getId() == null) {
            throw new RuntimeException("Please select a chain");
        }
    }

    private Chain getChain(Brand brand) {
        Long chainId = brand.getChain().getId();

        return chainRepository.findById(chainId)
                .orElseThrow(() ->
                        new RuntimeException("Chain not found with ID: " + chainId));
    }
}
