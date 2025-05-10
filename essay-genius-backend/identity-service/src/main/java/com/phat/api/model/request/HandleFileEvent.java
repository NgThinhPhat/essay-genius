package com.phat.api.model.request;

import com.phat.domain.enums.FileMetadataType;
import com.phat.domain.enums.HandleFileAction;
import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HandleFileEvent {

    String id;

    String objectKey;

    long size;

    String contentType;

    String ownerId;

    HandleFileAction action;

    FileMetadataType type;

}


