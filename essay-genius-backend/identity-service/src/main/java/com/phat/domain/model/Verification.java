package com.phat.domain.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.phat.domain.enums.VerificationType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "verifications")
public class Verification extends AbstractEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String token;

    @Column(length = 6)
    String code;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    Date expiryTime;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    VerificationType verificationType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id",
            foreignKey = @ForeignKey(name = "fk_verifications_users",
                    foreignKeyDefinition = "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE"), nullable = false,
            updatable = false)
    @JsonBackReference
    User user;

}

