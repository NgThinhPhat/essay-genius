package com.phat.domain.irepository;

import com.phat.domain.model.EssaySubmission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EssaySubmissionRepository extends MongoRepository<EssaySubmission, String> {

}
