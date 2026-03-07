package com.shop.user.service;

import com.shop.user.entity.User;
import com.shop.user.exception.UserException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import com.shop.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.shop.auth.dto.SignInRequestDto;
import com.shop.user.entity.UserAddress;
import com.shop.user.repository.UserAddressRepository;
import org.springframework.beans.factory.annotation.Value;
import com.shop.common.util.PersonalDataCipher;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    @Value("${user.terms-version}")
    private String termsVersion;
    @Value("${user.privacy-version}")
    private String privacyVersion;

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserAddressRepository userAddressRepository;
    private final PersonalDataCipher personalDataCipher;
    private static final String PASSWORD_PATTERN = "^(?=.*[!@#$%^&*()\\-_=+\\[\\]{}?,.])[A-Za-z\\d!@#$%^&*()\\-_=+\\[\\]{}?,.]{8,20}$";

    /**
     * 회원 가입
     * 
     * @param userRequestDto 회원 가입 요청 정보
     * @throws UserException 회원 가입 실패 시 예외
     */
    @Transactional
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
                .role("USER")
                .point(0L)
                .termsAgreed(true)
                .termsAgreedAt(LocalDateTime.now())
                .termsVersion(termsVersion)
                .privacyAgreed(true)
                .privacyAgreedAt(LocalDateTime.now())
                .privacyVersion(privacyVersion)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        userRepository.save(user);// user가 null일 경우 예외 발생하나, 여기까지 왔는데 null이 발생할 수 없음.
        UserAddress userAddress = UserAddress.builder()
                .userId(user.getId())
                .address(personalDataCipher.encrypt(signInRequestDto.getAddress()))
                .phone(personalDataCipher.encrypt(signInRequestDto.getPhone()))
                .build();
        userAddressRepository.save(userAddress);
    }

    public void addAddress(UserAddress userAddress) {
        UserAddress toSave = UserAddress.builder()
                .id(userAddress.getId())
                .userId(userAddress.getUserId())
                .address(personalDataCipher.encrypt(userAddress.getAddress()))
                .phone(personalDataCipher.encrypt(userAddress.getPhone()))
                .build();
        userAddressRepository.save(toSave);
    }

    /**
     * DB에 암호화되어 저장된 주소/전화번호를 복호화한 복사본 반환.
     * API 응답 등에 사용.
     */
    public UserAddress decryptUserAddress(UserAddress encrypted) {
        if (encrypted == null)
            return null;
        return UserAddress.builder()
                .id(encrypted.getId())
                .userId(encrypted.getUserId())
                .address(personalDataCipher.decrypt(encrypted.getAddress()))
                .phone(personalDataCipher.decrypt(encrypted.getPhone()))
                .build();
    }
}
