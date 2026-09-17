package com.inventories.repositories;

import com.inventories.models.ProductsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductsRepository extends JpaRepository<ProductsEntity, Long> {

    @Query("""
            SELECT p FROM ProductsEntity p WHERE p.id = :id
            """)
    ProductsEntity findByStringId(String id);
}
