package com.shop.service;

import com.shop.dto.ProductDto;
import com.shop.entity.Product;
import com.shop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductDto> findAll() {
        return productRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ProductDto findById(Long id) {
        return productRepository.findById(id)
                .map(this::toDto)
                .orElse(null);
    }

    /**
     * 이름 기준 검색. Redis 캐시 적용 시 이 메서드에 @Cacheable(key = "#name", unless = "#result.isEmpty()") 등으로 캐싱 가능.
     */
    public List<ProductDto> searchByName(String name) {
        if (name == null || name.isBlank()) {
            return findAll();
        }
        return productRepository.findByNameContainingIgnoreCase(name.trim()).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private ProductDto toDto(Product p) {
        return ProductDto.builder()
                .id(String.valueOf(p.getId()))
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .imageUrl(p.getImageUrl())
                .build();
    }
}
