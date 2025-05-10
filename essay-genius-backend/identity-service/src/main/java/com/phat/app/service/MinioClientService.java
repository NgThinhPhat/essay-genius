package com.phat.app.service;

import org.springframework.stereotype.Service;

import java.io.File;

@Service
public interface MinioClientService {
    void storeObject(File file, String fileName, String contentType, String bucketName);

    void uploadObject(byte[] imageBytes, String bucketName, String objectName, String contentType);

    String getObjectUrl(String objectKey, String bucketName);

    void deleteObject(String objectKey, String bucketName);

    long countObjectsInBucket(String bucketName);
}

