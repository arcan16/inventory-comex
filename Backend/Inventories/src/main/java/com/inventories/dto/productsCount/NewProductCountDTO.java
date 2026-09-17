package com.inventories.dto.productsCount;


import javax.validation.constraints.NotNull;

public record NewProductCountDTO(@NotNull Long idInventory,
                                 @NotNull String idProduct,
                                 @NotNull Float quantity) {
}
