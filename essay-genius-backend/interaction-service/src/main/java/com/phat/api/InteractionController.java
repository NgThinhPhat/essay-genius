package com.phat.api;

import com.phat.api.model.request.*;
import com.phat.api.model.response.CommentResponse;
import com.phat.api.model.response.CommonResponse;
import com.phat.api.model.response.ReactionResponse;
import com.phat.api.model.response.ToxicCheckerResponse;
import com.phat.app.service.InteractionService;
import com.phat.domain.model.Comment;
import com.phat.domain.model.Reaction;
import com.phat.domain.model.ReactionType;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.validation.annotation.Validated;

import static lombok.AccessLevel.PRIVATE;

@RestController
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = PRIVATE)
@Validated
public class InteractionController {
    InteractionService interactionService;

    @PostMapping("/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<CommonResponse> addComment(@Valid @RequestBody CreateCommentRequest createCommentRequest) {
        ToxicCheckerResponse toxicCheckerResponse = interactionService.addComment(
                createCommentRequest.essayId(),
                createCommentRequest.content(),
                createCommentRequest.parentId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(CommonResponse.builder()
                        .results(toxicCheckerResponse)
                .message(toxicCheckerResponse.valid() ? "Comment added successfully" : "Comment Failed").build());
    }

    @GetMapping("/comments")
    @ResponseStatus(HttpStatus.OK)
    public Page<CommentResponse> getComments(@ModelAttribute ListCommentRequest listCommentRequest) {
        return interactionService.findAllComments(listCommentRequest);
    }

    @PostMapping("/reactions")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Reaction> addReaction(@Valid @RequestBody CreateReactionRequest createReactionRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(interactionService.addReaction(
                createReactionRequest.targetId(),
                createReactionRequest.targetType(),
                createReactionRequest.type()
        ));
    }

    @GetMapping("/reactions")
    @ResponseStatus(HttpStatus.OK)
    public Page<ReactionResponse> getReactions(@ModelAttribute ListReactionRequest listReactionRequest) {
        return interactionService.findAllReactions(listReactionRequest);
    }

    @DeleteMapping("/comments/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComment(@PathVariable String commentId) {
        interactionService.deleteComment(commentId);
    }

    @DeleteMapping("/reactions/{reactionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<CommonResponse> deleteReaction(@PathVariable String reactionId) {
        interactionService.deleteReaction(reactionId);
        return ResponseEntity.status(HttpStatus.OK).body(CommonResponse.builder()
                .message("Reaction deleted successfully").build());
    }

    @GetMapping("/reactions/count")
    @ResponseStatus(HttpStatus.OK)
    public long getReactionCount(@ModelAttribute GetReactionCountRequest getReactionCountRequest) {
        return interactionService.getReactionCountByTargetIdAndType(getReactionCountRequest.targetId(), ReactionType.valueOf(getReactionCountRequest.reactionType().toUpperCase()));
    }
}
