package org.ideakat.webapp.web;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.concurrent.TimeUnit;

@Configuration
public class WebMvcConfiguration implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        final CacheControl publicCachedResource = CacheControl
                .maxAge(30, TimeUnit.DAYS)
                .cachePublic();
        registry.addResourceHandler(cachedExtensions("js", "png", "woff2", "woff", "ttf"))
                .addResourceLocations("classpath:/static", "classpath:/static/app")
                .setCacheControl(publicCachedResource);
    }

    private static String[] cachedExtensions(String... extensions){
        String[] pathPatterns = new String[extensions.length];
        for (int i = 0; i < pathPatterns.length; i++){
            pathPatterns[i] = String.format("/**/*.%s", extensions[i]);
        }
        return pathPatterns;
    }
}
