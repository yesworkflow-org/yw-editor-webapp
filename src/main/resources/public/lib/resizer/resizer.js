angular.module('mc.resizer', []).directive('resizer', function($document) {

	return function($scope, $element, $attrs) {

		var separator = $element;
		var container = $(separator).parent()[0];
		var leftPanel = $attrs.resizerLeft;
		var rightPanel = $attrs.resizerRight;
		var separatorWidth = parseInt($attrs.resizerWidth);

		window.addEventListener("resize", onWindowResize);

		function onWindowResize() {
			if (container.offsetWidth < separator[0].offsetLeft) {
				moveSliderTo(container.offsetWidth);
			}
		};

		$(separator).on('mousedown', function(event) {
			event.preventDefault();
			$document.on('mousemove', mousemove);
			$document.on('mouseup', mouseup);
		});

		function moveSliderTo(x) {
			$(leftPanel).css({ width: x + 'px' });
			$(separator).css({ left: x + 'px'});
			$(rightPanel).css({ left: (x + separatorWidth) + 'px' });
		}

		function mousemove(event) {

			var x = event.pageX - container.offsetLeft - separatorWidth / 2;

			if ( x < -separatorWidth) {
				x = -separatorWidth;
			}

			if (x > container.offsetWidth) {
				x = container.offsetWidth;
			}

			moveSliderTo(x);

			// $scope.$apply();
		}

		function mouseup() {
			$document.unbind('mousemove', mousemove);
			$document.unbind('mouseup', mouseup);
		}
	};
});