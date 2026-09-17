package com.inventories.dto.productsCount;

import com.inventories.models.ProductCountsEntity;

public record ProductCountsCreatedDTO(Long id,
                                      String idProduct,
                                      String description,
                                      float quantity) {
    public ProductCountsCreatedDTO(ProductCountsEntity productCounts) {
        this(productCounts.getId(), productCounts.getIdProduct().getId(),
                productCounts.getIdProduct().getDescription(), productCounts.getQuantity());
    }
}
