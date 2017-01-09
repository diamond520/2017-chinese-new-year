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
	if (!Date.now) {
		Date.now = function() { return new Date().getTime(); }
	}
	$scope.date = Math.floor(Date.now() / 1000);

	// get init status when user first came 
	$lottery.getVoteObject( Date.now())
	.then(function(data){
		$scope.vote = data.vote;
		$scope.lotteryItem = data.data[0];
	});
  $scope.goLottery = function(){
		if(!$scope.status){
			$facebook.login();
		}else{
			$lottery.postVote($scope.userData)
			.then(function(response){
				$window.alert('請分享影片以獲得抽獎機會。');
				$scope.lotteryed = true;
			}).catch(function(response) {
				if(response.data.code == 1020){
					$window.alert('每小時抽一次喔！');
				}
			})
		}
  };
	$scope.$on('fb.auth.authResponseChange', function() {
		$scope.status = $facebook.isConnected();
		if($scope.status) {
			var auth = $facebook.getAuthResponse();
			$scope.userData.auth.userId = auth.userID;
			$scope.userData.userId = auth.userID;
			$scope.userData.type = 'facebook';
			$scope.userData.auth.access_token = auth.accessToken;
			$lottery.getVoteObject({type: $scope.userData.type, userId: $scope.userData.auth.userId})
			.then(function(data){
				var lotteryList = data.data.data[0];
				$scope.lotteryItem = lotteryList.data[0];
				$scope.lotteryed = $scope.lotteryItem.voted;
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
	$scope.share = function(videoId){
		if(!$scope.status){
			return;
		}
		var url = "http://www.facebook.com/sharer/sharer.php?u=https://www.youtube.com/embed/"+videoId;
		$window.open(url,'facebook-share-dialog','width=626,height=436');
	}
	$scope.owlItems = [
		{"videoId": "SBjAwupdFsU", "videoTitle": "《HERO@TAIWAN_台灣真英雄》義勇助人-甘惠忠", "startTime": "1484139600"},
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
		var news = response.data[0].newsList;
		news.map(function(k){
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
		var index = 3;
		var ad = {
			type: 'ad',
			className: 'portfolio-item pf-media pf-icons',
		}
		$scope.posts.splice(index, 0, ad);
		// $scope.showpost = $scope.posts.splice(0,6);
	});

	$scope.load = function(){
		$scope.showpost = $scope.posts.splice(0,6);
	}
}]);