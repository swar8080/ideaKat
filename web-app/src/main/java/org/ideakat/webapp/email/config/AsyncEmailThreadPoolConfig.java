package org.ideakat.webapp.email.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Configuration
@ConfigurationProperties("ideakat.email.async-thread-pool")
@Component
public class AsyncEmailThreadPoolConfig {
    private int coreSize;
    private int maxPoolSize;
    private int keepAliveSeconds;
    private int queueCapacity;
    private int throttleQueueSizeThreshold;
    private int throttleWaitTimeMs;

    public int getCoreSize() {
        return coreSize;
    }

    public void setCoreSize(int coreSize) {
        this.coreSize = coreSize;
    }

    public int getMaxPoolSize() {
        return maxPoolSize;
    }

    public void setMaxPoolSize(int maxPoolSize) {
        this.maxPoolSize = maxPoolSize;
    }

    public int getKeepAliveSeconds() {
        return keepAliveSeconds;
    }

    public void setKeepAliveSeconds(int keepAliveSeconds) {
        this.keepAliveSeconds = keepAliveSeconds;
    }

    public int getQueueCapacity() {
        return queueCapacity;
    }

    public void setQueueCapacity(int queueCapacity) {
        this.queueCapacity = queueCapacity;
    }

    public int getThrottleQueueSizeThreshold() {
        return throttleQueueSizeThreshold;
    }

    public void setThrottleQueueSizeThreshold(int throttleQueueSizeThreshold) {
        this.throttleQueueSizeThreshold = throttleQueueSizeThreshold;
    }

    public int getThrottleWaitTimeMs() {
        return throttleWaitTimeMs;
    }

    public void setThrottleWaitTimeMs(int throttleWaitTimeMs) {
        this.throttleWaitTimeMs = throttleWaitTimeMs;
    }
}
