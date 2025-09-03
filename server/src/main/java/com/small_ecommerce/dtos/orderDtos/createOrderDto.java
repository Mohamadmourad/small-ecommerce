package com.small_ecommerce.dtos.orderDtos;

public class createOrderDto {
    private String shippingAddress;
    private String phoneNumber;
    private String fullName;

    public createOrderDto() {}

    public createOrderDto(String shippingAddress, String phoneNumber, String fullName) {
        this.shippingAddress = shippingAddress;
        this.phoneNumber = phoneNumber;
        this.fullName = fullName;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
