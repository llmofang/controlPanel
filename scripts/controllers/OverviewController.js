define(['nv'], function (nv) {
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
                    $scope.showChart1 = true;
                    nv.addGraph(function() {
                      var chart = nv.models.pieChart()
                        .x(function(d) { return d.key })
                        .y(function(d) { return d.y })
                        .showLabels(true)
                        .valueFormat(function(d){
                            return "<b>"+d3.format('d')(d)+"</b>用户";
                        })
                        .color(["#77B89C","#9DC1C3","#F05D60","#AC9CB6","#E8B891","#4D98A9","#3D6069"])
                        .donut(true)
                        .donutLabelsOutside(true)
                        .noData("暂无数据") 
                        d3.select("#chart1 svg")
                            .datum(_temp)
                            .transition().duration(600)
                            .call(chart);
                      return chart;
                    });
                    
                    //$scope.chart.dataOfChart1 = _temp;
                    
                    
                    $scope.overview = _data;
                    return;
                }
            }
            loadOverview();
            Ajax.POST(
                Aos+'account/'+User.id+'/logs/apps',
                {
                    "start":new Date().valueOf() - 86400000*30,
                    "end":new Date().valueOf(),
                    "interval":"1d",
                    "appid":0
                },
                function(data){
                    if(!data.timed_out){ 
                        $scope.showChart2 = true;
                        nv.addGraph(function() {
                            var chart =   nv.models.historicalBarChart()
                            .margin({top: 80, right: 40, bottom: 60, left: 120})
                            .x(function(d) { return d.key; })
                            .y(function(d) { return d["1"].value;})
                            .color(d3.scale.category10().range())
                            .useInteractiveGuideline(true)
                            .noData("暂无数据");
                            chart
                                .xAxis
                                .rotateLabels(45)
                                .tickFormat(function(d) {
                                    return d3.time.format('%x')(new Date(d))
                                });
                            chart
                                .yAxis
                                .axisLabel('三十日内流量趋势')
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
                            d3.select('#chart2 svg')
                                .datum([{
                                    key: "流量趋势",
                                    values: data.aggregations["2"].buckets,
                                    color: '#F5696C'
                                }])
                                .call(chart);
                            nv.utils.windowResize(chart.update);
                            return chart;
                        });
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