angular.module('mc.resizer', []).directive('resizer', function($document) {

	return function($scope, $element, $attrs) {

		var container = $element.parent();

		$element.on('mousedown', function(event) {
			event.preventDefault();

			$document.on('mousemove', mousemove);
			$document.on('mouseup', mouseup);
		});

		function mousemove(event) {

			if ($attrs.resizer == 'vertical') {

				var x = event.pageX - container[0].offsetLeft - $attrs.resizerWidth / 2;

				if ( x < - $attrs.resizerWidth) {
					x = - $attrs.resizerWidth;
				}
				
				var containerRight = container[0].offsetWidth;

				if (x > containerRight) {
					x = containerRight;
				}

				$element.css({
					left: x + 'px'
				});

				$($attrs.resizerLeft).css({
					width: x + 'px' 
				});
				$($attrs.resizerRight).css({
					left: (x + parseInt($attrs.resizerWidth)) + 'px'
				});

			} else {
				// Handle horizontal resizer
				var y = window.innerHeight - event.pageY;

				$element.css({
					bottom: y + 'px'
				});

				$($attrs.resizerTop).css({
					bottom: (y + parseInt($attrs.resizerHeight)) + 'px'
				});
				$($attrs.resizerBottom).css({
					height: y + 'px'
				});
			}

			// $scope.$apply();
		}

		function mouseup() {
			$document.unbind('mousemove', mousemove);
			$document.unbind('mouseup', mouseup);
		}
	};
});