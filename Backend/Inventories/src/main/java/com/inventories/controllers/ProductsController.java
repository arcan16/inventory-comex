package com.inventories.controllers;

import com.inventories.dto.products.ProductsDTO;
import com.inventories.repositories.ProductsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/products")
public class ProductsController {

    @Autowired
    private ProductsRepository productsRepository;

    @GetMapping
    public ResponseEntity<?> getAllProducts(@PageableDefault(size = 10, sort = "description")Pageable pageable){
        return ResponseEntity.ok(productsRepository.findAll(pageable).map(ProductsDTO::new));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllProductsWithOutPageable(){
        return ResponseEntity.ok(productsRepository.findAll().stream().map(ProductsDTO::new));
    }
}
