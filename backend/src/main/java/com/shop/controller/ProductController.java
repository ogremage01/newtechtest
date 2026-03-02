package com.shop.controller;

import com.shop.dto.ProductDto;
import com.shop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.origins:http://localhost:3000}", allowCredentials = "true")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDto>> list() {
        return ResponseEntity.ok(productService.findAll());
    }

    // GET http://localhost:8080/api/products/search?q=검색어
    @GetMapping("/search")
    public ResponseEntity<List<ProductDto>> search(@RequestParam(value = "q", required = false) String q) {
        return ResponseEntity.ok(productService.searchByName(q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> get(@PathVariable Long id) {
        ProductDto dto = productService.findById(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }
}
