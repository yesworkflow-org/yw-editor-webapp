angular.module('yw.divider', []).directive('yw.divider', function($document) {

	return function($scope, $element, $attrs) {

		/* parse element attributes */
		var divider = $element[0];
		var leftPanel = document.getElementById($attrs.leftPanel);
		var rightPanel = document.getElementById($attrs.rightPanel);
		var leftMinWidth = parseInt($attrs.leftMinWidth);
		var dividerWidth = parseInt($attrs.dividerWidth);
		var rightMinWidth = parseInt($attrs.rightMinWidth);
		var leftPanelFraction = parseFloat($attrs.leftPanelFraction);

		/* get the element containing the divider element */
		var container = divider.parentElement;

		/* repositions divider and resizes left an right panels accordingly */
		function moveDividerTo(x) {
			if (x < leftMinWidth) x = leftMinWidth;
			if (x > container.offsetWidth - rightMinWidth) x = container.offsetWidth - rightMinWidth;
			leftPanel.style.width = x + 'px';
			divider.style.left = x + 'px';
			rightPanel.style.left = x + dividerWidth + 'px';
			$scope.onParentResize();
			leftPanelFraction = x / container.offsetWidth;
		}

		/* continue dragging divider as mouse is moved with button down */
		function mousemove(event) {
			var x = event.pageX - container.offsetLeft - dividerWidth / 2;
			moveDividerTo(x);
		}

		/* stop dragging divider when mouse button is released */
		function mouseup() {
			$document.unbind('mousemove', mousemove);
			$document.unbind('mouseup', mouseup);
		}

		/* update divider position when browser window is resized */		
		window.addEventListener("resize", function() {
			moveDividerTo(container.offsetWidth * leftPanelFraction);
		});

		/* start dragging of divider when mouse pressed on divider */		
		divider.addEventListener('mousedown', function(event) {
			event.preventDefault();
			$document.on('mousemove', mousemove);
			$document.on('mouseup', mouseup);
		});

		/* start divider position according to requested initial left panel width */
		moveDividerTo(container.offsetWidth * leftPanelFraction);
	};
});