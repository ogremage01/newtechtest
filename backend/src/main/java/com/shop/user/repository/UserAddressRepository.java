package com.shop.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shop.user.entity.UserAddress;

public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {

    UserAddress findByUserId(Long userId);
}
