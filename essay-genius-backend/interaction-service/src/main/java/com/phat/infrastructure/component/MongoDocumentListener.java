package com.phat.infrastructure.component;

import com.phat.domain.model.AbstractEntity;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.util.Date;

import static com.phat.common.Utils.getCurrentUser;

@Component
public class MongoDocumentListener extends AbstractMongoEventListener<AbstractEntity> {

    @Override
    public void onBeforeConvert(BeforeConvertEvent<AbstractEntity> event) {
        AbstractEntity entity = event.getSource();

        if (entity.getIsDeleted() == null) {
            entity.setIsDeleted(false);
        }

        if (entity.getCreatedBy() == null) {
            entity.setCreatedBy(getCurrentUser());
        }

        entity.setUpdatedBy(getCurrentUser());
    }

}

