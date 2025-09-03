package com.small_ecommerce.dtos.orderDtos;

import java.util.List;
import java.util.UUID;

import com.small_ecommerce.model.OrderItems;

public class orderDto {
    private UUID orderId;
    private double totalAmount;
    private List<OrderItems> items;
    private String paymentStatus;
    private String fullName;
    private String phoneNumber;
    private String shippingAddress;


    public orderDto() {}

    public orderDto(UUID orderId, double totalAmount, List<OrderItems> items, String paymentStatus, String fullName, String phoneNumber, String shippingAddress) {
        this.orderId = orderId;
        this.totalAmount = totalAmount;
        this.items = items;
        this.paymentStatus = paymentStatus;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.shippingAddress = shippingAddress;
    }

    public UUID getOrderId() {
        return orderId;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public List<OrderItems> getItems() {
        return items;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }
}
