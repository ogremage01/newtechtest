package com.user.controller;

import com.common.exception.GlobalExceptionHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.user.dto.SignInRequestDto;
import com.user.exception.UserException;
import com.user.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 회원가입(register) API 테스트
 * POST http://localhost:8080/api/user/register
 */
@WebMvcTest(UserController.class)
@ContextConfiguration(classes = com.shop.WebMvcTestConfig.class)
@Import(GlobalExceptionHandler.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    private static final String REGISTER_URL = "/api/user/register";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    private String validRegisterBody() throws Exception {
        SignInRequestDto dto = new SignInRequestDto();
        dto.setName("홍길동");
        dto.setEmail("user@example.com");
        dto.setAddress("서울시 강남구");
        dto.setPhone("010-1234-5678");
        dto.setPassword("Password1!");
        dto.setPasswordConfirm("Password1!");
        return objectMapper.writeValueAsString(dto);
    }

    @Nested
    @DisplayName("POST /api/user/register")
    class RegisterApi {

        @Test
        @DisplayName("정상 요청 시 200과 message 반환")
        void register_returns200AndMessage() throws Exception {
            doNothing().when(userService).register(any(SignInRequestDto.class));

            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(validRegisterBody()))
                    .andExpect(status().isOk())
                    .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.message").value("Registered"));

            verify(userService).register(any(SignInRequestDto.class));
        }

        @Test
        @DisplayName("이메일 중복 시 409와 messageCode 반환")
        void register_duplicateEmail_returns409() throws Exception {
            doThrow(new UserException(UserException.Code.DUPLICATE_EMAIL))
                    .when(userService).register(any(SignInRequestDto.class));

            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(validRegisterBody()))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.messageCode").value("user.error.duplicateEmail"));

            verify(userService).register(any(SignInRequestDto.class));
        }

        @Test
        @DisplayName("비밀번호 규칙 위반 시 400과 messageCode 반환")
        void register_invalidPassword_returns400() throws Exception {
            doThrow(new UserException(UserException.Code.INVALID_PASSWORD))
                    .when(userService).register(any(SignInRequestDto.class));

            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(validRegisterBody()))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.messageCode").value("user.error.invalidPassword"));

            verify(userService).register(any(SignInRequestDto.class));
        }

        @Test
        @DisplayName("비밀번호 불일치 시 400과 messageCode 반환")
        void register_passwordMismatch_returns400() throws Exception {
            doThrow(new UserException(UserException.Code.PASSWORD_NOT_MATCH))
                    .when(userService).register(any(SignInRequestDto.class));

            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(validRegisterBody()))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.messageCode").value("user.error.passwordNotMatch"));

            verify(userService).register(any(SignInRequestDto.class));
        }
    }
}
