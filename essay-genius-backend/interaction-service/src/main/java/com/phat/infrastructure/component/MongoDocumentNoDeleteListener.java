package com.phat.infrastructure.component;

import com.phat.domain.model.AbstractNoDelete;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;

import static com.phat.common.Utils.getCurrentUser;

@Component
public class MongoDocumentNoDeleteListener extends AbstractMongoEventListener<AbstractNoDelete> {

    @Override
    public void onBeforeConvert(BeforeConvertEvent<AbstractNoDelete> event) {
        AbstractNoDelete entity = event.getSource();

        if (entity.getCreatedBy() == null) {
            entity.setCreatedBy(getCurrentUser());
        }

        entity.setUpdatedBy(getCurrentUser());
    }

}