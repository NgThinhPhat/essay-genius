package com.phat.api;

import com.phat.api.model.request.CreateCommentRequest;
import com.phat.api.model.request.CreateReactionRequest;
import com.phat.api.model.request.ListCommentRequest;
import com.phat.api.model.request.ListReactionRequest;
import com.phat.api.model.response.CommonResponse;
import com.phat.app.service.InteractionService;
import com.phat.domain.model.Comment;
import com.phat.domain.model.Reaction;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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
        interactionService.addComment(
                createCommentRequest.essayId(),
                createCommentRequest.content(),
                createCommentRequest.parentId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(CommonResponse.builder()
                .message("Comment added successfully").build());
    }

    @GetMapping("/comments")
    @ResponseStatus(HttpStatus.OK)
    public Page<Comment> getComments(@ModelAttribute ListCommentRequest listCommentRequest) {
        return interactionService.findAllComments(listCommentRequest);
    }

    @PostMapping("/reactions")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<CommonResponse> addReaction(@Valid @RequestBody CreateReactionRequest createReactionRequest) {
        interactionService.addReaction(
                createReactionRequest.targetId(),
                createReactionRequest.targetType(),
                createReactionRequest.type()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(CommonResponse.builder()
                .message("Reaction added successfully").build());
    }

    @GetMapping("/reactions")
    @ResponseStatus(HttpStatus.OK)
    public Page<Reaction> getReactions(@ModelAttribute ListReactionRequest listReactionRequest) {
        return interactionService.findAllReactions(listReactionRequest);
    }

    @DeleteMapping("/comments/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComment(@PathVariable String commentId) {
        interactionService.deleteComment(commentId);
    }

    @DeleteMapping("/reactions/{reactionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReaction(@PathVariable String reactionId) {
        interactionService.deleteReaction(reactionId);
    }
}
