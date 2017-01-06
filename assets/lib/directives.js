'use strict'
app.directive("portfolio", function() {
	return {
		restrict: 'EA',
		// scope: '@',
		templateUrl: './assets/view/portfolio.html',
		replace: true,
	};
}).directive("dfp", function() {
	return {
		restrict: 'EA',
		scope: {
			ad: '@'
		},
		templateUrl: './assets/view/dfp.html',
		replace: true,
	};
});

app.directive('owlCarousel', function(){
  return {
    restrict: 'A',
    transclude: false,
    link: function (scope) {
      scope.initCarousel = function(element) {
        var defaultOptions = {};
        var customOptions = scope.$eval($(element).attr('data-options'));
        // combine the two options objects
        for(var key in customOptions) {
          defaultOptions[key] = customOptions[key];
        }
        // init carousel
        $(element).owlCarousel(defaultOptions);
      };
    }
  };
});

app.directive('owlCarouselItem', [function() {
  return {
    restrict: 'A',
    transclude: false,
    link: function(scope, element) {
      // wait for the last item in the ng-repeat then call init
      if(scope.$last) {
        scope.initCarousel(element.parent());
      }
    }
  };
}]);