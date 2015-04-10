define(['jquery','angular','services', 'lib'], function ($,angular,io) {
	'use strict';
	/* Controllers */
	return angular.module('app.controllers', [])
		.controller('LoginCtrl', ['$scope', '$injector',
			function ($scope, $injector) {
				require(['controllers/LoginController'], function (LoginController) {
					$injector.invoke(LoginController, this, {
						'$scope': $scope
					});
				});
			}]) 
		    .controller('LogoutCtrl', ['$scope','$window','$location','$timeout','UserService',
			function ($scope,$window,$location,$timeout,User) {
                delete User.id;
                delete User.token;
                delete User.username;
                delete $window.sessionStorage['com.llmf.admin.id'] ;
                delete $window.sessionStorage['com.llmf.admin.username'] ;
                delete $window.sessionStorage['com.llmf.admin.token'];
                $timeout(function(){
                     $location.path('/login');  
                },3000);
			}])        
			.controller('OverviewCtrl', ['$scope', '$injector',
			function ($scope, $injector) {
				require(['controllers/OverviewController'], function (OverviewController) {
					$injector.invoke(OverviewController, this, {
						'$scope': $scope
					});
				});
			}])
			.controller('ReportCtrl', ['$scope', '$injector',
			function ($scope, $injector) {
				require(['controllers/ReportController'], function (ReportController) {
					$injector.invoke(ReportController, this, {
						'$scope': $scope
					});
				});
			}]) 			
			.controller('AppCtrl', ['$scope', '$injector',
			function ($scope, $injector) {
				require(['controllers/AppController'], function (ShopController) {
					$injector.invoke(ShopController, this, {
						'$scope': $scope
					});
				});
			}]) 
			.controller('ConfiguartionCtrl', ['$scope', '$injector',
			function ($scope, $injector) {
				require(['controllers/ConfiguartionController'], function (ConfiguartionController) {
					$injector.invoke(ConfiguartionController, this, {
						'$scope': $scope
					});
				});
			}])                      
			.controller('PropertyCtrl', ['$scope', '$injector',
			function ($scope, $injector) {
				require(['controllers/PropertyController'], function (PropertyController) {
					$injector.invoke(PropertyController, this, {
						'$scope': $scope
					});
				});
			}])    
			.controller('ProxyCtrl', ['$scope','$http', '$routeParams', '$injector', '$window', '$location' , 'version', 'UserService' , 'ApiOfServer' ,'Ajax',
			function ($scope, $http, $routeParams, $injector, $window , $location , version , User , Aos,Ajax) {
				$scope.logouting =false;
				$scope.search = $location.search();
				$scope.username = User.username;
				$scope.token = User.token;
				$scope.version = version;
				$scope.narrow = 0;
				$scope.newordernum = 0;
				$scope.neworders = null;
				$scope.logoutDo = function(){
					if($scope.logouting){
						return  false;
					}
					$scope.logouting =true;
					Ajax.POST(
						Aos+'admin/logout',
						{},
						function(data){
							delete User.id;
							delete User.token;
							delete User.username;
							delete $window.sessionStorage['com.llmf.admin.id'] ;
							delete $window.sessionStorage['com.llmf.admin.username'] ;
							delete $window.sessionStorage['com.llmf.admin.token'];
							$location.path('/login'); 
						}
						,function(data, status, headers, config){
							$scope.logouting =false;
						}
					);													
				}  
				$scope.notifyShow = false;
				$scope.confirmShow = false;
				$scope.notify_send = function (icon, text) {
					$scope.notifyShow = true;
					$scope.notifyIcon = icon;
					$scope.notifyContent = text;
				} 
				$scope.confirm_show = function(icon,text,fn){
					$scope.confirmIcon =icon;
					$scope.confirmContent = text;
					$scope.notifyConfirm = fn;
					$scope.confirmShow = true;
				}
				$scope.confirm_hide = function(){
					$scope.confirmShow = false;
				}
				/******************* 通用文件上传　**********************/
				$scope.upload=function(length,type,file,callback){
					if(undefined === file){
						return;
					} 
					var tMap ={
						'jpg':'image/jpeg',
						'png':'image/png',
						'gif':'image/gif'
					}
					var rfString ="";
					for(var i in type){
						rfString += tMap[type[i]]+'|';
					}
					var rFilter = new RegExp("("+rfString.substring(0,rfString.length-1)+")");
					//var rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
					var mFilter =/^(.*),(.*)/i;
					var m=file.match(mFilter);
					var fType   =  m[1].replace("data:","").replace(";base64","");
					var base64File = m[2];
					var fLength =  atob(base64File).length;
					if(!rFilter.test(fType)){
						$scope.notify_send('','文件格式不符合要求！');
						return;
					}
					if(fLength > length){                  
						$scope.notify_send('','文件大小不符合要求！');
						return;
					}
					for(var i in tMap){
						if(fType === tMap[i]){
							fType = i;
							continue;
						}
					}
					$http({
						method: 'POST',
						url: Aos+'files/upload',
						data: {
							'fileData':base64File,
							'type':fType,
							'rand': Math.random()
						}
					})
					.success(function (data, status, headers, config) {
						if (200 === status) {
							$scope.notify_send('','文件上传成功！');
							callback(data.data);
						} else{
							$scope.notify_send('','文件上传失败！');
						}
					})
					.error(function (data, status, headers, config) {
						$scope.notify_send('','文件上传失败！');
					});
				};
				$scope.notifyConfirm = function(){

				} 
				$scope.uploadPath = function(p,d){
					$scope[p] =d;
				};
				$scope.fileProgress = function(p,d){
					var temp =('file_ipload_progress_'+p).toString();
					$scope[temp] = d;
				}
				//$scope.templateUrl="/partials/playground.html";
				var Ctrls = ['overview','report', 'configation', 'app', 'bill', 'message'];
				if (lib.inArray($routeParams.ctrl, Ctrls)) {
					$scope.currentCtrl = $routeParams.ctrl;
					$scope.templateUrl = "/partials/" + $routeParams.ctrl + ".html";
				} else {


				}	
			}]);
});