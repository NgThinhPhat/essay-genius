package com.phat.domain.irepository;

import com.phat.domain.enums.VerificationType;
import com.phat.domain.model.User;
import com.phat.domain.model.Verification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VerificationRepository extends JpaRepository<Verification, String> {
    Optional<Verification> findByCode(String code);

    List<Verification> findByUserAndVerificationType(User user, VerificationType type);
}
