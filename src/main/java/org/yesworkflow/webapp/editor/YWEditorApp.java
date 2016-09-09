package org.yesworkflow.webapp.editor;

import org.springframework.boot.SpringApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@ComponentScan(basePackages="org.yesworkflow.webapp.editor,org.yesworkflow.service.graph")
public class YWEditorApp {

    public static void main(String[] args) {
        SpringApplication.run(YWEditorApp.class, args);
    }
}