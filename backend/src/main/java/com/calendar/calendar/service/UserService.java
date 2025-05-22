package com.calendar.calendar.service;

import com.calendar.calendar.security.JwtUtil;
import com.calendar.calendar.models.Users;
import com.calendar.calendar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public Users save(Users users) {
        if (userRepository.findByUsername(users.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        users.setPassword(passwordEncoder.encode(users.getPassword()));
        return userRepository.save(users);
    }

    public Users findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public String loginUser(String identifier, String password) {
        System.out.println("[DEBUG] loginUser called with: " + identifier);
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(identifier, password)
            );
            System.out.println("[DEBUG] Authentication successful for: " + identifier);
        } catch (AuthenticationException e) {
            System.out.println("[DEBUG] Authentication failed: " + e.getMessage());
            throw new RuntimeException("Invalid username/email or password");
        }

        Users users = userRepository.findByUsernameOrEmail(identifier, identifier)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return jwtUtil.generateToken(users);
    }
}
