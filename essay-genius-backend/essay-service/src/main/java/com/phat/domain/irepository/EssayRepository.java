package com.phat.domain.irepository;

import com.phat.domain.model.Essay;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EssayRepository extends MongoRepository<Essay, String> {
    List<Essay> findByUserId(String userId);
}
