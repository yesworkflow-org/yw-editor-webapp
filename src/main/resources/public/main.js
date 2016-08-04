(function() {

  var app = angular.module("yw-editor-app", ['ngSanitize']);

  var MainController = function($scope, $http) {

    var editor = ace.edit("editor");
    var viewer = ace.edit("viewer");
    var graph = {};

    editor.getSession().on('change', function(e) {
        $scope.getGraph();
    });

    $scope.languageChange = function() {
      editor.session.setMode( "ace/mode/" + $scope.language );
    }

    $scope.themeChange = function() {
      
      editor.setTheme( $scope.theme );
      viewer.setTheme( $scope.theme );
      
      if ($scope.theme == "ace/theme/xcode") {
        $scope.background = "#fcfcfc";
      } else {
        $scope.background = "#b0b0b0";
      }
    }

    $scope.viewerModeChange = function() {
      updateViewer();
    }


    $scope.getGraph = function() {
      $http.post(
        "http://localhost:8081/api/v1/graph/",
        {
            language: $scope.language,
            code: editor.getValue()
        })
        .then(onGraphComplete);
    }

    var onGraphComplete = function(response) {
      graph = response.data;
      updateViewer();
    } 
    
    var updateViewer = function() {
      
      var content = null;
      
      switch($scope.viewerMode) {
        
        case "skeleton":
          content = graph.skeleton;
          $scope.showGrapher = false;
          break;
        
        case "dot":
          content = graph.dot;
          $scope.showGrapher = false;
          break;
          
        case "graph":
          content = graph.svg;
          $scope.showGrapher = false;
          break;
      }
      
      if (content === null) {
        content = graph.error;
      }
      
      viewer.setValue(content);
      viewer.clearSelection();
    };
    
    $scope.theme = "ace/theme/xcode";
    $scope.language = "r";
    $scope.viewerMode = "skeleton";
    $scope.showGrapher = false;
    $scope.themeChange();
    $scope.languageChange();
    
    $scope.graphSvg = '<svg><circle cx="0" cy="0" r="40" stroke="green" stroke-width="4" fill="yellow" /></svg>';

    viewer.setReadOnly(true);
    viewer.setHighlightActiveLine(false);
    viewer.setShowPrintMargin(false);
    viewer.setHighlightGutterLine(false);
    viewer.renderer.setShowGutter(false);
    viewer.session.setMode( "ace/mode/java" );

    editor.setShowPrintMargin(false);
    editor.setValue(
      "# Enter your code and YesWorkflow annotations here:\n" +
      "\n" +
      "# @begin MyScript\n" +
      "\n" +
      "# @end MyScript\n");
    editor.clearSelection();
  };

  app.controller("MainController", ["$scope", "$http", MainController]);

}());
