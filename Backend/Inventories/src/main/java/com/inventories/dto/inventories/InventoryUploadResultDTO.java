package com.inventories.dto.inventories;

public record InventoryUploadResultDTO(Long inventoryId,
                                       String presentation,
                                       int rowsProcessed,
                                       int productsCreated,
                                       int stockRowsCreated) {
}
