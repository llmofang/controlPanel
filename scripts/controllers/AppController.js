define([], function () {
	return ['$scope', '$compile','$filter', '$timeout', '$window','$location','UserService',  'ApiOfServer','Ajax',
		function ($scope, $compile, $filter ,$timeout, $window, $location,User, Aos,Ajax) {	
            var changePanel= function(id,index){
                $scope.Editing ={
                    appid:id,
                    tabIndex:index
                };
            };
            var setFlow = function(obj){
                $scope.Edit.flow = {
                    'id':obj.id,
                    'newuserenable':obj.enable || true,
                    'newuseramout':obj.amount,
                    'newuservalidity':obj.duration
                }
            };
            var setWhitelist = function(obj){
                $scope.Edit.whitelist ={
                    'id':obj.id,
                    'enable':obj.enable || true,
                    'pattern':obj.ruler
                }
            };
            var changeUnit = function(v,u){
                var r;
                switch(u){
                    case 'KB':
                        r = v/1024;
                        break;
                    case 'MB':
                        r = v/1048576;
                        break;
                    default:
                        r = v;
                        break;
                }
                return r;
            };
            var indexMaping =["empty","empty","app","info","flow","whiteList"];
            var noicon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAyIiBoZWlnaHQ9IjQwMiIgdmlld0JveD0iMCAwIDQwMiA0MDIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiPjx0aXRsZT5lbXB0eS1hcHA8L3RpdGxlPjxnIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiIHN0cm9rZT0iIzAwMCIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTIwMSAyNi45OTRjOTUuNzgxIDAgMTczLjQzOCA3Ny43NzQgMTczLjQzOCAxNzMuNzAxIDAgOTUuOTI3LTc3LjY1NiAxNzMuNzAxLTE3My40MzggMTczLjcwMS05NS43ODEgMC0xNzMuNDM4LTc3Ljc3NC0xNzMuNDM4LTE3My43MDEgMC05NS45MjcgNzcuNjU2LTE3My43MDEgMTczLjQzOC0xNzMuNzAxem0wIDY2LjExNmM1OS4zMzYgMCAxMDcuNDIyIDQ4LjE1OSAxMDcuNDIyIDEwNy41ODUgMCA1OS40MjYtNDguMDg2IDEwNy41ODUtMTA3LjQyMiAxMDcuNTg1cy0xMDcuNDIyLTQ4LjE1OS0xMDcuNDIyLTEwNy41ODVjMC01OS40MjYgNDguMDg2LTEwNy41ODUgMTA3LjQyMi0xMDcuNTg1ek0xLjE5NS41ODdsMzk5LjYwOSA0MDAuMjE4TTEuMjY4IDQwMC43MzJsMzk5LjYwOS00MDAuMjE4Ii8+PGc+PHBhdGggZD0iTTEuMTk1IDEyNC42MDNoMzk5LjkxTTEuMTk1IDIwMC41aDM5OS45MU0xLjE5NSAyNzYuMzk2aDM5OS45MU0xLjE5NSAzNzQuNTkyaDM5OS45MU0xLjE5NSAyNi40MDdoMzk5LjkxIi8+PC9nPjxwYXRoIGQ9Ik0zNzUuMDkzLjY5NXYzOTkuOTFNMjc2Ljg5Ny42OTV2Mzk5LjkxTTIwMSAuNjk1djM5OS45MU0xMjUuMTA0LjY5NXYzOTkuOTFNMjYuOTA4LjY5NXYzOTkuOTEiLz48L2c+PC9zdmc+";
            var apps= [];
            var flow = [];
            var whitelist = [];            
            $scope.validity =[
                {id:1,value:86400*30,description:'一个月'},
                {id:2,value:86400*90,description:'三个月'},
                {id:3,value:86400*120,description:'一季度'}
            ],
            $scope.noicon = noicon;
			$scope.EditTemplate={
                empty:null,
                add:{
                    name:null,
                    submiting:false
                },
                app:{
                    id:null,
                    name:null,
                    intro:null,
                    icon:noicon,
                    submiting:false,
                },
                info:{
                    id:null,
                    key:null
                },
                flow:{
                    id:null,
                    appid:null,
                    newuseramout:0,
                    newuservalidity:null,
                    submiting:false,
                },
                whiteList:{
                    id:null,
                    appid:null,
                    pattern:null,
                    submiting:false,
                }
			}
            $scope.Editing = {
                appid:undefined,
                tabIndex:1
            };
            $scope.Edit ={
                app:null,
                flow:null,
                whitelist:null
            };
            Ajax.GET(
                Aos+'app',
                '',
                function(data){
                    apps = data;
                    $scope.apps = apps;
                },
				function(data, status, headers, config){
					
				}	
			);
            $scope.complete = function(e) {
                //console.log('copy complete', e);
                $scope.copied = true
                $scope.notify_send("",'内容复制成功!');
            };
            $scope.$watch('input', function(v) {
                $scope.copied = false
            });
            $scope.clipError = function(e) {
                //console.log('Error: ' + e.name + ' - ' + e.message);
                $scope.notify_send("",'内容复制失败，请手动复制!');
            };            
			$scope.$watch(
				"Editing",
				function( newValue, oldValue ) {
					if("undefined" !== typeof( newValue )){
                        if(undefined !== newValue.appid){
                            if(2 === newValue.tabIndex){
                                $scope.Edit.app = lib.findNeededFields(apps,"id",newValue.appid,{
                                    'id':'id',
                                    'name':'name',
                                    'intro':'intro',
                                    'icon':'icon'
                                });
                                
                            }else if(3 === newValue.tabIndex){
                                $scope.Edit.info = lib.findNeededFields(apps,"id",newValue.appid,{
                                    'appid':'id',
                                    'appkey':'key'
                                });
                            }else if(4 === newValue.tabIndex){
                                var temp;
                                temp = lib.findNeeded(flow,"appid",newValue.appid);
                                if( "undefined" === typeof(temp.id) ){
                                    Ajax.GET(
                                        Aos+'app/'+newValue.appid+'/flowruler',
                                        {},
                                        function(data){
                                            if(undefined === data){
                                                setFlow({
                                                    id:null,
                                                    enable:false,
                                                    amount:null,
                                                    duration:null,
                                                    create:null
                                                });
                                            }else{
                                                data.amount = changeUnit(data.amount,'MB');
                                                flow.push(data);
                                                setFlow(data);
                                            }
                                        },
                                        function(data, status, headers, config){
                                            
                                        }	
                                    );
                                }else{
                                    setFlow(temp);
                                }
                            }else if(5 === newValue.tabIndex){
                                var temp;
                                temp = lib.findNeeded(whitelist,"id",newValue.appid);
                                if( "undefined" === typeof(temp.id) ){
                                    Ajax.GET(
                                        Aos+'app/'+newValue.appid+'/whitelist',
                                        {appid:newValue.appid},
                                        function(data){
                                            if(undefined === data){
                                                setWhitelist({
                                                    id:null,
                                                    appid:null,
                                                    rule:null,
                                                    create:null
                                                });
                                            }
                                            whitelist.push(data);
                                            setWhitelist(data);
                                        },
                                        function(data, status, headers, config){
                                            
                                        }	
                                    );
                                }else{
                                    setWhitelist(temp);
                                }
                            }else{
                            
                            }
                        }else{
                            $scope.Edit[indexMaping[newValue.tabIndex]] = angular.copy($scope.EditTemplate[indexMaping[newValue.tabIndex]]);
                        }
					}
				},
				true 
			);   
            $scope.addNewApp = function(){
                $scope.Edit.add.submiting = true;
                Ajax.POST(
                    Aos+'app',
                    {name:$scope.Edit.add.name},
                    function(data){
                        console.log(data);
                         $scope.Edit.add.submiting = false;
                    },
                    function(data, status, headers, config){
                        if(409 === status){
                            $scope.notify_send('','应用名已经存在！');
                            $scope.Edit.add.submiting = false;
                        };
                    }	
                );
            };
			$scope.configApp = function(id){
                changePanel(id,2);
            };
            $scope.configFlow = function(id){
                changePanel(id,3);
            };
            $scope.configWhitelist = function(id){
                changePanel(id,4);
            };
            $scope.downloadSdk = function(id){
            
            };
            $scope.removeApp = function(id,name){
                $scope.confirm_show('confrm-waring-icon batch-waring','确定要删除 '+name+' 吗？',function(){
                
                
                });
            };
            $scope.modifyApp = function(){
                if("undefined" === typeof($scope.Editing.appid)){
                    $scope.notify_send('','请选择一个应用！');
                    return;
                }
                $scope.Edit.app.submiting = true;
                Ajax.PUT(
                    Aos+'app/'+$scope.Edit.app.id,
                    $scope.Edit.app,
                    function(data){
                        apps = lib.replaceFields(apps,"id",$scope.Edit.app.id,{
                            'name':$scope.Edit.app.name,
                            'intro':$scope.Edit.app.intro,
                            'icon':$scope.Edit.app.icon
                        });
                        $scope.Edit.app.submiting = false;
                        $scope.notify_send('','保存成功！');
                    },
                    function(data, status, headers, config){
                        $scope.Edit.app.submiting = false;
                        $scope.notify_send('','保存失败，请稍后再试！');
                    }
                );
            };
            $scope.modifyFlow = function(){
                if("undefined" === typeof($scope.Editing.appid)){
                    $scope.notify_send('','请选择一个应用！');
                    return;
                }
                $scope.Edit.flow.submiting = true;
                if(null === $scope.Edit.flow.id){
                    Ajax.POST(
                        Aos +'app/'+$scope.Editing.appid+'/flowruler',
                        $scope.Edit.flow,
                        function(data){
                             $scope.Edit.flow.id = data.id;
                             data.amount =changeUnit(data.amount,'MB')
                             flow.push(data);
                             $scope.Edit.flow.submiting = false;
                             $scope.notify_send('','保存成功！');
                        },
                        function(data, status, headers, config){
                             $scope.Edit.flow.submiting = false;
                             $scope.notify_send('','保存失败，请稍后再试！');
                        }                        
                    );
                }else{
                    if(!$scope.Edit.flow.newuserenable){
                        Ajax.DELETE(
                            Aos +'app/'+$scope.Editing.appid+'/flowruler/'+$scope.Edit.flow.id,
                            $scope.Edit.flow,
                            function(data){
                                flow = lib.removeElement(flow,"id",$scope.Edit.flow.id);
                                setFlow({
                                    id:null,
                                    enable:false,
                                    amount:null,
                                    duration:null,
                                    create:null
                                });
                                $scope.Edit.flow.submiting = false;
                                $scope.notify_send('','保存成功！');
                            },
                            function(data, status, headers, config){
                                $scope.Edit.flow.submiting = false;
                                $scope.notify_send('','保存失败，请稍后再试！');
                            }  
                        );
                    }else{
                        Ajax.PUT(
                            Aos +'app/'+$scope.Editing.appid+'/flowruler/'+$scope.Edit.flow.id,
                            $scope.Edit.flow,
                            function(data){
                                flow = lib.replaceFields(flow,"id",$scope.Edit.flow.id,{
                                    'amount':$scope.Edit.flow.newuseramout,
                                    'duration':$scope.Edit.flow.newuservalidity
                                });
                                $scope.Edit.flow.submiting = false;
                                $scope.notify_send('','保存成功！');
                            },
                            function(data, status, headers, config){
                                $scope.Edit.flow.submiting = false;
                                $scope.notify_send('','保存失败，请稍后再试！');
                            }                        
                        );
                    }
                }           
            };
            
            
            $scope.modifyWhitelist = function(){
                if("undefined" === typeof($scope.Editing.appid)){
                    $scope.notify_send('','请选择一个应用！');
                    return;
                }
                $scope.Edit.whitelist.submiting = true;
                if(null === $scope.Edit.whitelist.id){
                    Ajax.POST(
                        Aos +'app/'+$scope.Editing.appid+'/whitelist',
                        $scope.Edit.whitelist,
                        function(data){
                             $scope.Edit.whitelist.id = data.id;
                             flow.push(data);
                             $scope.Edit.whitelist.submiting = false;
                             $scope.notify_send('','保存成功！');
                        },
                        function(data, status, headers, config){
                             $scope.Edit.whitelist.submiting = false;
                             $scope.notify_send('','保存失败，请稍后再试！');
                        }                        
                    );
                }else{
                    if(!$scope.Edit.whitelist.enable){
                        Ajax.DELETE(
                            Aos +'app/'+$scope.Editing.appid+'/whitelist/'+$scope.Edit.whitelist.id,
                            $scope.Edit.whitelist,
                            function(data){
                                whitelist = lib.removeElement(whitelist,"id",$scope.Edit.whitelist.id);
                                setFlow({
                                    id:null,
                                    enable:false,
                                    pattern:null,
                                    create:null
                                });
                                $scope.Edit.whitelist.submiting = false;
                                $scope.notify_send('','保存成功！');
                            },
                            function(data, status, headers, config){
                                $scope.Edit.whitelist.submiting = false;
                                $scope.notify_send('','保存失败，请稍后再试！');
                            }  
                        );
                    }else{
                        Ajax.PUT(
                            Aos +'app/'+$scope.Editing.appid+'/whitelist/'+$scope.Edit.whitelist.id,
                            $scope.Edit.whitelist,
                            function(data){
                                console.log(whitelist);
                                whitelist = lib.replaceFields(whitelist,"id",$scope.Edit.whitelist.id,{
                                    'ruler':$scope.Edit.whitelist.pattern
                                });
                                console.log(whitelist);
                                $scope.Edit.whitelist.submiting = false;
                                $scope.notify_send('','保存成功！');
                            },
                            function(data, status, headers, config){
                                $scope.Edit.whitelist.submiting = false;
                                $scope.notify_send('','保存失败，请稍后再试！');
                            }                        
                        );
                    }
                }           
            };
            
            
            
            
		
			$scope.changeStatusProcessing =  function(index){
				if($scope.pagedItems[$scope.currentPage][index].csp){
					return true;
				}
				return false;
			}						
			$scope.remove
			$scope.$apply();
		}];
});