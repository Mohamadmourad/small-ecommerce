package com.small_ecommerce.dtos.productsDtos;

import java.util.UUID;

public class ProductIdDto {
    private UUID productId;

    public ProductIdDto() {}

    public ProductIdDto(UUID productId) {
        this.productId = productId;
    }

    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }
}

