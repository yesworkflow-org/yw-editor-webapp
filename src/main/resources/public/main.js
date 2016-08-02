(function() {

  var app = angular.module("yw-editor-app", []);

  var MainController = function($scope, $http) {

    var editor = ace.edit("editor");

    editor.getSession().on('change', function(e) {
        $scope.getGraph();
    });

    $scope.setMode = function() {
      editor.session.setMode("ace/mode/" + $scope.scriptLanguage);
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


    editor.setTheme("ace/theme/twilight");
    editor.session.setMode("ace/mode/python");
    

    $scope.scriptLanguage = "python";
    $scope.graphId = "foo";
  };

  app.controller("MainController", ["$scope", "$http", MainController]);

}());
