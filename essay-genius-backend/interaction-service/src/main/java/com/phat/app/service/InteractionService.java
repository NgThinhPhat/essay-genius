package com.phat.app.service;

import com.phat.api.model.request.ListCommentRequest;
import com.phat.api.model.request.ListReactionRequest;
import com.phat.common.response.InteractionCountResponse;
import com.phat.domain.model.Comment;
import com.phat.domain.model.Reaction;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;


@Service
public interface InteractionService {
    Comment addComment(String essayId, String content, String parentCommentId);

    Reaction addReaction(String targetId, String targetType, String type);

    Page<Comment> findAllComments(ListCommentRequest request);
    Page<Reaction> findAllReactions(ListReactionRequest request);

    void deleteComment(String commentId);

    void deleteReaction(String reactionId);

    InteractionCountResponse getInteractionCount(String targetId);
}

