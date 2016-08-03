(function() {

  var app = angular.module("yw-editor-app", []);

  var MainController = function($scope, $http) {

    var editor = ace.edit("editor");
    var viewer = ace.edit("viewer");

    editor.getSession().on('change', function(e) {
        $scope.getGraph();
    });

    $scope.setMode = function() {
      editor.session.setMode( "ace/mode/" + $scope.scriptLanguage );
    }

    $scope.setTheme = function() {
      
      editor.setTheme( $scope.theme );
      viewer.setTheme( $scope.theme );
      
      if ($scope.theme == "ace/theme/xcode") {
        $scope.background = "#fcfcfc";
      } else {
        $scope.background = "#b0b0b0";
      }
    }

    $scope.getGraph = function() {
      $http.post(
        "http://localhost:8081/api/v1/graph/",
        {
            language: $scope.scriptLanguage,
            code: editor.getValue()
        })
        .then(onGraphComplete);
    }

    var onGraphComplete = function(response) {
      viewer.setValue(response.data.dot);
      viewer.clearSelection()
    };
    
    $scope.theme = "ace/theme/xcode";
    $scope.scriptLanguage = "r";
    $scope.setTheme();
    $scope.setMode();
    
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
