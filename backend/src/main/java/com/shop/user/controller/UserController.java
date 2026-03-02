package com.shop.user.controller;

// 회원 가입, 로그인, 로그아웃, 탈퇴
// 정보 수정, 비밀번호 변경, 비밀번호 찾기, 비밀번호 재설정
// 비밀번호 재설정 이메일 발송, 비밀번호 재설정 이메일 인증
// 비밀번호 재설정 이메일 인증 코드 발송, 비밀번호 재설정 이메일 인증 코드 인증

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import com.shop.user.service.UserService;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 로그아웃
    // POST http://localhost:8080/api/user/logout
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestBody Map<String, String> body) {
        // TODO: 로그아웃 로직
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    // 탈퇴
    // POST http://localhost:8080/api/user/withdraw
    @PostMapping("/withdraw")
    public ResponseEntity<Map<String, String>> withdraw(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "Withdrawn"));
    }

    // 정보 수정
    // POST http://localhost:8080/api/user/update
    @PostMapping("/update")
    public ResponseEntity<Map<String, String>> update(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "Updated"));
    }

    // 비밀번호 변경
    // POST http://localhost:8080/api/user/change-password
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "Password changed"));
    }

    // 비밀번호 찾기
    // POST http://localhost:8080/api/user/find-password
    @PostMapping("/find-password")
    public ResponseEntity<Map<String, String>> findPassword(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "Password found"));
    }

    // 비밀번호 재설정
    // POST http://localhost:8080/api/user/reset-password
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "Password reset"));
    }

    // 비밀번호 재설정 이메일 발송
    // POST http://localhost:8080/api/user/send-email-reset-password-code
    @PostMapping("/send-email-reset-password-code")
    public ResponseEntity<Map<String, String>> sendEmailResetPasswordCode(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "Email reset password code sent"));
    }

    // 비밀번호 재설정 이메일 인증
    // POST http://localhost:8080/api/user/verify-email-reset-password-code
    @PostMapping("/verify-email-reset-password-code")
    public ResponseEntity<Map<String, String>> verifyEmailResetPasswordCode(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "Email reset password code verified"));
    }
}
