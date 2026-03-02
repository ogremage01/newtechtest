package com.shop.controller;

import com.shop.dto.AuthResponse;
import com.user.dto.LoginRequestDto;
import com.shop.security.JwtUtil;
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

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequestDto request) {
        // TODO: 실제 인증 로직 (UserService, password encoder)
        String token = jwtUtil.generateToken(request.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, "1", request.getEmail()));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, String> body) {
        // TODO: 회원가입 로직
        return ResponseEntity.ok(Map.of("message", "Registered"));
    }
}
