package com.calendar.calendar.security;

import com.calendar.calendar.models.Users;
import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {
    private final String SECRET_KEY = "jN3lY8oC+ZaOQmlnJmzVGKmpw0gxznmyjvIsx0s1JRh5aM4eW2B9ty1xL5KF9U3HZaOQmlnJmzVGKmpw0gxznmyjvIsx0s1JRh5aM4eW2B9ty1xL5KF9U3HZaOQmlnJmzVGKmpw0gxznmyjvIsx0s1JRh5aM4eW2B9ty1xL5KF9U3H";

    public String generateToken(Users user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId());
        claims.put("username", user.getUsername());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole());

        long EXPIRATION_TIME = 86400000; // 1 day

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getUsername()) // this can stay as username
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }



    public String extractUsername(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
