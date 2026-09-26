package com.inventories.dto.products;

import jakarta.validation.constraints.NotBlank;

/** Cuerpo de POST /products/{id}/presentations/barcode. "presentation" es el label ("1 LT", "4 LTS"...). */
public record AssignBarcodeDTO(@NotBlank String presentation, @NotBlank String barcode) {
}
