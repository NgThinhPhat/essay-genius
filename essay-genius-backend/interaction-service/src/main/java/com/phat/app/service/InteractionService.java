package com.phat.app.service;

import com.phat.api.model.request.ListCommentRequest;
import com.phat.api.model.request.ListReactionRequest;
import com.phat.api.model.response.CommentResponse;
import com.phat.api.model.response.ReactionResponse;
import com.phat.api.model.response.ToxicCheckerResponse;
import com.phat.common.response.InteractionCountResponse;
import com.phat.common.response.ReactedInfo;
import com.phat.domain.model.Comment;
import com.phat.domain.model.Reaction;
import com.phat.domain.model.ReactionType;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;


@Service
public interface InteractionService {
    ToxicCheckerResponse addComment(String essayId, String content, String parentCommentId);

    Comment addCommentMock(String essayId, String content, String parentCommentId);

    Reaction addReaction(String targetId, String targetType, String type);

    Page<CommentResponse> findAllComments(ListCommentRequest request);

    Page<ReactionResponse> findAllReactions(ListReactionRequest request);

    void deleteComment(String commentId);

    void deleteReaction(String reactionId);

    long getCommentCount(String targetId);

    long getReactionCount(String targetId);

    long getCommentReply(String parentId);

    long getReactionCountByTargetIdAndType(String targetId, ReactionType reactionType);

    ReactedInfo isUserReacted(String targetId, String userId);
}

