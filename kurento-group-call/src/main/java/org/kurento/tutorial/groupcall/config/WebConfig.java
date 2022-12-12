package org.kurento.tutorial.groupcall.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("/**")
                .allowedMethods("*")
                .allowCredentials(true)
                .allowedOrigins("https://css.d1g0mux4e3olzx.amplifyapp.com")
                .allowedHeaders("*");
    }
}
