define([], function () {
	return ['$scope', '$compile','$filter', '$timeout', '$window','$location','UserService',  'ApiOfServer','Ajax',
		function ($scope, $compile, $filter ,$timeout, $window, $location,User, Aos,Ajax) {
            var overviews = ["finance","apps","users","messages"];
            var _data ={
                "finance":null,
                "apps":[],
                "users":[],
                "messages":null,
                "count":{
                    "app":null,
                    "user":null,
                    "finance":null,
                    "message":null
                }
            };
            $scope.chart ={
                "optionsOfChart1":{
                    chart: {
                        type: 'pieChart',
                        height: 360,
                        x: function(d){return d.key;},
                        y: function(d){return d.y;},
                        showLabels: true,
                        valueFormat: function(d){
                            return "<b>"+d3.format('d')(d)+"</b>用户";
                        },                    
                        transitionDuration: 500,
                        labelThreshold: 0.01,
                        legend: {
                            margin: {
                                top: 5,
                                right: 35,
                                bottom: 5,
                                left: 0
                            }
                        }
                    }
                },
                "optionsOfChart2":{
                    chart: {
                        type: 'historicalBarChart',
                        height: 365,
                        margin : {
                            top: 80,
                            right: 20,
                            bottom: 60,
                            left: 120
                        },
                        x: function(d){ return d.key; },
                        y: function(d){ return d["1"].value; },
                        showValues: true,
                        valueFormat: function(d){
                            return d3.format(',.1f')(d);
                        },
                        transitionDuration: 500,
                        xAxis: {
                            axisLabel: 'X Axis',
                            tickFormat: function(d) {
                                return d3.time.format('%x')(new Date(d))
                            },
                            rotateLabels: 45,
                            showMaxMin: false
                        },
                        yAxis: {
                            axisLabel: '七日内流量趋势',
                            tickFormat: function(d){
                                console.log(d);
                                var array = ['','K','M','G','T','P'];
                                var i=0;
                                while (d > 1024)
                                {
                                    i++;
                                    d = d/1024;
                                }

                                d = d3.format('.02f')(d)+' '+array[i]+'B';
                                return d;
                            },
                            axisLabelDistance: 50
                        },
                        forceY:0,
                        tooltips: false,
                    }
                },
                "dataOfChart1":[],
                "dataOfChart2":[],    
            
            }
            var loadOverview = function(){
                if(overviews.length >0){
                    var _temp = overviews.pop();
                    Ajax
                        .GET(
                        Aos+'account/'+User.id+'/overview/'+_temp,
                        '',
                        function(data){
                            //console.log(data);
                            if("undefined" !== typeof(data)){
                                _data[_temp] = data;
                            }
                            loadOverview();
                        },
                        function(data, status, headers, config){
                            
                            
                        }
                    );
                }else{
                    _data.count.app = _data.apps.length;
                    _total = 0;
                    _temp = {};
                    for(var i in _data.users){
                        _total += _data.users[i].total;
                        _temp['app_index_'+_data.users[i].app_id] = _data.users[i].total;
                    }
                    _data.count.user = _total;
                    delete _data.users;
                    _data.users = _temp;
                    delete _temp;
                    _temp = [];
                    for(var i in _data.apps){
                        _temp.push({
                            key: _data.apps[i].app_name,
                            y: _data.users['app_index_'+_data.apps[i].id] || 0
                        });
                    }
                    $scope.chart.dataOfChart1 = _temp;
                    
                    
                    $scope.overview = _data;
                    return;
                }
            }
            loadOverview();
            Ajax.POST(
                Aos+'account/'+User.id+'/logs/apps',
                {
                    "start":1425139200000,//new Date().valueOf() - 604800000,
                    "end":new Date().valueOf(),
                    "interval":"5m",
                    "appid":0
                },
                function(data){
                    if(!data.timed_out){
                        $scope.chart.dataOfChart2 = [{
                            key: "流量趋势",
                            values: data.aggregations["2"].buckets,
                            color: '#ff7f0e'
                        }];
                    }else{
                        
                    }
                },
                function(data, status, headers, config){
                        console.log(status);
                }	
            );  
        $scope.$apply();
    }];
});