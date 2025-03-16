package com.phat.infrastructure.configuration;

import java.util.List;
import java.util.Locale;

public class LocalResolverConfig {

    List<Locale> LOCALES = List.of(
            Locale.forLanguageTag("en"),
            Locale.forLanguageTag("vi")
    );
}
