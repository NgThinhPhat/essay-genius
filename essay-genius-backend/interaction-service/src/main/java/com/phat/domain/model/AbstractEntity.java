package com.phat.domain.model;

import jakarta.persistence.Version;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;

import java.util.Date;



import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Field;

import static com.phat.common.Utils.getCurrentUser;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public abstract class AbstractEntity {

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

    @Field("is_deleted")
    Boolean isDeleted = false;

    @Field("deleted_by")
    String deletedBy;

    @Field("deleted_at")
    Date deletedAt;

    public void softDelete() {
        this.isDeleted = true;
        this.deletedBy = getCurrentUser();
        this.deletedAt = new Date();
    }

}
