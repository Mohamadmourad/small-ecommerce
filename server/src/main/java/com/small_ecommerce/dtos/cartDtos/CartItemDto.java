package com.small_ecommerce.dtos.cartDtos;

import java.util.UUID;

public class CartItemDto {
    private UUID id;
    private UUID productId;
    private String productName;
    private double productPrice;
    private int productStock;
    private boolean isOutOfStock;
    private int quantity;
    private double totalPrice;

    public CartItemDto() {}

    public CartItemDto(UUID id, UUID productId, String productName, double productPrice, int productStock, boolean isOutOfStock, int quantity) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productPrice = productPrice;
        this.productStock = productStock;
        this.isOutOfStock = isOutOfStock;
        this.quantity = quantity;
        this.totalPrice = productPrice * quantity;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public double getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(double productPrice) {
        this.productPrice = productPrice;
        this.totalPrice = productPrice * quantity; 
    }

    public int getProductStock() {
        return productStock;
    }

    public void setProductStock(int productStock) {
        this.productStock = productStock;
    }

    public boolean isOutOfStock() {
        return isOutOfStock;
    }

    public void setOutOfStock(boolean outOfStock) {
        isOutOfStock = outOfStock;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
        this.totalPrice = productPrice * quantity; 
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }
}
