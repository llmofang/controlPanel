define(['moment'], function (moment) {
	return ['$scope', '$compile','$filter', '$timeout', '$window','$location','UserService',  'ApiOfServer','Ajax',
		function ($scope, $compile, $filter ,$timeout, $window,$location, User, Aos,Ajax) {   
        var chartTitle;    
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
        $scope.apps = [];      
        var getAppNameById = function(id){
            console.log($scope.apps);
            for(var i in  $scope.apps){
                if($scope.apps[i].id == id){
                    return $scope.apps[i].app_name;
                }
            }
        };    
        $scope.calenda = true;        
        $scope.optionsFilter= optionsFilter;  
        $scope.chartOptions = {
            chart: {
                type: 'lineWithFocusChart',
                height: 450,
                margin : {
                    top: 80,
                    right: 50,
                    bottom: 40,
                    left: 150
                },
                x: function(d){ return d.key; },
                y: function(d){ return d["1"].value; },
                noData:"暂无数据.",
                useInteractiveGuideline: true,
                "color": [
                  "#2ca02c",
                  "darkred"
                ],
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: '时间',
                    tickFormat: function(d) {
                        return d3.time.format('%Y/%m/%d')(new Date(d))
                    }, 
                },
                "x2Axis": {                    
                    tickFormat: function(d) {
                        return d3.time.format('%Y/%m/%d')(new Date(d));
                    },
                    //rotateLabels: 45,                    
                },
                yAxis: {
                    axisLabel: '流量',
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
                tooltips: true,
                tooltipContent:function (key, x, y, e, graph) {
                    "use strict";
                    console.log(e.point.key);
                    return '<h3>' + key + '</h3>' +
                    '<p>流量:<b>' +  y + '</b>' + 
                    ' 时间:'+d3.time.format('%Y/%m/%d %H:%M')(new Date(e.point.key)) + '</p>'
                },                  
                callback: function(chart){
                    //console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: false,
                text: ''
            },
            subtitle: {
                enable: false,
                text: '',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },          
            caption: {
                enable: true,
                html: '<b>注意:</b>图中的流量值相对用户真实使用的流量值<span style="color: darkred;">偏小</span>.具体计费流量以最终账单为准.',
                css: {
                    'text-align': 'justify',
                    'margin': '10px 13px 0px 7px'
                }
            }
        }    
        $scope.chartData = [];  
        $scope.getChart = function(i){
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
            Ajax.POST(
                _url,
                _data,
                function(data){
                    if(!data.timed_out){
                        $scope.chartData = [{
                            key: _key,
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
            
        }     
        
        
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