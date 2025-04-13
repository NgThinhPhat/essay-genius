package com.phat.app.service.impl;

import com.phat.app.service.InteractionService;
import com.phat.domain.irepository.CommentRepository;
import com.phat.domain.irepository.ReactionRepository;
import com.phat.domain.model.Comment;
import com.phat.domain.model.Reaction;

import java.util.List;


import com.phat.domain.model.ReactionType;
import com.phat.domain.model.TargetType;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class InteractionServiceImpl implements InteractionService {

    CommentRepository commentRepository;
    ReactionRepository reactionRepository;

    @Override
    public Comment addComment(String essayId, String content, String parentCommentId) {
        Comment comment = Comment.builder()
                .essayId(essayId)
                .content(content)
                .parentId(parentCommentId)
                .replyCount(0)
                .build();

        return commentRepository.save(comment);
    }

    @Override
    public List<Comment> getComments(String essayId) {
        return commentRepository.findByEssayIdAndParentIdIsNull(essayId);
    }

    @Override
    public List<Reaction> getReactions(String targetId, String targetType) {
        return List.of();
    }

    @Override
    public Reaction addReaction(String targetId, String targetType, String type) {
        Reaction reaction = Reaction.builder()
                .targetId(targetId)
                .reactionType(ReactionType.valueOf(type.toUpperCase()))
                .build();

        return reactionRepository.save(reaction);
    }

    @Override
    public List<Reaction> getReactions(String targetId, TargetType targetType) {
        return reactionRepository.findByTargetIdAndTargetType(targetId, targetType);
    }

}
