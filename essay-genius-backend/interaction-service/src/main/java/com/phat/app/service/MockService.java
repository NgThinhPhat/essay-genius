package com.phat.app.service;

import org.springframework.stereotype.Service;

@Service
public interface MockService {
    public void init();
    public void mock();
    public void clear();
}
