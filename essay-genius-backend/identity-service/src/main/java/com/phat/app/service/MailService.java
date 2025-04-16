package com.phat.app.service;

import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;

public interface MailService {
    void sendMailToVerifyWithToken(String to, String token) throws MessagingException, UnsupportedEncodingException, UnsupportedEncodingException;

    void sendMailToVerifyWithCode(String to, String code) throws MessagingException, UnsupportedEncodingException;

    void sendMailToResetPassword(String to, String code) throws MessagingException, UnsupportedEncodingException, MessagingException;

    void sendMailToVerifyWithBoth(String to, String token, String code) throws MessagingException, UnsupportedEncodingException, MessagingException;

}
