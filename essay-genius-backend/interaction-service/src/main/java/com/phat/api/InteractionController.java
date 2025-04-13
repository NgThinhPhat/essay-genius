package com.phat.api;

import com.phat.app.service.InteractionService;
import com.phat.domain.model.Comment;
import com.phat.domain.model.Reaction;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/interaction")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class InteractionController {

    InteractionService interactionService;

    @PostMapping("/comments")
    public Comment addComment(@RequestParam String essayId,
                              @RequestParam String content,
                              @RequestParam(required = false) String parentCommentId) {
        return interactionService.addComment(essayId, content, parentCommentId);
    }

    @GetMapping("/comments/{essayId}")
    public List<Comment> getComments(@PathVariable String essayId) {
        return interactionService.getComments(essayId);
    }

    @PostMapping("/reactions")
    public Reaction addReaction(@RequestParam String targetId,
                                @RequestParam String targetType,
                                @RequestParam String type) {
        return interactionService.addReaction(targetId, targetType, type);
    }

    @GetMapping("/reactions")
    public List<Reaction> getReactions(@RequestParam String targetId, @RequestParam String targetType) {
        return interactionService.getReactions(targetId, targetType);
    }

}
