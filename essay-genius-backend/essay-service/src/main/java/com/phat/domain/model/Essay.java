package com.phat.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "essays")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Essay extends AbstractEntity{
    @Id
    private String id;
    private String essayPrompt;
    private String essayText;
    private String result;
    private double band;
    private String userId;
}

