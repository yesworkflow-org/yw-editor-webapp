angular.module('yw.divider', []).directive('yw.divider', function($document) {

	return function($scope, $element, $attrs) {

		var divider = $element;
		var container = $(divider).parent()[0];
		var leftPanel = $attrs.leftPanel;
		var rightPanel = $attrs.rightPanel;
		var leftMinWidth = parseInt($attrs.leftMinWidth);
		var dividerWidth = parseInt($attrs.dividerWidth);
		var rightMinWidth = parseInt($attrs.rightMinWidth);
		var leftPanelFraction = parseFloat($attrs.leftPanelFraction);

		window.addEventListener("resize", updateDividerPosition);
		moveDividerTo(container.offsetWidth * leftPanelFraction);
		

		function updateDividerPosition() {
			moveDividerTo(container.offsetWidth * leftPanelFraction);
		};

		$(divider).on('mousedown', function(event) {
			event.preventDefault();
			$document.on('mousemove', mousemove);
			$document.on('mouseup', mouseup);
		});

		function moveDividerTo(x) {
			if (x < leftMinWidth) x = leftMinWidth;
			if (x > container.offsetWidth - rightMinWidth) x = container.offsetWidth - rightMinWidth;
			$(leftPanel).css({ width: x + 'px' });
			$(divider).css({ left: x + 'px' });
			$(rightPanel).css({ left: (x + dividerWidth) + 'px' });
			$scope.onParentResize();

			leftPanelFraction = x / container.offsetWidth;
		}

		function mousemove(event) {
			var x = event.pageX - container.offsetLeft - dividerWidth / 2;
			moveDividerTo(x);
		}

		function mouseup() {
			$document.unbind('mousemove', mousemove);
			$document.unbind('mouseup', mouseup);
		}
	};
});