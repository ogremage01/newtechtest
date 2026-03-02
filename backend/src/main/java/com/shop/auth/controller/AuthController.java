package com.shop.auth.controller;

import com.shop.auth.dto.AuthResponse;
import com.shop.auth.dto.LoginRequestDto;
import com.shop.auth.dto.SignInRequestDto;
import com.shop.security.JwtUtil;
import com.shop.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.origins:http://localhost:3000}", allowCredentials = "true")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    // POST http://localhost:8080/api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequestDto request) {
        // TODO: 실제 인증 로직 (UserService, password encoder)
        String token = jwtUtil.generateToken(request.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, "1", request.getEmail()));
    }

    // POST http://localhost:8080/api/auth/register
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody SignInRequestDto request) {
        userService.register(request);
        return ResponseEntity.ok(Map.of("message", "Registered"));
    }
}
