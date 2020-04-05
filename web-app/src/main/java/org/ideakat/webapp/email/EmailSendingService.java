package org.ideakat.webapp.email;

import org.ideakat.webapp.email.config.AsyncEmailThreadPoolConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;

@Service
public class EmailSendingService {

    @Autowired
    private JavaMailSender mailSender;

    private ThreadPoolTaskExecutor taskExecutor;

    private int queueCapacity;
    private int throttleQueueSizeThreshold;
    private int throttleWaitTimeMs;

    @Autowired
    public EmailSendingService(AsyncEmailThreadPoolConfig config){
        ThreadPoolTaskExecutor threadPool = new ThreadPoolTaskExecutor();
        threadPool.setCorePoolSize(config.getCoreSize());
        threadPool.setMaxPoolSize(config.getMaxPoolSize());
        threadPool.setKeepAliveSeconds(config.getKeepAliveSeconds());
        threadPool.setQueueCapacity(config.getQueueCapacity());
        threadPool.initialize();

        this.taskExecutor = threadPool;
        this.queueCapacity = config.getQueueCapacity();
        this.throttleQueueSizeThreshold = config.getThrottleQueueSizeThreshold();
        this.throttleWaitTimeMs = config.getThrottleWaitTimeMs();
    }

    public void sendEmailAsync(String toAddress, String subject, String message, String fromAddress) {
        //TODO add logging
        int queueSize = queueCapacity - taskExecutor.getThreadPoolExecutor().getQueue().remainingCapacity();
        int sendDelay = queueSize >= throttleQueueSizeThreshold? throttleWaitTimeMs : 0;

        taskExecutor.execute(() -> {
            if (sendDelay > 0){
                try {
                    Thread.sleep(sendDelay);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }

            mailSender.send(mimeMessage -> {
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);
                helper.setTo(toAddress);
                helper.setFrom(fromAddress);
                helper.setSubject(subject);
                helper.setText(message, true);
            });
        });
    }
}
