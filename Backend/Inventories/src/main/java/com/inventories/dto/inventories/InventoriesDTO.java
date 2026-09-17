package com.inventories.dto.inventories;

import com.inventories.models.InventoriesEntity;

import java.sql.Date;

public record InventoriesDTO(Long id,
                             Date date,
                             String presentation) {
    public InventoriesDTO(InventoriesEntity inventories){
        this(inventories.getId(), inventories.getInventoryDate(), inventories.getPresentation());
    }
}
