package com.phat.domain.model;

import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Document(collection = "reactions")
@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class Reaction extends AbstractNoDelete{
    @Id
    String id;

    String targetId;      // ID của comment, essay, post

    @Field
    ReactionType reactionType;

    @Field("target_type")
    TargetType targetType;

}

