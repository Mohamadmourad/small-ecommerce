package com.small_ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.small_ecommerce.dtos.userDtos.AuthDto;
import com.small_ecommerce.model.User;
import com.small_ecommerce.service.UserService;


@RestController
@RequestMapping("/auth")
public class UserController {
    
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> createUser(@RequestBody AuthDto user){
        try{
            String jwt = userService.createUser(user);
            return new ResponseEntity<>(jwt, HttpStatus.CREATED);
        }
        catch(IllegalArgumentException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        catch(Exception e){
            return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody AuthDto user){
        try{
            String jwt = userService.loginUser(user);
            return new ResponseEntity<>(jwt, HttpStatus.OK);
        }
        catch(IllegalArgumentException e){ 
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
        catch(Exception e){
            return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/check-login")
    public ResponseEntity<String> checkLogin(@AuthenticationPrincipal User currentUser) {
        try {
            if (currentUser != null) {
                return currentUser.getRole().equals("ADMIN") ? new ResponseEntity<>("ADMIN", HttpStatus.OK) : new ResponseEntity<>("USER", HttpStatus.OK);
            }
            return new ResponseEntity<>("NOT-LOGGED-IN", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("NOT-LOGGED-IN", HttpStatus.OK);
        }
    }
    
}
