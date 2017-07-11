(function() {

  var app = angular.module("yw-editor-app", ['ngSanitize', 'yw.divider', 'ngAnimate', 'ui.bootstrap']);

  var MainController = function($scope, $http, $timeout) {

    var config;

    var onEditorConfigReceived = function(response) {
      config = response.data;
    } 

    $http.get("/yw-editor-service/api/v1/config")
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
      editor.focus();
    }

    $scope.keybindingeChange = function() {
      if ($scope.keybinding === 'ace') {
        editor.setKeyboardHandler(null);
      } else {
        editor.setKeyboardHandler("ace/keyboard/" + $scope.keybinding);
      }
      editor.focus();
    }

    $scope.fontsizeChange = function() {
      editor.setFontSize(parseInt($scope.fontsize));
      viewer.setFontSize(parseInt($scope.fontsize));
      editor.focus();
    }

    $scope.themeChange = function() {

      var aceTheme;
      
      if ($scope.theme == "light") {
        aceTheme = "ace/theme/xcode";
        $scope.background = "#fcfcfc";
        graphViewer.setAttribute('style', "background: white;");      
      } else {
        aceTheme = "ace/theme/tomorrow_night";
        $scope.background = "#b0b0b0";
        graphViewer.setAttribute('style', "background: #b0b0b0;");      
      }
      
      editor.setTheme(aceTheme);
      viewer.setTheme(aceTheme);

      updateSvg();
    }

    $scope.viewerModeChange = function() {
      updateViewer();
      viewer.navigateTo(0,0);
    }

    $scope.showProcessNodesChange = function() {
      if ($scope.showProcessNodes) {
          if ($scope.showDataNodes) {
            $scope.graphView="combined";
          } else {
            $scope.graphView="process";
          }
      } else {
          $scope.showDataNodes=true;
          $scope.graphView="data";
      }
      $scope.getGraph();
    }

    $scope.showDataNodesChange = function() {
      if ($scope.showDataNodes) {
          if ($scope.showProcessNodes) {
            $scope.graphView="combined";
          } else {
            $scope.graphView="data";
          }
      } else {
          $scope.showProcessNodes=true;
          $scope.graphView="process";
      }
      $scope.getGraph();
    }

    $scope.getGraph = function() {

      if (config) {
        $http.post(
          config.graphServiceBaseUrl + "graph",
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
                          "graph.workflowbox = " + $scope.graphWorkflowBox + "\n" +
                          "graph.titleposition = " + $scope.graphTitlePosition + "\n" +
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
      editor.focus();
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

        case "facts":
          $scope.showGraphViewer = false;
          if (graph.facts) {
            viewer.setValue(graph.facts);
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
            if (graph.error) {
              viewer.setValue(graph.error);
            } else {
              viewer.setValue("Graph service error");
            }
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
      graphViewer.innerHTML = svgElement;
      svg = graphViewer.getElementsByTagName("svg")[0];      
      svg.setAttribute("preserveAspectRatio", "xMinYMin meet");
      svg_native_width = parseInt(svg.getAttribute("width").slice(0, -2));
      svg_native_height = parseInt(svg.getAttribute("height").slice(0, -2));

      var background = svg.getElementsByTagName("polygon")[0];
      if ($scope.theme == "light") {
        background.setAttribute("fill", "white");
      } else {
        background.setAttribute("fill", "#b0b0b0");
      }

      if ($scope.viewerZoom !== "fit") {

        var zoom = parseInt($scope.viewerZoom);
        svg.setAttribute("width", svg_native_width * zoom / 100);
        svg.setAttribute("height", svg_native_height * zoom / 100);

      } else {

        var script_div = document.getElementById("script");
        var viewer_container_div = document.getElementById("viewer");

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
          svg.setAttribute("width", div_width);
          svg.setAttribute("height", svg_native_height * fit_width_zoom);
        } else {
          svg.setAttribute("height", div_height);
          svg.setAttribute("width", svg_native_width * fit_height_zoom);
        }
      }
    }

    $scope.onScriptSelect = function() {
      $scope.loadSample($scope.sampleToLoad);
    }

    var onSampleLoaded = function(response) {
      editor.setValue(response.data);
      editor.navigateTo(0,0);
      setTimeout(function() { $scope.getGraph(); }, 100);
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

    $scope.fontsize="12";
    $scope.fontsizeChange();

    $scope.viewerMode = "graph";
    $scope.showGraphViewer = false;
    $scope.viewerZoom="fit";
    $scope.sampleToLoad="helloworld.py";
    $scope.languageChange();
    $scope.graphSvg = '';

    $scope.showProcessNodes = true;
    $scope.showDataNodes = true;
    $scope.graphView = 'combined';
    $scope.graphLayout = 'tb';
    $scope.graphParams = 'reduce';
    $scope.graphPorts = 'relax';
    $scope.dataLabel = 'both';
    $scope.programLabel = 'both';
    $scope.edgeLabels = 'hide';
    $scope.graphWorkflowBox = 'show';
    $scope.graphTitlePosition = 'top';

    viewer.setReadOnly(true);
    viewer.setHighlightActiveLine(false);
    viewer.setShowPrintMargin(false);
    viewer.setHighlightGutterLine(false);
    viewer.renderer.setShowGutter(false);
    viewer.session.setMode( "ace/mode/java" );
    editor.setShowPrintMargin(false);

    editor.setKeyboardHandler(null);

    var graphViewer = document.getElementById("graph-viewer");

    $scope.language = 'python';

    $timeout(onLoadInitialScript, 100);
  };

  app.controller("MainController", ["$scope", "$http", "$timeout", MainController]);

}());
