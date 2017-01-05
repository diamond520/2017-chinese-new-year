'use strict'
app.directive("portfolio", function() {
	return {
		restrict: 'EA',
		// scope: '@',
		templateUrl: './assets/view/portfolio.html',
		replace: true,

	};
});