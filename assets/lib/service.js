'use strict';

app.factory('roosterService', ['$http', function($http){
  var apiGateWay = {
      setn: 'https://m908qvobqd.execute-api.ap-northeast-1.amazonaws.com/prod/setn',
  };
  var endpoint = {
    projectNews: apiGateWay.setn + '/projectnewslist',
    getNewsContent: apiGateWay.setn + '/getnewscontent',
  };
  return {
    projectnews: function(){
      var projectId = 2856;
      var requestUrl = endpoint.projectNews + '/' + projectId ;
      return $http.get(requestUrl);
    },
    getnewscontent: function(){
      var newsId = 216287;
      var requestUrl = endpoint.getNewsContent + '/' + newsId ;
      return $http.get(requestUrl);
    },
  };
}]);

app.factory('lottery', function(config, $http, $httpParamSerializer) {
  return {
    getalloption: function() {
      return $http.get(config.apiUri + 'getalloption/' + config.spaceId, {});
    },
    getVoteObject: function(userData){
      var userData = typeof userData !== 'object' ? { type: '', userId: ''} : userData;
      var request = {
        method: 'POST',
        url: config.apiUri + 'getalloption/' + config.spaceId,
        data: decodeURIComponent($.param(userData)),
        withCredentials: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      };
      return $http(request);
    },
    postVote: function(userData){

      var vote = {
        voteListId : '235',
        fileName : "da3fc241d11c79e42cab.jpeg",
        userId : userData,
        spaceId : '92',
        // validateKey: validateKey,
        at : userData.auth.access_token
      };
      var request = {
        method: 'POST',
        url: config.apiUri + 'vote',
        data: decodeURIComponent($.param(vote)),
        withCredentials: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      };
      // console.log(vote , request);
      return $http(request);
    },
  };
});

app.service('Facebook', ['$http', '$location', function ($http, $location) {
  var settings = {
    permission: ['public_profile', 'email']
  };
  var response = {
    finish: function(){
      window.alert('Facebook login OK.');
    },
    fail: function(){
      window.alert('Facebook login Fail.');
    }
  };
  var functions = {
    login: function(callback, failback){
      var calls = functions.defineCallback(callback, failback);
      FB.login(function(response){
        if (response.status === 'connected') {
          // Logged into your app and Facebook.../../styles-bak
          console.log('FB connected');
          var permission = functions.checkPermission(calls.finish, calls.fail);
        }
        else if (response.status === 'not_authorized') {
          // The person is logged into Facebook, but not your app.
          calls.fail();
        }
        else {
          // The person is not logged into Facebook, so we're not sure if
          // they are logged into this app or not.
          calls.fail();
        }
      }, {
        scope: settings.permission.join(", "),
        'redirect_uri': $location.absUrl()
      });
    },
    reRequest: function(callback, failback){
      var calls = functions.defineCallback(callback, failback);
      var uri = encodeURI(window.location.href);

      FB.login(function(response){
          if (response.status === 'connected') {
          var permission = functions.checkPermission(calls.finish, calls.fail);
        }
        else if (response.status === 'not_authorized') {
          calls.fail();
        }
        else {
          calls.fail();
        }
      }, {
        auth_type: 'rerequest',
        scope: settings.permission.join(", "),
        'redirect_uri': $location.absUrl()
      });

    },
    checkLoginState: function(callback, failback, requestLogin){
      if(typeof requestLogin === 'undefined'){
        var requestLogin = true;
      }
      var calls = functions.defineCallback(callback, failback);
        //console.log(calls);
      FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          // Logged into your app and Facebook.../../styles-bak
          console.log('FB connected');
          var checkResult = functions.checkPermission();
          if(checkResult){

          }
          else{
            //console.log('permission not enough');
            if(requestLogin){
              functions.reRequest(calls.finish, calls.fail);
            }
            else{
              calls.finish();
            }
          }
        }
        else if (response.status === 'not_authorized') {
          // The person is logged into Facebook, but not your app.
          console.log('FB not_authorized');
          if(requestLogin){
            functions.login(calls.finish, calls.fail);
          }
          else{
            calls.fail();
          }
        }
        else {
          // The person is not logged into Facebook, so we're not sure if
          // they are logged into this app or not.
          console.log('FB not login');
          if(requestLogin){
            functions.login(calls.finish, calls.fail);
          }
          else{
            calls.fail();
          }
        }
      });
    },
    checkPermission: function(callback, failback){
      FB.api('/me/permissions', function(response) {
        var pass = true;
        angular.forEach(settings.permission, function(needPermission, needId){
          var notFound = true;
          angular.forEach(response.data, function(nowPermission, nowId){
            if(needPermission == nowPermission.permission && nowPermission.status == 'granted'){
              notFound = false;
            }
          });

          if(notFound){
            pass = false;
          }
        });

        if(pass){
          //console.log('pass');
          if(typeof callback ==='function'){
            callback();
          }
          else{
            return pass;
          }
        }
        else{
          //console.log('not pass');
          if(typeof failback ==='function'){
            failback();
          }
          return pass;
        }
      });
    },
    doSomething: function(){
      //console.log('all pass');
    },
    defineCallback: function(callback , failback){
      if(typeof callback === 'function'){
        response.finish = callback;
      }
      if(typeof failback === 'function'){
        response.fail = failback;
      }
      return response;
    },
    getAuthResponse: function(){
      return FB.getAuthResponse();
    }
  };

  return functions;
}]);