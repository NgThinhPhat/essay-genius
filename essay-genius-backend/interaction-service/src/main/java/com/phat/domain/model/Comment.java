package com.phat.domain.model;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "comments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment extends AbstractEntity{
    @Id
    private String id;

    private String essayId;

    private String content;

    private String parentId;

    @Builder.Default
    private Integer replyCount = 0;

    @Builder.Default
    private Integer reactionCount = 0;
}

