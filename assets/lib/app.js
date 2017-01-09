'use strict';
var app = angular.module('roosterApp', [
  'ngFacebook', 
  'ngDfp', 
  // 'angular-owl-carousel', 
  // 'angular-owl-carousel-directive'
]).constant('config', {
  'baseUri': 'http://event.setn.com/oceankingdom/',
  'apiUri': 'http://event.setn.com/webEventBackend/ajax/space/',
  'spaceId': '92',
  'listId': '235',
}).config( function( $facebookProvider ) {
  $facebookProvider.setAppId('290937077764531').setPermissions(['email']);
  //event: 290937077764531 ,fanpage: 1385360291698338, self: 264733290612135
}).config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]).config(function (DoubleClickProvider) {
  DoubleClickProvider.defineSlot('/18689016/setn_event_2017chinesenewyear_728x90', [728, 90], 'ad-728x90')
                     .defineSlot('/18689016/setn_event_2017chinesenewyear_300x250', [300, 250], 'ad-300x250')
                     .defineSlot('/18689016/setn_event_2017chinesenewyear_300x600', [300, 600], 'ad-300x600')
                     .defineSlot('/18689016/setn_event_2017chinesenewyear_m_300x250', [300, 250], 'ad-m-300x250')
                     .defineSlot('/18689016/setn_event_2017chinesenewyear_m_300x600', [300, 600], 'ad-m-300x600')
                     .defineSlot('/18689016/setn_event_2017chinesenewyear_m_300x50', [300, 50], 'ad-m-300x50')
                     .defineSlot('/18689016/setn_event_202x362_01', [200, 200], 'dfp-default-0')
                     ;
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
}])
.controller('MyController', MyController);

function MyController() {
    this.owl = {
        items: ["item 1", "item 2"],
        options: {
            loop: true,
            nav: false
        }
    };
}