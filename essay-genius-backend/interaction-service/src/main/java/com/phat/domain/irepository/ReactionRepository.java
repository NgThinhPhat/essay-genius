package com.phat.domain.irepository;

import com.phat.domain.model.Reaction;
import com.phat.domain.model.TargetType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReactionRepository extends MongoRepository<Reaction, String> {
    List<Reaction> findByTargetId(String essayId, String commentId);

    List<Reaction> findByTargetIdAndTargetType(String targetId, TargetType targetType);

    int countByTargetId(String targetId);

    int countByTargetIdAndTargetType(String targetId, TargetType targetType);
}
