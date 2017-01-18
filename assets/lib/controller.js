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
	$lottery.getVoteObject()
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
			$window.alert('請先點選【我要抽獎】');
			return;
		}
		var url = ($scope.date < 1484139600) ? "http://event.setn.com/2017chinesenewyear/" : "https://www.youtube.com/embed/" + videoId;
		url = "http://www.facebook.com/sharer/sharer.php?u=" + url;
		$window.open(url,'facebook-share-dialog','width=626,height=436');
	}

	$scope.owlItems = [
		{
			"videoId": "zLoEfm8P3uc", 
			"videoTitleB": "完娛食堂 咕雞咕雞團圓飯 請鎖定1/11 21:00首播", 
			"videoTitleA": "［完娛食堂 咕雞咕雞團圓飯］過年送什麼送到心坎裡！", 
			"startTime": "1484139600"
		},
		{
			"videoId": "B6KsSnjpw90", 
			"videoTitleB": "完娛食堂 咕雞咕雞團圓飯 請鎖定1/18 21:00首播", 
			"videoTitleA": "「圍爐中」完娛食堂咕雞咕雞團圓飯開幕啦! 跟著八三夭、SpeXial、鼓鼓一起真心話大冒險~", 
			"startTime": "1484744400" //1484744400
		},
	];

	angular.forEach($scope.owlItems, function(data, index){
		data.imgSrc = 'http://img.youtube.com/vi/'+data.videoId+'/hqdefault.jpg';
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

	$scope.goto = function(id){
		$('#oc-slider').trigger('to.owl.carousel', [id, 0, true])
	}
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
			};
			$scope.posts.push(item);
		});
	}).then(function(){
		var index = 3;
		var ad = {
			type: 'ad',
			className: 'portfolio-item pf-media pf-icons',
		};
		var adPost = {
			type: 'post',
			className: 'portfolio-item pf-media pf-icons',
			title: '仙桃牌「通汝飲」帶動女性養身新風潮',
			imgSrc: 'http://attach.azureedge.net/newsimages/2017/01/14/778215-L.jpg',
			desc: '具有百年以上歷史的「仙桃牌」，遵循年輕化、國際化目標，於2016年12月領先全球，推出女性漢方保健聖品「通汝飲」，不僅完美傳承六代中醫精華，酸甜好喝的口感及20公克輕巧包裝，更是推翻社會對中藥飲品的想像。', 
			url: 'http://www.setn.com/News.aspx?NewsID=216287'
		};
		$scope.posts.splice(1, 0, adPost);
		$scope.posts.splice(index, 0, ad);
	});

	$scope.load = function(){
		$scope.showpost = $scope.posts.splice(0,6);
	}
}]);