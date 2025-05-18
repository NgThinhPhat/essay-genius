package com.phat.app.service.impl;

import com.phat.app.service.InteractionService;
import com.phat.app.service.MockService;

import com.phat.common.service.IdentityServiceGrpcClient;
import com.phat.domain.irepository.CommentRepository;
import com.phat.domain.irepository.ReactionRepository;
import com.phat.domain.model.Comment;
import com.phat.domain.model.Reaction;
import com.phat.domain.model.ReactionType;
import com.phat.domain.model.TargetType;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import net.datafaker.Faker;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static com.phat.common.Utils.mockSecurityContext;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class MockServiceImpl implements MockService {

    InteractionService interactionService;
    CommentRepository commentRepository;
    ReactionRepository reactionRepository;
    EssayGrpcClient essayGrpcClient;
    IdentityServiceGrpcClient identityServiceGrpcClient;
    Faker faker = new Faker();


    @Override
    public void init() {
        clear();
        mock();
    }

    @Override
    public void mock() {
        List<String> essayIds = essayGrpcClient.getEssayIds();
        List<String> originalUserIds = identityServiceGrpcClient.getUserIds();
        List<String> userIds = new ArrayList<>(originalUserIds);
        Collections.shuffle(userIds);
        for (int i = 0; i < 300; i++) {
            String essayId = essayIds.get(faker.random().nextInt(essayIds.size()));
            if(i == 0){
                essayId = "682973982ecbf74143ef35bf";
            }
            int topLevelCommentCount = faker.random().nextInt(2, 6);
            for (int j = 0; j < topLevelCommentCount; j++) {
                mockSecurityContext(userIds.get(faker.random().nextInt(userIds.size())));
                Comment parent = interactionService.addCommentMock(
                        essayId,
                        faker.lorem().sentence(faker.random().nextInt(2, 10)) + " on essay " + essayId,
                        null
                );

                int childCommentCount = 1 + faker.random().nextInt(2);
                int replyCount = 2 + faker.random().nextInt(1);
                for (int a = 0; a < replyCount; a++) {
                    String userId = userIds.get(faker.random().nextInt(userIds.size()));
                    mockSecurityContext(userId);
                    Comment child = interactionService.addCommentMock(
                            essayId,
                            faker.lorem().sentence(faker.random().nextInt(2, 10)) + a + " to comment " + parent.getId(),
                            parent.getId()
                    );
//                    int reactionCount = faker.random().nextInt(4, 10);
//                    List<String> userReacted = new ArrayList<>();
//                    for (int r = 0; r < reactionCount; r++) {
//                        String userId1 = userIds.get(faker.random().nextInt(userIds.size()));
//                        while (userReacted.contains(userId1)){
//                            userId1 = userIds.get(faker.random().nextInt(userIds.size()));
//                        };
//                        mockSecurityContext(userId1);
//                        interactionService.addReaction(child.getId(), TargetType.COMMENT.name(), randomReactionType().name());
//                        userReacted.add(userId1);
//                    }

                    for (int k = 0; k < childCommentCount; k++) {
                        String userId2 = userIds.get(faker.random().nextInt(userIds.size()));
                        mockSecurityContext(userId2);
                        Comment child2 = interactionService.addCommentMock(
                                essayId,
                                faker.lorem().sentence(faker.random().nextInt(2, 10)) + j + " to comment " + child.getId(),
                                child.getId()
                        );
//                        int reactionCount2 = faker.random().nextInt(4, 10);
//                        List<String> userReacted2 = new ArrayList<>();
//                        for (int r = 0; r < reactionCount; r++) {
//                            String userId3 = userIds.get(faker.random().nextInt(userIds.size()));
//                            while (userReacted.contains(userId3)){
//                                userId3 = userIds.get(faker.random().nextInt(userIds.size()));
//                            };
//                            mockSecurityContext(userId3);
//                            interactionService.addReaction(child2.getId(), TargetType.COMMENT.name(), randomReactionType().name());
//                            userReacted2.add(userId3);
//                        }
                    }
                }
//                Collections.shuffle(userIds);
//                int reactionCount = faker.random().nextInt(10, 20);
//                for (int r = 0; r < reactionCount; r++) {
//                    String userId = userIds.get(r);
//                    mockSecurityContext(userId);
//                    interactionService.addReaction(parent.getId(), TargetType.COMMENT.name(), randomReactionType().name());
//                }
            }

            int essayReactionCount = faker.random().nextInt(10, 20);
            Collections.shuffle(userIds);
            for (int r = 0; r < essayReactionCount; r++) {
                String userId = userIds.get(r);
                mockSecurityContext(userId);
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
        return types[faker.random().nextInt(types.length)];
    }

    @Override
    public void clear() {
        commentRepository.deleteAll();
        reactionRepository.deleteAll();
    }

}

