package com.phat.app.service.impl;

import com.phat.app.service.MailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.MessagingException;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import static com.phat.app.helper.Constants.MICROSERVICE_NAME;
import static com.phat.common.components.Translator.getLocalizedMessage;

@Slf4j
@RequiredArgsConstructor
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MailServiceImpl implements MailService {
    JavaMailSender mailSender;

    SpringTemplateEngine templateEngine;

    @Value("${spring.mail.from}")
    @NonFinal
    String emailFrom;

    @Value("${spring.mail.verify-link}")
    @NonFinal
    String verifyLink;

    @Override
    public void sendMailToVerifyWithToken(String to, String token) throws MessagingException, UnsupportedEncodingException, jakarta.mail.MessagingException {
        sendMail(to,
                "subject_verify_email",
                "content_verify_email_with_token",
                "sub_content_verify_email",
                "footer_verify_email", String.format("%s?token=%s", verifyLink, token));
    }

    @Override
    public void sendMailToVerifyWithCode(String to, String code) throws MessagingException, UnsupportedEncodingException, jakarta.mail.MessagingException {
        sendMail(to,
                "subject_verify_email",
                "content_verify_email_with_code",
                "sub_content_verify_email",
                "footer_verify_email", code);
    }

    @Override
    public void sendMailToResetPassword(String to, String code) throws MessagingException, UnsupportedEncodingException, jakarta.mail.MessagingException {
        sendMail(to,
                "subject_reset_password",
                "content_reset_password",
                "sub_reset_password",
                "footer_reset_password", code);
    }

    @Override
    public void sendMailToVerifyWithBoth(String to, String token, String code) throws jakarta.mail.MessagingException, UnsupportedEncodingException, jakarta.mail.MessagingException {
        sendMail(to,
                "subject_verify_email",
                "content_verify_email_with_both",
                "sub_content_verify_email",
                "footer_verify_email", String.format("%s?token=%s&code=%s", verifyLink, token, code));
    }

    private void sendMail(String toMail, String subjectKey,
                          String contentKey,
                          String subContentKey,
                          String footerKey,
                          String secret) throws MessagingException, UnsupportedEncodingException, UnsupportedEncodingException, jakarta.mail.MessagingException {
        log.info("[{}]: Sending confirming link to user, email={}", MICROSERVICE_NAME, toMail);

        String subject = getLocalizedMessage(subjectKey);
        String[] contents = new String[] {
                getLocalizedMessage(contentKey),
                getLocalizedMessage(subContentKey)
        };

        Map<String, Object> properties = new HashMap<>();
        properties.put("secret", secret);
        properties.put("contents", contents);
        properties.put("subject", subject);
        properties.put("footer", getLocalizedMessage(footerKey));

        Context context = new Context();
        context.setVariables(properties);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
        helper.setFrom(emailFrom, "Essay Genius");
        helper.setTo(toMail);
        helper.setSubject(subject);
        String html = templateEngine.process("common-template.html", context);
        helper.setText(html, true);

        mailSender.send(message);

        log.info("[{}]: Confirming link has sent to user, email={}, code={}", MICROSERVICE_NAME, toMail, secret);
    }
}
