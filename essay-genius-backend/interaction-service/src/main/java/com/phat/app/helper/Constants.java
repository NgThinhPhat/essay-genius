package com.phat.app.helper;

import com.nimbusds.jose.JWSAlgorithm;

import static com.nimbusds.jose.JWSAlgorithm.HS512;

public class Constants {
    public static String MICROSERVICE_NAME = "ESSAY-SERVICE";

    public static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    public static final String KAFKA_TOPIC_SEND_MAIL = "SEND_MAIL";

    public static final JWSAlgorithm ACCESS_TOKEN_SIGNATURE_ALGORITHM = HS512;
}
