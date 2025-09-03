package com.small_ecommerce.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.small_ecommerce.dtos.cartDtos.CartItemDto;
import com.small_ecommerce.dtos.productsDtos.ProductIdDto;
import com.small_ecommerce.model.User;
import com.small_ecommerce.service.CartService;


@RestController
@RequestMapping("/cart")
public class CartController {
    
    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<String> addItemToCart(@RequestBody ProductIdDto productIdDto, @AuthenticationPrincipal User currentUser){
        try{
            UUID productId = productIdDto.getProductId();
            cartService.addItemToCart(productId, currentUser);
            return new ResponseEntity<>("added to cart", HttpStatus.CREATED);
        }   
        catch(Exception e){
            return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/items")
    public ResponseEntity<List<CartItemDto>> getCartItems(@AuthenticationPrincipal User currentUser) {
        try {
            List<CartItemDto> items = cartService.getCartItemsDto(currentUser);
            return new ResponseEntity<>(items, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFromCart(@RequestBody ProductIdDto productIdDto, @AuthenticationPrincipal User currentUser) {
        try {
            UUID productId = productIdDto.getProductId();
            cartService.removeFromCart(currentUser, productId);
            return new ResponseEntity<>("Removed from cart", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/increment")
    public ResponseEntity<String> incrementQuantity(@RequestBody ProductIdDto productIdDto, @AuthenticationPrincipal User currentUser) {
        try {
            UUID productId = productIdDto.getProductId();
            cartService.incrementQuantity(currentUser, productId);
            return new ResponseEntity<>("Quantity incremented", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/decrement")
    public ResponseEntity<String> decrementQuantity(@RequestBody ProductIdDto productIdDto, @AuthenticationPrincipal User currentUser) {
        try {
            UUID productId = productIdDto.getProductId();
            cartService.decrementQuantity(currentUser, productId);
            return new ResponseEntity<>("Quantity decremented", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
