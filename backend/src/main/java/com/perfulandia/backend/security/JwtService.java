package com.perfulandia.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {
    private final String secret;
    private final long expirationMs;
    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.expiration:86400000}") long expirationMs) {
        this.secret = secret; this.expirationMs = expirationMs;
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32)
            throw new IllegalStateException("JWT_SECRET debe tener al menos 32 bytes");
    }
    private SecretKey signingKey() { return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); }
    public String generateToken(UserDetails user) {
        Date now = new Date();
        return Jwts.builder().setSubject(user.getUsername()).setIssuedAt(now)
            .setExpiration(new Date(now.getTime() + expirationMs)).signWith(signingKey()).compact();
    }
    public String extractUsername(String token) { return extractClaim(token, Claims::getSubject); }
    public <T> T extractClaim(String token, Function<Claims,T> resolver) {
        return resolver.apply(Jwts.parserBuilder().setSigningKey(signingKey()).build().parseClaimsJws(token).getBody());
    }
    public boolean isTokenValid(String token, UserDetails user) {
        try { return user.getUsername().equals(extractUsername(token)) && extractClaim(token, Claims::getExpiration).after(new Date()); }
        catch (Exception e) { return false; }
    }
}
