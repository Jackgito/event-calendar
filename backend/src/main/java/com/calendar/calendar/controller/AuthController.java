package com.calendar.calendar.controller;

import com.calendar.calendar.security.JwtUtil;
import com.calendar.calendar.models.Users;
import com.calendar.calendar.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public AuthController(AuthenticationManager authManager, JwtUtil jwtUtil, UserService userService) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @PostMapping("/register")
    public String register(@RequestBody Users users) {
        userService.save(users);
        return "User registered!";
    }

    @PostMapping("/login")
    public String login(@RequestBody Users users) {
        return userService.loginUser(users.getUsername(), users.getPassword());
    }
}
