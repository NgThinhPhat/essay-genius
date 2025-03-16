package com.phat.app.service.impl;

import com.phat.app.service.BaseRedisService;
import jakarta.annotation.PostConstruct;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BaseRedisServiceImpl<K, F, V> implements BaseRedisService<K, F, V> {

    RedisTemplate<K, V> redisTemplate;

    HashOperations<K, F, V> hashOperations;

    public BaseRedisServiceImpl(RedisTemplate<K, V> redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.hashOperations = redisTemplate.opsForHash();
    }

    @Override
    public V get(K key) {
        return redisTemplate.opsForValue().get(key);
    }

    @Override
    public void set(K key, V value) {
        redisTemplate.opsForValue().set(key, value);
    }

    @Override
    public V hashGet(K key, F field) {
        return hashOperations.get(key, field);
    }

    @Override
    public void hashSet(K key, F field, V value) {
        hashOperations.put(key, field, value);
    }

    @Override
    public Boolean exists(K key) {
        return redisTemplate.hasKey(key);
    }

    @Override
    public Boolean delete(K key) {
        return redisTemplate.delete(key);
    }

    @Override
    public Long hashDelete(K key, F... fields) {
        return hashOperations.delete(key, (Object) fields);
    }

    @Override
    public Long increment(K key, F field, long delta) {
        return hashOperations.increment(key, field, delta);
    }

    @Override
    public Map<F, V> hashEntries(K key) {
        return hashOperations.entries(key);
    }

    @Override
    public void setWithExpiration(K key, V value, long timeout, TimeUnit unit) {
        redisTemplate.opsForValue().set(key, value, timeout, unit);
    }

    @Override
    public Boolean setExpire(K key, long timeout, TimeUnit unit) {
        return redisTemplate.expire(key, timeout, unit);
    }

}

