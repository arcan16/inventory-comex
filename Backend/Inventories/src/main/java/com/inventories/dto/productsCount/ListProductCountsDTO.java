package com.inventories.dto.productsCount;

import com.inventories.models.ProductCountsEntity;

public record ListProductCountsDTO(Long id,
                                   Long idInventory,
                                   String idProduct,
                                   float quantity) {
    public ListProductCountsDTO(ProductCountsEntity productCounts){
        this(productCounts.getId(), productCounts.getIdInventory().getId(),
                productCounts.getIdProduct().getId(),productCounts.getQuantity());
    }
}
