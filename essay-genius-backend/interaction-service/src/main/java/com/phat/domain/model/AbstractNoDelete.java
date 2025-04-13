package com.phat.domain.model;

import jakarta.persistence.Version;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public abstract class AbstractNoDelete {

    @CreatedDate
    @Field("created_at")
    Date createdAt;

    @LastModifiedDate
    @Field("updated_at")
    Date updatedAt;

    @Version
    @Field("version")
    Long version;

    @CreatedBy
    @Field("created_by")
    String createdBy;

    @LastModifiedBy
    @Field("updated_by")
    String updatedBy;

}
