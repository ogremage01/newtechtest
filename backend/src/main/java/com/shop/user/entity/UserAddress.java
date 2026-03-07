package com.shop.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Entity
@Table(name = "user_addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    /** 암호화 저장 시 Base64 길이 확대를 위해 여유 길이 사용 */
    @Column(nullable = true, length = 512)
    private String address;

    @Column(nullable = true, length = 256)
    private String phone;
}
