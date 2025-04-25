package com.phat.api.model.request;
import java.util.List;
public record TopicsRequest (
    List<String> topics
){
}
