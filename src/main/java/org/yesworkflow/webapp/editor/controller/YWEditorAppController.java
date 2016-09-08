package org.yesworkflow.webapp.editor.controller;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;

import org.springframework.beans.factory.InitializingBean;
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
@RequestMapping("/${editor-service.prefix}/api/${editor-service.version}/")
@EnableAutoConfiguration
@CrossOrigin
public class YWEditorAppController implements InitializingBean {

	private String editorServiceBaseUrl;
	private String graphServiceBaseUrl;

	@Value("${editor-service.host}") 	public String editorServiceHost;
	@Value("${editor-service.prefix}")	public String editorServicePrefix;
	@Value("${editor-service.version}") public String editorServiceVersion;

	@Value("${graph-service.host}")		public String graphServiceHost;
	@Value("${graph-service.prefix}")	public String graphServicePrefix;
	@Value("${graph-service.version}") 	public String graphServiceVersion;

	public void afterPropertiesSet() throws Exception {
		editorServiceBaseUrl = restUrl(editorServiceHost, editorServicePrefix, editorServiceVersion);
		graphServiceBaseUrl = restUrl(graphServiceHost, graphServicePrefix, graphServiceVersion);
		System.out.println(editorServiceBaseUrl);
		System.out.println(graphServiceBaseUrl);
	}
	
	@RequestMapping(value="config", method=RequestMethod.GET)
	public YWEditorConfiguration getConfiguration() {
		return new YWEditorConfiguration(
			editorServiceBaseUrl, 
			graphServiceBaseUrl
		);
	}

	private String restUrl(String host, String prefix, String version) {
		if (host.trim().length()==0 || host.toUpperCase().equals("SHARED")) {
			return String.format("/%s/api/%s/", prefix, version);
		} else {
			return String.format("http://%s/%s/api/%s/", host, prefix, version);
		}
	}
}

