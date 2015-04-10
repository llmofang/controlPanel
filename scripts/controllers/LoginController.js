define([], function () {
	return ['$scope', '$compile', '$window' , '$location', '$http',  'UserService', 'ApiOfServer','Ajax',
		function($scope, $compile, $window , $location ,$http , User ,Aos ,Ajax ){
			$scope.notifyShow = false;
			$scope.notify_send = function (icon, text) {
				$scope.notifyShow = true;
				$scope.notifyIcon = icon;
				$scope.notifyContent = text;
			}
			$scope.loginDo = function(){
				Ajax.POST(
					Aos+'admin/login',
					{
						'username': $scope.username,
						'password': $scope.password,
						'rand': Math.random()
					},function(data){
                            console.log(data);
							User.id = data.id;
							User.username = $scope.username;
							User.token = data.token;
							$window.sessionStorage['com.llmf.admin.id'] = User.id;
							$window.sessionStorage['com.llmf.admin.username'] = User.username;
							$window.sessionStorage['com.llmf.admin.token'] = User.token;
							$location.path("/overview");
					},function(data, status, headers, config){
						 $scope.notify_send("batch-error", '抱歉 登录失败');
					}
				);
			}
			
			$scope.$apply();            
		  
		}];
});