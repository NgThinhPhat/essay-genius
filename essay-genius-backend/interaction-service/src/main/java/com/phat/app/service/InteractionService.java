package com.phat.app.service;

import com.phat.domain.model.Comment;
import com.phat.domain.model.Reaction;
import com.phat.domain.model.TargetType;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public interface InteractionService {
    Comment addComment(String essayId, String content, String parentCommentId);

    List<Comment> getComments(String essayId);

    Reaction addReaction(String targetId, String targetType, String type);

    List<Reaction> getReactions(String targetId, String targetType);

    List<Reaction> getReactions(String targetId, TargetType targetType);
}

