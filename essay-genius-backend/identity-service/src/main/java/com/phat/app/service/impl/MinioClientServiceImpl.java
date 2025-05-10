package com.phat.app.service.impl;

import com.phat.api.model.request.HandleFileEvent;
import com.phat.app.service.MinioClientService;
import com.phat.common.exception.file.FileException;
import io.minio.*;
import io.minio.errors.MinioException;
import io.minio.http.Method;
import io.minio.messages.Item;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.stream.StreamSupport;

import static com.phat.common.exception.file.FileErrorCode.*;
import static java.util.concurrent.TimeUnit.DAYS;
import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class MinioClientServiceImpl implements MinioClientService {
    MinioClient minioClient;

    @Value("${minio.bucket-name}")
    @NonFinal
    String bucketName;

    @Value("${minio.temp-bucket-name}")
    @NonFinal
    String tempBucketName;

    public MinioClientServiceImpl(
            @Value("${minio.endpoint}") String endpoint,
            @Value("${minio.access-key}") String accessKey,
            @Value("${minio.secret-key}") String secretKey,
            @Autowired KafkaTemplate<String, HandleFileEvent> fileStorageTemplate) {
        this.minioClient =
                MinioClient.builder().endpoint(endpoint).credentials(accessKey, secretKey).build();
        log.info("MinioClientService initialized with endpoint: {}", endpoint);
    }

    @Override
    public void storeObject(File file, String fileName, String contentType, String bucketName) {
        log.info("Storing file '{}' in bucket '{}'", fileName, bucketName);
        try {
            ensureBucketExists(bucketName);
            minioClient.putObject(
                    PutObjectArgs.builder().bucket(bucketName).object(fileName).stream(
                                    Files.newInputStream(file.toPath()), file.length(), -1)
                            .contentType(contentType)
                            .build());
            log.debug("File '{}' stored successfully in bucket '{}'", fileName, bucketName);
        } catch (Exception e) {
            log.error("Error storing file '{}' in bucket '{}'", fileName, bucketName, e);
            throw new FileException(CAN_NOT_STORE_FILE, BAD_REQUEST, e.getMessage());
        }
    }

    @Override
    public void uploadObject(byte[] imageBytes, String bucketName, String objectName, String contentType) {
        log.info("Uploading object '{}' to bucket '{}'", objectName, bucketName);
        try {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .stream(new ByteArrayInputStream(imageBytes), imageBytes.length, -1)
                            .contentType(contentType)
                            .build()
            );

        } catch (Exception e) {
            log.error("Error ensuring bucket '{}' exists", bucketName, e);
            throw new FileException(CAN_NOT_STORE_FILE, BAD_REQUEST, e.getMessage());
        }
    }

    @Override
    public String getObjectUrl(String objectKey, String bucketName) {
        log.info("Getting URL for object '{}' in bucket '{}'", objectKey, bucketName);
        try {
            String url = minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucketName)
                            .object(objectKey)
                            .expiry(1, DAYS) // 1 week
                            .build());
            log.debug("URL for object '{}' is: {}", objectKey, url);
            return url;
        } catch (MinioException | InvalidKeyException | IOException | NoSuchAlgorithmException e) {
            log.error("Error getting URL for object '{}' in bucket '{}'", objectKey, bucketName, e);
            throw new FileException(COULD_NOT_READ_FILE, BAD_REQUEST, e.getMessage());
        }
    }

    @Override
    public void deleteObject(String objectKey, String bucketName) {
        log.info("Deleting object '{}' from bucket '{}'", objectKey, bucketName);
        try {
            GetObjectResponse response =
                    minioClient.getObject(
                            GetObjectArgs.builder().bucket(bucketName).object(objectKey).build());

            if (response == null) {
                log.warn("File '{}' not found in bucket '{}'", objectKey, bucketName);
                throw new FileException(FILE_NOT_FOUND, BAD_REQUEST, "File not found");
            }

            minioClient.removeObject(
                    RemoveObjectArgs.builder().bucket(bucketName).object(objectKey).build());
            log.debug("Object '{}' deleted successfully from bucket '{}'", objectKey, bucketName);
        } catch (Exception e) {
            log.error("Error deleting object '{}' from bucket '{}'", objectKey, bucketName, e);
            throw new FileException(CAN_NOT_DELETE_FILE, BAD_REQUEST, e.getMessage());
        }
    }

    private void ensureBucketExists(String bucketName) {
        log.info("Ensuring that bucket '{}' exists", bucketName);
        try {
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
                log.info("Bucket '{}' created.", bucketName);
            }
        } catch (Exception e) {
            log.error("Error checking if bucket '{}' exists", bucketName, e);
            throw new FileException(CAN_NOT_CHECK_BUCKET, BAD_REQUEST, e.getMessage());
        }
    }

    @Override
    public long countObjectsInBucket(String bucketName) {
        log.info("Counting objects in bucket '{}'", bucketName);
        try {
            Iterable<Result<Item>> results =
                    minioClient.listObjects(ListObjectsArgs.builder().bucket(bucketName).build());
            long count = StreamSupport.stream(results.spliterator(), false).count();
            log.debug("Found {} objects in bucket '{}'", count, bucketName);
            return count;
        } catch (Exception e) {
            log.error("Error counting objects in bucket '{}'", bucketName, e);
            throw new FileException(CAN_NOT_CHECK_BUCKET, BAD_REQUEST, e.getMessage());
        }
    }
}


