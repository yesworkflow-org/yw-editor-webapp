package org.yesworkflow.webapp.editor.model;

public class YWEditorConfiguration {
    
    private String graphServiceHost;
    private Integer graphServicePort;
    private String graphServiceApiVersion;

	public YWEditorConfiguration() {}

    public YWEditorConfiguration(String graphServiceHost, Integer graphServicePort, String graphServiceApiVersion) {
        this();
        this.graphServiceHost = graphServiceHost;
        this.graphServicePort = graphServicePort;
        this.graphServiceApiVersion = graphServiceApiVersion;
    }

    public void setGraphServiceHost(String graphServiceHost) {
        this.graphServiceHost = graphServiceHost;
    }

    public String getGraphServiceHost() {
        return this.graphServiceHost;
    }

    public void setGraphServicePort(Integer graphServicePort) {
        this.graphServicePort = graphServicePort;
    }

    public Integer getGraphServicePort() {
        return this.graphServicePort;
    }

    public void setGraphServiceApiVersion(String graphServiceApiVersion) {
        this.graphServiceApiVersion = graphServiceApiVersion;
    }

    public String getGraphServiceApiVersion() {
        return this.graphServiceApiVersion;
    }
}
