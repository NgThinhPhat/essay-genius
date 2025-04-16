package com.phat.domain.enums;

import lombok.Getter;

@Getter
public enum Visibility {
    PUBLIC("public"),
    PRIVATE("private");

    private final String value;

    Visibility(String value) {
        this.value = value;
    }

    public static Visibility fromValue(String value) {
        for (Visibility visibility : Visibility.values()) {
            if (visibility.getValue().equalsIgnoreCase(value)) {
                return visibility;
            }
        }
        throw new IllegalArgumentException("Unknown visibility: " + value);
    }
}
