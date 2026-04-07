package com.outdoorclub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.outdoorclub")
public class OutdoorClubApplication {
    public static void main(String[] args) {
        SpringApplication.run(OutdoorClubApplication.class, args);
    }
}