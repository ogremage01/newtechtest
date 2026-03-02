package com.user.service;

import com.user.entity.User;
import com.user.exception.UserException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import com.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.user.dto.SignInRequestDto;

@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private static final String PASSWORD_PATTERN = "^(?=.*[!@#$%^&*()\\-_=+\\[\\]{}?,.])[A-Za-z\\d!@#$%^&*()\\-_=+\\[\\]{}?,.]{8,20}$";

    /**
     * 회원 가입
     * 
     * @param userRequestDto 회원 가입 요청 정보
     * @throws UserException 회원 가입 실패 시 예외
     */
    public void register(SignInRequestDto signInRequestDto) {
        if (userRepository.findByEmail(signInRequestDto.getEmail()) != null) {
            throw new UserException(UserException.Code.DUPLICATE_EMAIL);
        }
        if (!signInRequestDto.getPassword().matches(PASSWORD_PATTERN)) {
            throw new UserException(UserException.Code.INVALID_PASSWORD);
        }
        if (!signInRequestDto.getPassword().equals(signInRequestDto.getPasswordConfirm())) {
            throw new UserException(UserException.Code.PASSWORD_NOT_MATCH);
        }
        User user = User.builder()
                .name(signInRequestDto.getName())
                .email(signInRequestDto.getEmail())
                .password(passwordEncoder.encode(signInRequestDto.getPassword()))
                .address(signInRequestDto.getAddress())
                .phone(signInRequestDto.getPhone())
                .role("USER")
                .point(0L)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        userRepository.save(user);// user가 null일 경우 예외 발생하나, 여기까지 왔는데 null이 발생할 수 없음.
    }
}
