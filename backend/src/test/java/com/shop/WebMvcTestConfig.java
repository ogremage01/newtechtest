package com.shop;

import org.springframework.boot.SpringBootConfiguration;
import org.springframework.context.annotation.Import;
import com.shop.auth.controller.AuthController;
import com.shop.user.controller.UserController;
import com.shop.common.exception.GlobalExceptionHandler;

/**
 * @WebMvcTest에서 사용할 최소 설정.
 * Security/JPA 없이 컨트롤러·예외처리만 로드한다.
 */
@SpringBootConfiguration
@Import({AuthController.class, UserController.class, GlobalExceptionHandler.class})
public class WebMvcTestConfig {
}
