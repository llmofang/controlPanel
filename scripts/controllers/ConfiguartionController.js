define([], function() {
	return ['$scope', '$compile', '$timeout', '$window','UserService', 'ApiOfServer','Ajax',
		function ($scope, $compile, $timeout, $window, User, Aos , Ajax) {
			$scope.Edit={
                'userId':null,
				'basic':{
                    'id':null,
					'name':  null,
					'phone': null,
					'company':null,
                    'address':null,
                    'title':null,
                    'website':null
				},
				'notification':{
					'enablephonenotify':false,
					'notify_phone':null,
					'enableemailnotify':false,
					'notify_email':null
				},
				'passwd':{
					'old':null,
					'new':null,
					'renew':null
				}
			};
            Ajax.GET(
                Aos+'admin/'+User.id,
                {},
                function(data){
                    $scope.Edit.notification = {
                        'enablephonenotify':null == data.notify_phone?false:true,
                        'notify_phone':data.notify_phone,
                        'enableemailnotify':null == data.notify_email?false:true,
                        'notify_email':data.notify_email
                    };
                    delete data.notify_phone;
                    delete data.notify_email;
                    $scope.Edit.basic = data;
                },
                function(data, status, headers, config){

                }
            );
            $scope.SaveBasic = function(){
                $scope.basicSubmiting = true;
                Ajax.PUT(
                     Aos+'admin/'+User.id,
                        $scope.Edit.basic,
                        function(data){
                            //console.log(data);
                            $scope.notify_send("","保存成功！");
                            $scope.basicSubmiting = false;
                        },
                        function(data, status, headers, config){
                            $scope.notify_send("","保存失败,稍后再试！");
                            $scope.basicSubmiting = false;
                        }
                );
            
            
            };
            $scope.SaveNotify = function(){
                $scope.notifySubmiting = true;
                Ajax.PUT(
                     Aos+'admin/'+User.id,
                        {
                            'id':$scope.Edit.basic.id,
                            'notify_phone':$scope.Edit.notification.notify_phone,
                            'notify_email':$scope.Edit.notification.notify_email
                        },
                        function(data){
                            //console.log(data);
                            $scope.notify_send("","保存成功！");
                            $scope.notifySubmiting = false;
                        },
                        function(data, status, headers, config){
                            $scope.notify_send("","保存失败,稍后再试！");
                            $scope.notifySubmiting = false;
                        }
                );
            };		
			$scope.SavePasswd = function(){
				$scope.passwdSubmiting = true;
				var _data= $scope.Edit.passwd;
				Ajax.POST(
					Aos+'user/resetPassword',
					_data,
					function(data){
						$scope.passwdSubmiting = false;
						$scope.notify_send("","恭喜，密码修改成功,请重新登录！");
						setTimeout(function(){
							$scope.logoutDo();
						},1000);	
					},
					function(data, status, headers, config){
						$scope.passwdSubmiting = false;
						if(403　=== status){
							$scope.notify_send("","对不起，旧密码不正确！");	
						}else if(406 === status){
							$scope.notify_send("","对不起，新密码长度过短！");
						}else{
							$scope.notify_send("","对不起，保存失败，请稍后再试！");
						};
					}
				);
			}
			$scope.$apply();

		}];
});