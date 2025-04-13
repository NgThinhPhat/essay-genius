package com.phat.app.service.impl;

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

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class MockServiceImpl implements MockService {

    CommentRepository commentRepository;
    ReactionRepository reactionRepository;

    static Random random = new Random();

    @Override
    public void init() {
        clear();
        mock();
    }

    @Override
    public void mock() {
        int essayCount = 20 + random.nextInt(11);
        List<String> essayIds = IntStream.range(0, essayCount)
                .mapToObj(i -> UUID.randomUUID().toString())
                .toList();

        List<Comment> allComments = new ArrayList<>();
        List<Reaction> allReactions = new ArrayList<>();

        for (String essayId : essayIds) {
            int topLevelCommentCount = 3 + random.nextInt(4);

            for (int i = 0; i < topLevelCommentCount; i++) {
                Comment parent = Comment.builder()
                        .essayId(essayId)
                        .content("Comment " + i + " on essay " + essayId)
                        .parentId(null)
                        .replyCount(0) // sẽ update sau
                        .build();
                parent = commentRepository.save(parent);
                allComments.add(parent);

                int replyCount = 1 + random.nextInt(3);
                parent.setReplyCount(replyCount);

                for (int j = 0; j < replyCount; j++) {
                    Comment reply = Comment.builder()
                            .essayId(essayId)
                            .content("Reply " + j + " to comment " + parent.getId())
                            .parentId(parent.getId())
                            .build();
                    allComments.add(reply);
                }

                commentRepository.save(parent);
            }

            int essayReactionCount = 1 + random.nextInt(3);
            for (int r = 0; r < essayReactionCount; r++) {
                Reaction reaction = Reaction.builder()
                        .targetId(essayId)
                        .targetType(TargetType.COMMENT)
                        .reactionType(randomReactionType())
                        .build();
                allReactions.add(reaction);
            }
        }

        for (Comment comment : allComments) {
            int commentReactionCount = random.nextInt(3);
            for (int r = 0; r < commentReactionCount; r++) {
                Reaction reaction = Reaction.builder()
                        .targetId(comment.getId())
                        .reactionType(randomReactionType())
                        .build();
                allReactions.add(reaction);
            }
        }

        commentRepository.saveAll(allComments);
        reactionRepository.saveAll(allReactions);
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

