package org.yesworkflow.webapp.editor.model;

public class YWEditorConfiguration {
    
    private String editorServiceBaseUrl;
    private String graphServiceBaseUrl;

	public YWEditorConfiguration() {}

    public YWEditorConfiguration(String editorServiceBaseUrl, String graphServiceBaseUrl) {
        this();
        this.editorServiceBaseUrl = editorServiceBaseUrl;
        this.graphServiceBaseUrl = graphServiceBaseUrl;
    }

    public void setEditorServiceBaseUrl(String editorServiceBaseUrl) {
        this.editorServiceBaseUrl = editorServiceBaseUrl;
    }

    public String getEditorServiceBaseUrl() {
        return this.editorServiceBaseUrl;
    }

    public void setgraphServiceBaseUrl(String graphServiceBaseUrl) {
        this.graphServiceBaseUrl = graphServiceBaseUrl;
    }

    public String getGraphServiceBaseUrl() {
        return this.graphServiceBaseUrl;
    }
}
