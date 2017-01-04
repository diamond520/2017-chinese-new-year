'use strict';
app.controller('roosterController', ['$scope', '$window', function($scope, $window){

}]);

app.controller('slideController', ['$scope', '$window', '$facebook', '$timeout', function($scope, $window, $facebook, $timeout){
  $scope.fb_login_active = true;
	$scope.status = false;
  $scope.fbLogin = function(){
      console.log(123);
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

	$scope.check = function(){
		var a = $facebook.getLoginStatus();
		console.log($scope.status);
		console.log($scope.user);
	}
}]);
