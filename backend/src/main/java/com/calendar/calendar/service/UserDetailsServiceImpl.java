package com.calendar.calendar.service;

import com.calendar.calendar.models.Users;
import com.calendar.calendar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        System.out.println("[DEBUG] loadUserByUsername called with: " + identifier);

        Users user = userRepository.findByUsernameOrEmail(identifier, identifier)
                .orElseThrow(() -> {
                    System.out.println("[DEBUG] User not found with username or email: " + identifier);
                    return new UsernameNotFoundException("User not found");
                });

        System.out.println("[DEBUG] Found user: " + user.getUsername() + ", role: " + user.getRole());

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(() -> "ROLE_" + user.getRole().toUpperCase())
        );
    }

}
