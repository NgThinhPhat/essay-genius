package com.phat.app.helper;

import java.util.Arrays;
import java.util.stream.Collectors;

public class Utils {
    public static String convertToTitleCase(String input) {
        return Arrays.stream(input.split("-"))
                .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
                .collect(Collectors.joining(" "));
    }
}
