package org.landmark.domain.user.repository;

import org.landmark.domain.user.domain.AuthProvider;
import org.landmark.domain.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByProviderAndProviderId(AuthProvider provider, String providerId);

    Optional<User> findByWalletAddress(String walletAddress);
}
