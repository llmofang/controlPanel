define(['angular', 'app'], function(angular, app) {
		'use strict';
		return app   
		.config(['$routeProvider','$locationProvider',  
		function($routeProvider,$locationProvider,$sceDelegateProvider) {
				//$locationProvider.html5Mode(true); 
				$locationProvider.html5mode = false;
				$locationProvider.hashPrefix = '!';            
				$routeProvider.
				when("/login",{
					templateUrl: "/partials/login.html",
					controller: 'LoginCtrl',
					publicAccess: true
				}). 
				when("/logout",{
					templateUrl: "/partials/logout.html",
					controller: 'LogoutCtrl',
					publicAccess: true
				}).                   
				when("/:ctrl", {
					templateUrl: "/partials/proxy.html",
					controller: 'ProxyCtrl',
					publicAccess:false
				}).
				when("/404", {
					templateUrl: "/partials/404.html",
					publicAccess:true
				}). 
				otherwise({
					redirectTo: '/login' 
				});
		}]).run(['$rootScope', '$location', 'UserService', function($rootScope, $location ,User) {
			// register listener to watch route changes
			$rootScope.$on("$routeChangeStart", function(event, next, current) {
					if(undefined === User.token && '' !== User.token){
						if ( !next.publicAccess ){
							$location.path( "/login" );
						}
					}else{
						if("/partials/login.html"===next.templateUrl){
							$location.path( "/overview" );  
						}   
					}
			});
		}]);

});