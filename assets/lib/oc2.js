(function() {
	'use strict';
	angular
		.module('angular-owl-carousel-directive', [])
		.directive('owlCarousel', angularOwlCarouselDirective);
	/** @ngInject */
	function angularOwlCarouselDirective() {
		return {
			restrict: 'EA',
			transclude: true,
			scope: {
				owlItems: '=owlItems',
				owlOptions: '=owlOptions'
			},
			link: function(scope, element, attributes, controller, transclude) {
				var options = scope.owlOptions || undefined,
					carouselInit = false,
					owlCarousel = $(element).addClass('owl-carousel');
				if(typeof scope.owlItems == 'undefined') {
					console.error('You have to pass items for carousel using "owl-items", check documentation on https://github.com/DjKarui/angular-owl-carousel-directive');
					return false;
				}
				if(typeof options == 'undefined') {
					console.warn('You have to pass options for carousel using "owl-options", check documentation on https://github.com/DjKarui/angular-owl-carousel-directive');
					options = {
						items: 1,
						nav: true
					};
				}
				scope.$watchCollection('owlItems', function(items) {
					if(carouselInit) {
						owlCarousel.trigger('destroy.owl.carousel');
					}
					owlCarousel.empty();
					for(var i in items) {
						if(items.hasOwnProperty(i)) {
							transclude(function(clone, scope) {
								scope.item = items[i];
								scope.index = i;
								owlCarousel.append(clone[1]);
							});
						}
					}
					try {
						owlCarousel.owlCarousel(options);
						carouselInit = true;
					}catch(e) {
						console.error(e);
					}
				});
			}
		}
	}
})();