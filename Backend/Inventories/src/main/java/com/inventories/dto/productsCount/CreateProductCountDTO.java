package com.inventories.dto.productsCount;

import javax.validation.constraints.NotNull;

public record CreateProductCountDTO(@NotNull Long idInventory,
                                    @NotNull String idProduct,
                                    @NotNull String description,
                                    @NotNull Float quantity) {
}
