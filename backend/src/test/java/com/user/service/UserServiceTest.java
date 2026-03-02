package com.user.service;

import com.user.dto.SignInRequestDto;
import com.user.entity.User;
import com.user.exception.UserException;
import com.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * 회원가입(register) 서비스 단위 테스트
 */
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    private static final String VALID_PASSWORD = "Password1!";

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private SignInRequestDto validRequest() {
        SignInRequestDto dto = new SignInRequestDto();
        dto.setName("홍길동");
        dto.setEmail("user@example.com");
        dto.setAddress("서울시 강남구");
        dto.setPhone("010-1234-5678");
        dto.setPassword(VALID_PASSWORD);
        dto.setPasswordConfirm(VALID_PASSWORD);
        return dto;
    }

    @Nested
    @DisplayName("register 성공")
    class RegisterSuccess {

        @Test
        @DisplayName("정상 요청 시 사용자가 저장되고 비밀번호가 인코딩된다")
        void register_savesUserWithEncodedPassword() {
            when(userRepository.findByEmail(anyString())).thenReturn(null);
            when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

            SignInRequestDto request = validRequest();
            userService.register(request);

            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(userCaptor.capture());

            User saved = userCaptor.getValue();
            assertThat(saved.getName()).isEqualTo("홍길동");
            assertThat(saved.getEmail()).isEqualTo("user@example.com");
            assertThat(saved.getAddress()).isEqualTo("서울시 강남구");
            assertThat(saved.getPhone()).isEqualTo("010-1234-5678");
            assertThat(saved.getPassword()).isEqualTo("encodedPassword");
            assertThat(saved.getRole()).isEqualTo("USER");
            assertThat(saved.getPoint()).isEqualTo(0L);
            assertThat(saved.getCreatedAt()).isNotNull();
            assertThat(saved.getUpdatedAt()).isNotNull();

            verify(passwordEncoder).encode(VALID_PASSWORD);
        }
    }

    @Nested
    @DisplayName("register 실패 - 이메일 중복")
    class RegisterDuplicateEmail {

        @Test
        @DisplayName("이메일이 이미 존재하면 DUPLICATE_EMAIL 예외")
        void register_throwsWhenEmailExists() {
            when(userRepository.findByEmail("user@example.com")).thenReturn(new User());

            SignInRequestDto request = validRequest();

            assertThatThrownBy(() -> userService.register(request))
                    .isInstanceOf(UserException.class)
                    .satisfies(e -> assertThat(((UserException) e).getCode())
                            .isEqualTo(UserException.Code.DUPLICATE_EMAIL));

            verify(userRepository, never()).save(any());
            verify(passwordEncoder, never()).encode(anyString());
        }
    }

    @Nested
    @DisplayName("register 실패 - 비밀번호 규칙")
    class RegisterInvalidPassword {

        @Test
        @DisplayName("비밀번호에 특수문자가 없으면 INVALID_PASSWORD 예외")
        void register_throwsWhenPasswordNoSpecialChar() {
            when(userRepository.findByEmail(anyString())).thenReturn(null);

            SignInRequestDto request = validRequest();
            request.setPassword("Password123");
            request.setPasswordConfirm("Password123");

            assertThatThrownBy(() -> userService.register(request))
                    .isInstanceOf(UserException.class)
                    .satisfies(e -> assertThat(((UserException) e).getCode())
                            .isEqualTo(UserException.Code.INVALID_PASSWORD));

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("비밀번호가 8자 미만이면 INVALID_PASSWORD 예외")
        void register_throwsWhenPasswordTooShort() {
            when(userRepository.findByEmail(anyString())).thenReturn(null);

            SignInRequestDto request = validRequest();
            request.setPassword("Abc1!");
            request.setPasswordConfirm("Abc1!");

            assertThatThrownBy(() -> userService.register(request))
                    .isInstanceOf(UserException.class)
                    .satisfies(e -> assertThat(((UserException) e).getCode())
                            .isEqualTo(UserException.Code.INVALID_PASSWORD));

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("비밀번호가 20자 초과면 INVALID_PASSWORD 예외")
        void register_throwsWhenPasswordTooLong() {
            when(userRepository.findByEmail(anyString())).thenReturn(null);

            SignInRequestDto request = validRequest();
            request.setPassword("Abcdefghij1234567890!");
            request.setPasswordConfirm("Abcdefghij1234567890!");

            assertThatThrownBy(() -> userService.register(request))
                    .isInstanceOf(UserException.class)
                    .satisfies(e -> assertThat(((UserException) e).getCode())
                            .isEqualTo(UserException.Code.INVALID_PASSWORD));

            verify(userRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("register 실패 - 비밀번호 불일치")
    class RegisterPasswordMismatch {

        @Test
        @DisplayName("비밀번호와 비밀번호 확인이 다르면 PASSWORD_NOT_MATCH 예외")
        void register_throwsWhenPasswordConfirmMismatch() {
            when(userRepository.findByEmail(anyString())).thenReturn(null);

            SignInRequestDto request = validRequest();
            request.setPassword(VALID_PASSWORD);
            request.setPasswordConfirm("OtherPass1!");

            assertThatThrownBy(() -> userService.register(request))
                    .isInstanceOf(UserException.class)
                    .satisfies(e -> assertThat(((UserException) e).getCode())
                            .isEqualTo(UserException.Code.PASSWORD_NOT_MATCH));

            verify(userRepository, never()).save(any());
        }
    }
}
