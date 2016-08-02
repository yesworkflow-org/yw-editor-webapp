(function() {

  var app = angular.module("yw-editor-app", []);

  var MainController = function($scope, $http) {

    var editor = ace.edit("editor");

    editor.getSession().on('change', function(e) {
        $scope.getGraph();
    });

    $scope.setMode = function() {
      editor.session.setMode( "ace/mode/" + $scope.scriptLanguage );
    }

    $scope.setTheme = function() {
      editor.setTheme( $scope.theme );
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
      $scope.dot = response.data.dot;
    };
    
    $scope.theme = "ace/theme/xcode";
    $scope.scriptLanguage = "python";

    editor.setTheme( $scope.theme );
    editor.session.setMode( $scope.scriptLanguage );

  };

  app.controller("MainController", ["$scope", "$http", MainController]);

}());
