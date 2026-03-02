package com.shop.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserManagementResponseDto {

    private Long id;
    private String name;
    private String email;
    private String address;
    private String phone;
    private String role;
    private Long point;
    private String userMemo;
}
