package com.shop.common.exception;

import com.shop.user.exception.UserException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

/**
 * 전역 예외 처리. 컨트롤러/서비스에서 던진 예외를 HTTP 응답으로 변환해 프론트에 일관된 형식으로 전달한다.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** user 도메인 예외 → Code에 따른 status + messageCode (프론트에서 common.json으로 번역) */
    @ExceptionHandler(UserException.class)
    public ResponseEntity<Map<String, String>> handleUserException(UserException e) {
        return ResponseEntity
                .status(e.getCode().getStatus())
                .body(Map.of("messageCode", e.getCode().getMessageCode()));
    }

    /** 그 외 비즈니스/런타임 예외 → 500, body: { "message": "..." } */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", e.getMessage() != null ? e.getMessage() : "서버 오류가 발생했습니다."));
    }

    /** 모든 예외 → 500 */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception e) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "서버 오류가 발생했습니다."));
    }
}
