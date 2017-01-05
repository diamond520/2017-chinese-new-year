'use strict';
app.controller('roosterController', ['$scope', '$window', function($scope, $window){

}]);

app.controller('slideController', ['$scope', '$window', '$facebook', '$timeout', 'roosterService', function($scope, $window, $facebook, $timeout, $roosterService){
  $scope.fb_login_active = true;
	$scope.status = false;
  $scope.fbLogin = function(){
		$facebook.login();
  };

	$scope.$on('fb.auth.authResponseChange', function() {
		$scope.status = $facebook.isConnected();
		if($scope.status) {
			$facebook.api('/me').then(function(user) {
				$scope.user = user;
			});
		}
	});

	$scope.loginToggle = function() {
		if($scope.status) {
			$facebook.logout();
		} else {
			$facebook.login();
		}
	};

	$scope.share = function(){
		if(!$scope.status){
			console.log('not login');
			return;
		}
		console.log('share');
		var url = "http://www.facebook.com/sharer/sharer.php?u=http://share.settv.com.tw/og/";
		$window.open(url,'facebook-share-dialog','width=626,height=436');
	}
}]);

app.controller('postController', ['$scope', '$window', '$http', 'roosterService', function($scope, $window, $http, $roosterService){
	$scope.posts = [];

	$roosterService.projectnews()
	.then(function(response){
		// console.log(response);
		var news = response.data[0].newsList;
		news.map(function(k){
			// console.log(k)
			var item = {
				type: 'post',
				className: 'portfolio-item pf-media pf-icons',
				title: k.shortSlug,
				imgSrc: k.imageFile + k.imageID + '-L.jpg',
				desc: k.summary, 
				url: k.url
			}
			$scope.posts.push(item);
		});
	}).then(function(){
		var index = 4;
		var ad = {
			type: 'ad',
			className: 'portfolio-item pf-media pf-icons',
		}
		$scope.posts.splice(index, 0, ad);
	});
}]);