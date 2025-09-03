package com.small_ecommerce.controller;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.small_ecommerce.dtos.orderDtos.createOrderDto;
import com.small_ecommerce.dtos.orderDtos.orderDto;
import com.small_ecommerce.dtos.orderDtos.orderIdDto;
import com.small_ecommerce.model.User;
import com.small_ecommerce.service.OrderService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<String> createOrder(@AuthenticationPrincipal User currentUser, @RequestBody createOrderDto orderDto) {
        try {
            UUID orderId = orderService.createOrder(currentUser, orderDto);
            return new ResponseEntity<>(orderId.toString(), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            System.out.print(e);
            return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<orderDto>> getUserOrders(@AuthenticationPrincipal User currentUser) {
        try {
            List<orderDto> orders = orderService.getUserOrders(currentUser);
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/cancel")
    public ResponseEntity<String> cancelOrder(@AuthenticationPrincipal User currentUser, @RequestBody orderIdDto orderIdDto) {
        try {
            orderService.cancelOrder(currentUser, orderIdDto.getOrderId());
            return new ResponseEntity<>("Order cancelled successfully", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/pay")
    public ResponseEntity<String> payOrder(@AuthenticationPrincipal User currentUser,
@RequestBody orderIdDto orderIdDto) {
        try {
            orderService.payOrder(currentUser, orderIdDto.getOrderId());
            return new ResponseEntity<>("Order payment successful", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/admin/orders")
    public ResponseEntity<List<orderDto>> getAllOrders() {
        List<orderDto> orders = orderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

}
