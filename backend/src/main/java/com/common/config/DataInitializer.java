package com.common.config;

import com.shop.entity.Product;
import com.shop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Profile("!test")
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) return;
        productRepository.save(Product.builder().name("샘플 상품 1").description("설명 1").price(10000L).build());
        productRepository.save(Product.builder().name("샘플 상품 2").description("설명 2").price(20000L).build());
    }
}
