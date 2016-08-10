(function() {

  var app = angular.module("yw-editor-app", ['ngSanitize']);

  var MainController = function($scope, $http) {

    var config;

    var onEditorConfigReceived = function(response) {
      config = response.data;
      config.graphServiceUrlBase = "http://" + config.graphServiceHost + 
                                ":" + config.graphServicePort + 
                                "/api/" + config.graphServiceApiVersion;
    } 

    $http.get("/api/v1/config")
        .then(onEditorConfigReceived);

    var editor = ace.edit("editor");
    var viewer = ace.edit("viewer");
    var graph = {};    
    var svg_native_width = 1;
    var svg_native_height = 1;

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
      viewer.navigateTo(0,0);
    }

    $scope.getGraph = function() {

      if (config) {
        $http.post(
          config.graphServiceUrlBase + "/graph",
          {
              language: $scope.language,
              code: editor.getValue()
          })
          .then(onGraphComplete);
      }
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
            svg.attr("preserveAspectRatio", "xMinYMin meet");
            svg_native_width = parseInt(svg.attr("width").slice(0, -2));
            svg_native_height = parseInt(svg.attr("height").slice(0, -2));
            updateSvgSize();
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
    

    function updateSvgSize() {

      if ($scope.viewerZoom !== "fit") {

        var zoom = parseInt($scope.viewerZoom);
        svg.attr("width", svg_native_width * zoom / 100);
        svg.attr("height", svg_native_height * zoom / 100);

      } else {

        var body_bbox = body.node().getClientRects()[0];
        var svg_div_bbox = svg_div.node().getClientRects()[0];

        var div_width = svg_div_bbox.width - 5;
        var div_height = body_bbox.height - 5;

        if (div_width >= svg_native_width && div_height >= svg_native_height) {

          svg.attr("width", svg_native_width);
          svg.attr("height", svg_native_height);

        } else {

          var fit_width_zoom = div_width / svg_native_width;
          var fit_height_zoom = div_height / svg_native_height;
          
          if (fit_height_zoom > fit_width_zoom) {
            svg.attr("width", div_width);
            svg.attr("height", svg_native_height * fit_width_zoom);
          } else {
            svg.attr("height", div_height);
            svg.attr("width", svg_native_width * fit_height_zoom);
          }
        }
      }
    }

    $scope.onScriptSelect = function() {
      $scope.loadSample($scope.sampleToLoad);
    }

    var onSampleLoaded = function(response) {
      editor.setValue(response.data);
      editor.navigateTo(0,0);
      $scope.getGraph();
    }

    $scope.loadSample = function(script) {
        $http.get("samples/" + script)
          .then(onSampleLoaded);
    }

    function onGraphViewerResize() {
      updateSvgSize();
      $scope.$apply();
    }

    window.addEventListener("resize", onGraphViewerResize);

    $scope.theme = "ace/theme/xcode";
    $scope.language = "python";
    $scope.viewerMode = "skeleton";
    $scope.showGrapher = false;
    $scope.viewerZoom="100";
    $scope.sampleToLoad="blank.py";
    $scope.languageChange();
    $scope.graphSvg = '';
    
    viewer.setReadOnly(true);
    viewer.setHighlightActiveLine(false);
    viewer.setShowPrintMargin(false);
    viewer.setHighlightGutterLine(false);
    viewer.renderer.setShowGutter(false);
    viewer.session.setMode( "ace/mode/java" );

    var body = d3.select("#script");
    var svg_div = d3.select('#grapher');

    editor.setShowPrintMargin(false); 
    $scope.loadSample("blank.py");
  };

  app.controller("MainController", ["$scope", "$http", MainController]);

}());
