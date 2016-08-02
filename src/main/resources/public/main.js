(function() {

  var app = angular.module("yw-editor-app", []);

  var MainController = function($scope, $http) {

    var editor = ace.edit("editor");

    $scope.modeChange = function() {
      editor.session.setMode("ace/mode/" + $scope.scriptLanguage);
    }

    editor.setTheme("ace/theme/twilight");
    editor.session.setMode("ace/mode/python");

    $scope.scriptLanguage = "python";
  };

  app.controller("MainController", ["$scope", "$http", MainController]);

}());
