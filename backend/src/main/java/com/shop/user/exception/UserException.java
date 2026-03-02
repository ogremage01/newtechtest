package com.shop.user.exception;

import org.springframework.http.HttpStatus;

/**
 * user 도메인 비즈니스 예외 통합. Code에 따라 HTTP 상태와 메시지가 정해진다.
 */
public class UserException extends RuntimeException {

    private final Code code;

    public UserException(Code code) {
        super(code.messageCode);
        this.code = code;
    }

    public Code getCode() {
        return code;
    }

    public enum Code {
        DUPLICATE_EMAIL(HttpStatus.CONFLICT, "user.error.duplicateEmail"),
        INVALID_PASSWORD(HttpStatus.BAD_REQUEST, "user.error.invalidPassword"),
        PASSWORD_NOT_MATCH(HttpStatus.BAD_REQUEST, "user.error.passwordNotMatch");

        private final HttpStatus status;
        /** i18n 메시지 코드. 프론트 common.json 등에서 번역 */
        private final String messageCode;

        Code(HttpStatus status, String messageCode) {
            this.status = status;
            this.messageCode = messageCode;
        }

        public HttpStatus getStatus() {
            return status;
        }

        public String getMessageCode() {
            return messageCode;
        }
    }
}
