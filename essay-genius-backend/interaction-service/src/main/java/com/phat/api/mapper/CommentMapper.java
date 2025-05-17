package com.phat.api.mapper;

import com.phat.api.model.response.CommentResponse;
import com.phat.domain.model.Comment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    CommentResponse toCommentResponse(Comment comment);
}
