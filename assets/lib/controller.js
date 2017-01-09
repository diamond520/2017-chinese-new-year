'use strict';
app.controller('roosterController', ['$scope', '$window', function($scope, $window){

}]);

app.controller('slideController', ['$scope', '$window', '$facebook', '$timeout', 'roosterService', 'lottery', function($scope, $window, $facebook, $timeout, $roosterService, $lottery){
  $scope.fb_login_active = true;
	$scope.status = false;
	$scope.lotteryed = false;
	$scope.userData = {
		auth: {}
	};

	// get init status when user first came 
	$lottery.getVoteObject($scope.userData)
	.then(function(data){
		// console.log(data);
		$scope.vote = data.vote;
		$scope.lotteryItem = data.data[0];
	});

  $scope.goLottery = function(){
		if(!$scope.status){
			$facebook.login();
		}else{
			$lottery.postVote($scope.userData)
			.then(function(response){
				console.log(response);
				$scope.lotteryed = true;
			}).catch(function(response) {
				console.error('Gists error', response.status, response.data);
			})
		}
  };

	$scope.$on('fb.auth.authResponseChange', function() {
		// console.log('onchange');
		$scope.status = $facebook.isConnected();
		if($scope.status) {
			var auth = $facebook.getAuthResponse();
			console.log(auth);
			$scope.userData.auth.userId = auth.userID;
			$scope.userData.userId = auth.userID;
			$scope.userData.type = 'facebook';
			$scope.userData.auth.access_token = auth.accessToken;
			console.log($scope.userData);
			$lottery.getVoteObject({type: $scope.userData.type, userId: $scope.userData.auth.userId})
			.then(function(data){
				$scope.lotteryList = data.data.data[0];
				$scope.lotteryItem = $scope.lotteryList.data[0];
				$scope.lotteryed = $scope.lotteryItem.voted;
				console.log($scope.lotteryItem);
				console.log($scope.lotteryed);
			});

			// $facebook.api('/me').then(function(user) {
			// 	$scope.user = user;
			// 	// console.log($scope.user);
			// }).then(function() {
			// 	$scope.userData.type = 'facebook';
			// 	$scope.userData.userId = $scope.user.id;
			// }).then(function() {
			// 	return $lottery.getVoteObject($scope.userData);
			// }).then(function(data){
			// 	$scope.lotteryList = data.data.data[0];
			// 	$scope.lotteryItem = $scope.lotteryList.data[0];
			// 	$scope.lotteryed =$scope.lotteryItem.voted;
			// });
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

	$scope.owlItems = [
    	{"videoId" : "QsgKVMu807c", "videoTitle" : "《HERO@TAIWAN_台灣真英雄》義勇助人-甘惠忠"},
		{"videoId" : "U68uKDQPOMU", "videoTitle" : "《HERO@TAIWAN_台灣真英雄》善行義舉-廖文華"},
		{"videoId" : "a6MbEG9hkLc", "videoTitle" : "《HERO@TAIWAN_台灣真英雄》善行義舉-李百文"}
	];
	angular.forEach($scope.owlItems, function(data, index){
		data.imgSrc = 'http://img.youtube.com/vi/'+data.videoId+'/0.jpg';
	});
	$scope.owlOptions = {
		loop: true,
		'nav': true,
		margin: 1,
		"data-pagi": false,
		items: 1,
		merge: true,
		lazyload:true,
		center: true,
		"items-xxs": 1,
		"items-xs": 2,
		"items-sm": 3,
		"items-lg": 4
	};


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