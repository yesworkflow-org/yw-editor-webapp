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
          if (graph.skeleton) {
            $scope.showGrapher = false;
            viewer.setValue(graph.skeleton);
          } else {
            viewer.setValue(graph.error)
          }
          break;
        
        case "dot":
          $scope.showGrapher = false;
          if (graph.dot) {
            viewer.setValue(graph.dot);
          } else {
            viewer.setValue(graph.error)
          }
          break;
          
        case "graph":
          if (graph.svg) {
            $scope.showGrapher = true;
            var svgElementStart = graph.svg.search("<svg");
            var svgElement = graph.svg.substring(svgElementStart);
            d3.select('#grapher').html(svgElement);
            svg = d3.select('svg');
            // svg.attr("width", "900");
            // svg.attr("height", "900");
          } else {
            $scope.showGrapher = false;
            viewer.setValue(graph.error);
          }
          break;
      }
      
      if (content === null) {
        content = graph.error;
      }
      
      viewer.clearSelection();
    };
    
    $scope.theme = "ace/theme/xcode";
    $scope.language = "r";
    $scope.viewerMode = "skeleton";
    $scope.showGrapher = false;
    $scope.themeChange();
    $scope.languageChange();
    $scope.graphSvg = '';
    
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
