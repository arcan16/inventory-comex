package com.inventories.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity(name = "ProductCountsEntity")
@Table(name = "product_counts")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class ProductCountsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_inventory")
    private InventoriesEntity idInventory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_product")
        private ProductsEntity idProduct;

    private float quantity;

}
