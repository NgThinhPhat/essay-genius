package com.phat.domain.irepository;

import com.phat.domain.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable; // ✅ Phải dùng cái này
import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByEssayIdAndParentIdIsNull(String essayId);

    List<Comment> findByEssayIdAndParentIdIsNotNull(String essayId);
    Page<Comment> findByEssayId(String essayId, Pageable pageable);
    Page<Comment> findByEssayIdAndParentIdIsNull(String essayId, Pageable pageable);
}
