package org.yesworkflow.webapp.editor.controller;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import org.yesworkflow.webapp.editor.model.YWEditorConfiguration;

@RestController
@RequestMapping("/api/v1/")
@EnableAutoConfiguration
@CrossOrigin
public class YWEditorAppController {

	@Value("${graphservice.host}")
	public String graphServiceHost;

	@Value("${graphservice.port}")
	public Integer graphServicePort;

	@Value("${graphservice.apiversion}")
	public String graphServiceApiVersion;

	@RequestMapping(value="config", method=RequestMethod.GET)
	public YWEditorConfiguration getConfiguration() {
		return new YWEditorConfiguration(
			graphServiceHost, graphServicePort, graphServiceApiVersion);
	}
}

