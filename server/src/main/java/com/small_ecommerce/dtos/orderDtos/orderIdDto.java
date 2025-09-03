package com.small_ecommerce.dtos.orderDtos;

import java.util.UUID;

public class orderIdDto {
    private UUID orderId;

    public orderIdDto() {}

    public orderIdDto(UUID orderId) {
        this.orderId = orderId;
    }

    public UUID getOrderId() {
        return orderId;
    }

    public void setOrderId(UUID orderId) {
        this.orderId = orderId;
    }
}
