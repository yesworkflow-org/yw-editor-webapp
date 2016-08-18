angular.module('mc.resizer', []).directive('resizer', function($document) {

	return function($scope, $element, $attrs) {

		var separator = $element;
		var container = $(separator).parent()[0];
		var leftPanel = $attrs.resizerLeft;
		var rightPanel = $attrs.resizerRight;
		var leftMinWidth = parseInt($attrs.leftMinWidth);
		var separatorWidth = parseInt($attrs.resizerWidth);
		var rightMinWidth = parseInt($attrs.rightMinWidth);

		window.addEventListener("resize", onWindowResize);

		function onWindowResize() {
			if (container.offsetWidth - rightMinWidth < separator[0].offsetLeft) {
				moveSliderTo(container.offsetWidth - -rightMinWidth);
			}
		};

		$(separator).on('mousedown', function(event) {
			event.preventDefault();
			$document.on('mousemove', mousemove);
			$document.on('mouseup', mouseup);
		});

		function moveSliderTo(x) {
			$(leftPanel).css({ width: x + 'px' });
			$(separator).css({ left: x + 'px' });
			$(rightPanel).css({ left: (x + separatorWidth) + 'px' });
			$scope.onParentResize();
		}

		function mousemove(event) {
			var x = event.pageX - container.offsetLeft - separatorWidth / 2;
			if ( x < leftMinWidth) x = leftMinWidth;
			if (x > container.offsetWidth - rightMinWidth) x = container.offsetWidth - rightMinWidth;
			moveSliderTo(x);
		}

		function mouseup() {
			$document.unbind('mousemove', mousemove);
			$document.unbind('mouseup', mouseup);
		}
	};
});