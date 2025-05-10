package com.phat.app.service.impl;

import com.phat.api.model.request.ListCommentRequest;
import com.phat.api.model.request.ListReactionRequest;
import com.phat.api.model.response.CommentResponse;
import com.phat.api.model.response.ReactionResponse;
import com.phat.api.model.response.ToxicCheckerResponse;
import com.phat.common.response.InteractionCountResponse;
import com.phat.app.service.InteractionService;
import com.phat.common.response.ReactedInfo;
import com.phat.common.response.UserInfo;
import com.phat.common.service.IdentityServiceGrpcClient;
import com.phat.domain.irepository.CommentRepository;
import com.phat.domain.irepository.ReactionRepository;
import com.phat.domain.model.Comment;
import com.phat.domain.model.Reaction;

import java.util.List;
import java.util.Optional;


import com.phat.domain.model.ReactionType;
import com.phat.domain.model.TargetType;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class InteractionServiceImpl implements InteractionService {

    CommentRepository commentRepository;
    ReactionRepository reactionRepository;
    MongoTemplate mongoTemplate;
    EssayGrpcClient essayGrpcClient;
    IdentityServiceGrpcClient identityServiceGrpcClient;
    AIGrpcClient aiGrpcClient;
    @Override
    @Transactional
    public ToxicCheckerResponse addComment(String essayId, String content, String parentCommentId) {
        if (!essayGrpcClient.isEssayIdExist(essayId)) {
            throw new IllegalArgumentException("Essay ID does not exist");
        }

        if (parentCommentId != null) {
            Comment parentComment = commentRepository.findById(parentCommentId)
                    .orElseThrow(() -> new IllegalArgumentException("Parent comment not found"));
            parentComment.setReplyCount(parentComment.getReplyCount() + 1);
            commentRepository.save(parentComment);
        }
        Comment comment = Comment.builder()
                .essayId(essayId)
                .content(content)
                .parentId(parentCommentId)
                .replyCount(0)
                .build();

        ToxicCheckerResponse toxicCheckerResponse = aiGrpcClient.checkToxic(content);
        if (toxicCheckerResponse.valid())
            commentRepository.save(comment);

        return toxicCheckerResponse;
    }

    @Override
    public Reaction addReaction(String targetId, String targetType, String type) {
        if(targetType.equals(TargetType.valueOf("COMMENT").name())) {
            Comment comment = commentRepository.findById(targetId)
                    .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
            comment.setReactionCount(comment.getReactionCount() + 1);
            commentRepository.save(comment);
        } else if (targetType.equals(TargetType.valueOf("ESSAY").name())) {
            if (!essayGrpcClient.isEssayIdExist(targetId)){
                throw new IllegalArgumentException("Essay ID does not exist");
            }
        }
        Reaction reaction = Reaction.builder()
                .targetId(targetId)
                .reactionType(ReactionType.valueOf(type.toUpperCase()))
                .targetType(TargetType.valueOf(targetType.toUpperCase()))
                .build();

        return reactionRepository.save(reaction);
    }

    public Page<CommentResponse> findAllComments(ListCommentRequest request) {
        Query baseQuery = new Query(request.toCriteria());
        long total = mongoTemplate.count(baseQuery, Comment.class);

        Query query = new Query(request.toCriteria()).with(request.toPageable());
        List<Comment> comments = mongoTemplate.find(query, Comment.class);
        List<CommentResponse> responses = comments.stream().map(
                comment -> {
                    UserInfo userInfo = identityServiceGrpcClient.getUserInfo(comment.getCreatedBy());
                    return CommentResponse.builder()
                            .user(userInfo)
                            .id(comment.getId())
                            .createdAt(comment.getCreatedAt())
                            .content(comment.getContent())
                            .essayId(comment.getEssayId())
                            .parentId(comment.getParentId())
                            .replyCount(getCommentReply(comment.getId()))
                            .reactionCount(getReactionCount(comment.getId()))
                            .build();
                }
        ).toList();

        return new PageImpl<>(responses, request.toPageable(), total);
    }

    public Page<ReactionResponse> findAllReactions(ListReactionRequest request) {
        Query baseQuery = new Query(request.toCriteria());
        long total = mongoTemplate.count(baseQuery, Reaction.class);

        Query query = new Query(request.toCriteria()).with(request.toPageable());
        List<Reaction> reactions = mongoTemplate.find(query, Reaction.class);
        List<ReactionResponse> responses = reactions.stream().map(
                reaction -> {
                    UserInfo userInfo = identityServiceGrpcClient.getUserInfo(reaction.getCreatedBy());
                    return ReactionResponse.builder()
                            .user(userInfo)
                            .reactionType(reaction.getReactionType())
                            .targetId(reaction.getTargetId())
                            .targetType(reaction.getTargetType())
                            .createdAt(reaction.getCreatedAt())
                            .id(reaction.getId())
                            .build();
                }
        ).toList();
        return new PageImpl<>(responses, request.toPageable(), total);
    }

    @Override
    public void deleteComment(String commentId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        comment.softDelete();
        commentRepository.save(comment);
    }

    @Override
    public void deleteReaction(String reactionId) {
        Reaction reaction = reactionRepository.findById(reactionId)
                .orElseThrow(() -> new IllegalArgumentException("Reaction not found"));
        reactionRepository.delete(reaction);
    }

    @Override
    public long getCommentCount(String targetId) {
        return commentRepository.countByEssayId(targetId);
    }

    @Override
    public long getReactionCount(String targetId) {
        return reactionRepository.countByTargetId(targetId);
    }

    @Override
    public long getCommentReply(String parentId) {
        return commentRepository.countByParentId(parentId);
    }

    @Override
    public long getReactionCountByTargetIdAndType(String targetId, ReactionType reactionType) {
        return reactionRepository.countByTargetIdAndReactionType(targetId, reactionType);
    }

    @Override
    public ReactedInfo isUserReacted(String targetId, String userId) {
        Optional<Reaction> reaction = reactionRepository.findByTargetIdAndCreatedBy(targetId, userId);
        if (reaction.isPresent()){
            return ReactedInfo.builder()
                    .reactionType(String.valueOf(reaction.get().getReactionType()))
                    .reactionId(reaction.get().getId())
                    .isReacted(true)
                    .build();
        }
        else{
            return ReactedInfo.builder()
                    .isReacted(false)
                    .build();
        }
    }

}
