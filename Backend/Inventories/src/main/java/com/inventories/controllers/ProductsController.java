package com.inventories.controllers;

import com.inventories.dto.products.ProductsDTO;
import com.inventories.repositories.ProductsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/products")
public class ProductsController {

    @Autowired
    private ProductsRepository productsRepository;

    /**
     * Lista paginada de productos del catalogo. Si se recibe "q", filtra por
     * coincidencia parcial (sin distinguir mayusculas) en el id o la descripcion.
     */
    @GetMapping
    public ResponseEntity<?> getAllProducts(@RequestParam(required = false) String q,
                                             @PageableDefault(size = 20, sort = "description")Pageable pageable){
        if(q != null && !q.isBlank())
            return ResponseEntity.ok(productsRepository.search(q.trim(), pageable).map(ProductsDTO::new));
        return ResponseEntity.ok(productsRepository.findAll(pageable).map(ProductsDTO::new));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllProductsWithOutPageable(){
        return ResponseEntity.ok(productsRepository.findAll().stream().map(ProductsDTO::new));
    }
}
