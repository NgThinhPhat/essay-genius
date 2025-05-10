package com.phat.api.model.response;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class FileUploadResponse {
    private String id;
    private String url;
}

