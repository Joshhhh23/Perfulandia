package com.perfulandia.backend.controller;

import com.perfulandia.backend.dto.LoginRequest;
import com.perfulandia.backend.dto.LoginResponse;
import com.perfulandia.backend.model.Usuario;
import com.perfulandia.backend.repository.UsuarioRepository;
import com.perfulandia.backend.security.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:3000}")
public class AuthController {
    private final UsuarioRepository users; private final AuthenticationManager authManager;
    private final JwtService jwtService; private final PasswordEncoder encoder;
    public AuthController(UsuarioRepository users, AuthenticationManager authManager, JwtService jwtService, PasswordEncoder encoder) {
        this.users=users; this.authManager=authManager; this.jwtService=jwtService; this.encoder=encoder;
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication auth;
            try {
                auth=authManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            } catch (Exception invalid) {
                // Migración de una sola vez: cuentas antiguas almacenadas en texto plano se convierten a BCrypt tras un login válido.
                Usuario legacy=users.findByEmail(request.getEmail()).orElse(null);
                if (legacy == null || legacy.getPassword() == null || !legacy.getPassword().equals(request.getPassword())) throw invalid;
                legacy.setPassword(encoder.encode(request.getPassword())); users.save(legacy);
                auth=authManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            }
            UserDetails principal=(UserDetails)auth.getPrincipal();
            Usuario user=users.findByEmail(principal.getUsername()).orElseThrow();
            LoginResponse out=new LoginResponse(); out.setToken(jwtService.generateToken(principal));
            LoginResponse.UserDto dto=new LoginResponse.UserDto(); dto.setEmail(user.getEmail()); dto.setRole(user.getRole()); out.setUser(dto);
            return ResponseEntity.ok(out);
        } catch (Exception e) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","Credenciales incorrectas")); }
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (users.findByEmail(request.email()).isPresent()) return ResponseEntity.badRequest().body(Map.of("error","El correo ya está registrado"));
        Usuario user=new Usuario(); user.setEmail(request.email().trim().toLowerCase()); user.setNombre(request.nombre().trim());
        user.setPassword(encoder.encode(request.password())); user.setRole("USER"); users.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("mensaje","Usuario registrado"));
    }
    public record RegisterRequest(@NotBlank @Email String email, @NotBlank @Size(min=8,max=72) String password, @NotBlank @Size(max=100) String nombre) {}
}
