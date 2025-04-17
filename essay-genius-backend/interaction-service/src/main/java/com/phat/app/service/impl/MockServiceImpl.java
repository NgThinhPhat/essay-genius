package com.phat.app.service.impl;

import com.phat.app.service.InteractionService;
import com.phat.app.service.MockService;

import com.phat.domain.irepository.CommentRepository;
import com.phat.domain.irepository.ReactionRepository;
import com.phat.domain.model.Comment;
import com.phat.domain.model.Reaction;
import com.phat.domain.model.ReactionType;
import com.phat.domain.model.TargetType;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class MockServiceImpl implements MockService {

    InteractionService interactionService;
    CommentRepository commentRepository;
    ReactionRepository reactionRepository;
    EssayGrpcClient essayGrpcClient;

    static Random random = new Random();

    @Override
    public void init() {
        clear();
        mock();
    }

    @Override
    public void mock() {
        List<String> essayIds = essayGrpcClient.getEssayIds();

        // Tạo comments và reactions mẫu cho mỗi essay
        for (String essayId : essayIds) {
            int topLevelCommentCount = 10 + random.nextInt(10);
            for (int i = 0; i < topLevelCommentCount; i++) {
                Comment parent = interactionService.addComment(
                        essayId,
                        "Comment " + i + " on essay " + essayId,
                        null
                );

                int childCommentCount = 3 + random.nextInt(5);
                int replyCount = 3 + random.nextInt(5);
                for (int a = 0; a < replyCount; a++) {
                    Comment child = interactionService.addComment(
                            essayId,
                            "Child comment " + a + " to comment " + parent.getId(),
                            parent.getId()
                    );
                    int reactionCount = 10 + random.nextInt(30);
                    for (int r = 0; r < reactionCount; r++) {
                        interactionService.addReaction(child.getId(), TargetType.COMMENT.name(), randomReactionType().name());
                    }
                    for (int j = 0; j < childCommentCount; j++) {
                        Comment child2 = interactionService.addComment(
                                essayId,
                                "Reply " + j + " to comment " + child.getId(),
                                child.getId()
                        );
                        int reactionCount2 = 10 + random.nextInt(30);
                        for (int r = 0; r < reactionCount; r++) {
                            interactionService.addReaction(child2.getId(), TargetType.COMMENT.name(), randomReactionType().name());
                        }
                    }
                }
                int reactionCount = 10 + random.nextInt(30);
                for (int r = 0; r < reactionCount; r++) {
                    interactionService.addReaction(parent.getId(), TargetType.COMMENT.name(), randomReactionType().name());
                }
            }

            int essayReactionCount = 50 + random.nextInt(30);
            for (int r = 0; r < essayReactionCount; r++) {
                Reaction reaction = Reaction.builder()
                        .targetId(essayId)
                        .targetType(TargetType.ESSAY)
                        .reactionType(ReactionType.STAR)
                        .build();
                interactionService.addReaction(reaction.getTargetId(), reaction.getTargetType().name(), reaction.getReactionType().name());
            }
        }
    }

    private ReactionType randomReactionType() {
        ReactionType[] types = ReactionType.values();
        return types[random.nextInt(types.length)];
    }

    @Override
    public void clear() {
        commentRepository.deleteAll();
        reactionRepository.deleteAll();
    }

}

