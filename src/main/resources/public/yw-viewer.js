(function() {

  var app = angular.module("yw-editor-app", ['ngSanitize', 'yw.divider', 'ngAnimate', 'ui.bootstrap']);

  var MainController = function($scope, $http, $timeout) {

    var config;

    var onEditorConfigReceived = function(response) {
      config = response.data;
      config.graphServiceUrlBase =  "http://" + config.graphServiceHost + 
                                    ":"       + config.graphServicePort + 
                                    "/api/"   + config.graphServiceApiVersion;
    } 

    $http.get("/api/v1/config")
        .then(onEditorConfigReceived);

    var editor = ace.edit("editor");
    editor.$blockScrolling = Infinity;

    var viewer = ace.edit("text-viewer");
    viewer.$blockScrolling = Infinity;

    var graph = {};    
    var svg_native_width = 1;
    var svg_native_height = 1;

    editor.getSession().on('change', function(e) {
        $scope.getGraph();
    });

    $scope.languageChange = function() {
      editor.session.setMode( "ace/mode/" + $scope.language );
      $scope.getGraph();
    }

    $scope.keybindingeChange = function() {
      editor.setKeyboardHandler("ace/keyboard/" + $scope.keybinding);
    }

    $scope.fontsizeChange = function() {
      editor.setFontSize(parseInt($scope.fontsize));
      viewer.setFontSize(parseInt($scope.fontsize));
    }


    $scope.themeChange = function() {

      var aceTheme;
      
      if ($scope.theme == "light") {
        aceTheme = "ace/theme/xcode";
        $scope.background = "#fcfcfc";
      } else {
        aceTheme = "ace/theme/tomorrow_night";
        $scope.background = "#b0b0b0";
      }
      
      editor.setTheme(aceTheme);
      viewer.setTheme(aceTheme);

      updateSvg();
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
              code: editor.getValue(),
              properties: "graph.view = " + $scope.graphView + "\n" +
                          "graph.layout = " + $scope.graphLayout + "\n" +
                          "graph.params = " + $scope.graphParams + "\n" +
                          "graph.portlayout = " + $scope.graphPorts + "\n" +
                          "graph.datalabel = " + $scope.dataLabel + "\n" +
                          "graph.programlabel = " + $scope.programLabel + "\n" +
                          "graph.edgelabels = " + $scope.edgeLabels + "\n" +
                          "graph.dotcomments = on\n"
          })
          .then(onGraphComplete);
      }
    }

    var onGraphComplete = function(response) {
      graph = response.data;
      updateViewer();
    } 

    $scope.onZoomSelect = function() {
      $scope.getGraph();
    }
    
    var updateViewer = function() {
      
      var content = null;
      
      switch($scope.viewerMode) {
        
        case "skeleton":
          if (graph.skeleton) {
            $scope.showGraphViewer = false;
            viewer.setValue(graph.skeleton);
          } else {
            viewer.setValue(graph.error)
          }
          break;
        
        case "dot":
          $scope.showGraphViewer = false;
          if (graph.dot) {
            viewer.setValue(graph.dot);
          } else {
            viewer.setValue(graph.error)
          }
          break;
          
        case "graph":
          if (graph.svg) {
            $scope.showGraphViewer = true;
            updateSvg();
          } else {
            $scope.showGraphViewer = false;
            viewer.setValue(graph.error);
          }
          break;
      }
      
      if (content === null) {
        content = graph.error;
      }
      
      viewer.clearSelection();
    };
    
    $scope.onParentResize = function() {
      onGraphViewerResize();
      editor.resize();
      viewer.resize();
    }

    var updateSvg = function() {

      if (graph.svg == null) return;

      var svgElementStart = graph.svg.search("<svg");
      var svgElement = graph.svg.substring(svgElementStart);
      d3.select('#graph-viewer').html(svgElement);

      svg = d3.select('svg');
      svg.attr("preserveAspectRatio", "xMinYMin meet");
      svg_native_width = parseInt(svg.attr("width").slice(0, -2));
      svg_native_height = parseInt(svg.attr("height").slice(0, -2));

      var background = svg.select("polygon");
      if ($scope.theme == "light") {
        background.attr("fill", "white");
      } else {
        background.attr("fill", "#b0b0b0");
      }

      if ($scope.viewerZoom !== "fit") {

        var zoom = parseInt($scope.viewerZoom);
        svg.attr("width", svg_native_width * zoom / 100);
        svg.attr("height", svg_native_height * zoom / 100);

      } else {

        var script_div = d3.select("#script").node();
        var viewer_container_div = d3.select("#viewer").node();

        var div_width = viewer_container_div.getClientRects()[0].width - 40;
        if (div_width < 1) {
          div_width = 1;
        }

        var div_height = viewer_container_div.getClientRects()[0].height - 40;
        if (div_height < 1) {
          div_height = 1;
        }

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
      setTimeout(function () {
        $scope.$apply(function () {
        updateSvg(); 
        });
      }, 100);
    }

    var onLoadInitialScript = function() {
       $scope.loadSample($scope.sampleToLoad);
    }

    window.addEventListener("resize", onGraphViewerResize);

    $scope.theme = "light";
    $scope.keybinding = "ace";
    $scope.language = "python";

    $scope.fontsize="18";
    $scope.fontsizeChange();

    $scope.viewerMode = "graph";
    $scope.showGraphViewer = false;
    $scope.viewerZoom="fit";
    $scope.sampleToLoad="helloworld.py";
    $scope.languageChange();
    $scope.graphSvg = '';

    $scope.graphView = 'combined';
    $scope.graphLayout = 'tb';
    $scope.graphParams = 'reduce';
    $scope.graphPorts = 'relax';
    $scope.dataLabel = 'both';
    $scope.programLabel = 'both';
    $scope.edgeLabels = 'hide';

    
    viewer.setReadOnly(true);
    viewer.setHighlightActiveLine(false);
    viewer.setShowPrintMargin(false);
    viewer.setHighlightGutterLine(false);
    viewer.renderer.setShowGutter(false);
    viewer.session.setMode( "ace/mode/java" );
    editor.setShowPrintMargin(false);

    $scope.language = 'python';

    $timeout(onLoadInitialScript, 100);
  };

  app.controller("MainController", ["$scope", "$http", "$timeout", MainController]);

}());
