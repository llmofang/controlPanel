define(['moment','nv'], function (moment,nv) {
	return ['$scope', '$compile','$filter', '$timeout', '$window','$location','UserService',  'ApiOfServer','Ajax',
		function ($scope, $compile, $filter ,$timeout, $window,$location, User, Aos,Ajax) {   
        var chartTitle;
        var chart = null;    
        var optionsFilter=[
            {id:"id",option:'用户ID',placeholder:'填写用户ID',pattern:'^\d+$'},
            {id:"phone",option:'用户手机号',placeholder:'填写用户手机号',pattern:'.*'},
            {id:"imei",option:'用户手机IMEI',placeholder:'用户手机IMEI',pattern:'.*'}
        ];     
        var timeToStamp = function(date,end) {
            if(end){
                var _now = new Date().valueOf();
                var _end = date.valueOf() + 86400000;
                if(_end > _now){
                    return _now;
                }else{
                    return _end;
                }
            }else{
                return date.valueOf();
            }
        }; 
        var setDataInterval = function(start,end){
            return "5m";
            var _temp = end - start;
            if(43200000 >= _temp){
                return "5m";
            }else if(86400000 >= _temp){
                return "10m";
            }else if(86400000*30 > _temp){
                return "12h"; 
            }else if(86400000*90 > _temp){
                return "1d"; 
            }else{
                return "1w"; 
            }
        }; 
        var updateChart = function(data){
            $scope.showChart = true;
            nv.addGraph(function() {
                if("function" !== typeof(chart)){
                    chart =   nv.models.lineChart()
                    .margin({top: 80, right: -10, bottom: 100, left: 120})
                    .x(function(d) { return d.key; })
                    .y(function(d) { return d["1"].value;})
                    .color(d3.scale.category10().range())
                    .useInteractiveGuideline(true)
                    .noData("暂无数据")
                    .useVoronoi(false);
                    chart
                        .xAxis
                        .rotateLabels(45)
                        .tickFormat(function(d) {
                            return d3.time.format('%Y/%m/%d %H:%M')(new Date(d))
                        });
                    chart
                        .forceY(0)
                        .yAxis
                        .axisLabel('流量')
                        .axisLabelDistance(50)
                        .tickFormat(function(d){
                            var array = ['','K','M','G','T','P'];
                            var i=0;
                            while (d > 1024)
                            {
                                i++;
                                d = d/1024;
                            }

                            d = d3.format('.02f')(d)+' '+array[i]+'B';
                            return d;                    

                        });
                
                } 
                var ev = ["mousemove","mouseout","click","dblclick"];
                var svg = d3.select('#chart svg');
                svg.selectAll("*").remove();
                svg
                .each(function(){
                    var that = this;
                    for(var i in ev){
                        console.log(ev[i]);
                        d3.select('svg').on(ev[i], null);
                        d3.select(that).on(ev[i],function() {
                            d3.event.stopPropagation(); 
                        });
                    }
                });
                svg
                    .datum(data)
                    .call(chart);
                nv.utils.windowResize(chart.update);
                return chart;
            });
        }; 
        var getChart = function(i){
            $scope.querySubmiting = true;
            if("undefined" === typeof($scope.start) || "undefined" === typeof($scope.end) ){
                $scope.notify_send('','请选择报表时间范围！');
                return false;
            }
            var _key = "";
            var _url;
            var _data ={
                start:timeToStamp($scope.start,false),
                end:timeToStamp($scope.end,true)
            }
            _data.interval = setDataInterval(_data.start,_data.end);
            switch(i){
                case 1:
                    _url = Aos+'account/'+User.id+'/logs/users',
                    _data.appid = $scope.appid || 0;
                    _data.field = $scope.optid;
                    _data.value = $scope.optval;
                    _data.random = Math.random();
                    _key =  $scope.appid?getAppNameById($scope.appid):"所有 APP";
                break;
                case 2:
                    _url = Aos+'account/'+User.id+'/logs/apps',
                    _data.appid = $scope.appid2 || 0; 
                    _key = $scope.appid2?getAppNameById($scope.appid2):"所有 APP";
                break; 
                default:
                
                break;        
            }
            $scope.showChart = false;
            Ajax.POST(
                _url,
                _data,
                function(data){
                    if(!data.timed_out){
                        $scope.querySubmiting = false;   
                        updateChart([{
                            key: _key,
                            values: data.aggregations["2"].buckets,
                            color: '#ff7f0e'
                        }]);
                    }else{
                            $scope.notify_send("","查询超时,请稍后刷新页面重试！");
                            $scope.querySubmiting = false; 
                    }
                },
                function(data, status, headers, config){
                    $scope.querySubmiting = false;   
                    if(404 === status){
                            updateChart([{
                            key: _key,
                            values: [],
                            color: '#ff7f0e'
                        }]);                  
                    }
                }	
            );
            
        };    
        $scope.apps = [];      
        var getAppNameById = function(id){
            console.log($scope.apps);
            for(var i in  $scope.apps){
                if($scope.apps[i].id == id){
                    return $scope.apps[i].app_name;
                }
            }
        };    
        $scope.calenda = false;        
        $scope.optionsFilter= optionsFilter; 
        $scope.start = moment().subtract(6, 'days').toDate();
        $scope.end =  moment().toDate();   
        $scope.getChart =  getChart;////////// 
        getChart(2);
        Ajax
            .GET(
            Aos+'account/'+User.id+'/overview/apps',
            '',
            function(data){
                console.log(data);
                if("undefined" !== typeof(data)){
                        $scope.apps = data;
                }
            },
            function(data, status, headers, config){


            }
        ); 
        $scope.$watch(
				"optid",
				function( newValue, oldValue ) {
                    if("undefined"!==typeof(newValue)){
                        for(var i in optionsFilter){
                            if(newValue === optionsFilter[i].id){
                                $scope.placeholder = optionsFilter[i].placeholder;
                                //$scope.pattern = optionsFilter[i].pattern;
                                break;
                            }
                        }
                    }else{
                         $scope.placeholder = "";
                    };
                },
				true 
        );       
            $scope.$apply();
        }
    ];
});