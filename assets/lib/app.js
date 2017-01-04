'use strict';
var app = angular.module('roosterApp', ['ngFacebook']);

app.config( function( $facebookProvider ) {
  $facebookProvider.setAppId('264733290612135').setPermissions(['email']);
}).run(['$rootScope', '$window', function($rootScope, $window) {
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/zh_TW/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
  $rootScope.$on('fb.load', function() {
    $window.dispatchEvent(new Event('fb.load'));
  });
}]);