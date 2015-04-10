define(['angular'], function (angular) {
        'use strict';       
  /* Services */
    angular.module('app.services', [])
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
         })          
        .constant('ApiOfServer',(function(){  
            return 'http://127.0.0.1:4399/a/';
        })())
        .value('version', '1.0')
        .factory('authInterceptor', function ($rootScope, $q, $window,$location) {
                return {
                    request: function (config) {
                        config.headers = config.headers || {};
                        if ($window.sessionStorage['com.llmf.admin.token']) {
                            config.headers={
                                'Authorization': 'Bearer ' + $window.sessionStorage['com.llmf.admin.token'],
                                'Cache-Control': 'no-store'
                            }  
                            //config.headers.Cache-Control = 'no-store';
                            //config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                        };
                        if("PUT"===config.method || "POST" == config.method ){
                                        config.headers['Content-Type'] =  'application/json';
                        }
                        return config;
                    },
                    response: function (response ) {
                        return response || $q.when(response);
                    },
                    'responseError': function(rejection) {
                        // do something on error
                        if(0 === rejection.status){
                           // $location.url( "/error?reason=lostconnect" );
                        }else if(401 === rejection.status){
                            $location.url( "/logout" );
                        }
                        return  $q.reject(rejection);
                    }                    
                };
        })
        .service('UserService', ['$window',function ($window) {   
              var sdo = {
                        id:(''===$window.sessionStorage['com.llmf.admin.id']?'':$window.sessionStorage['com.llmf.admin.id']),
                        username:(''===$window.sessionStorage['com.llmf.admin.username']?'':$window.sessionStorage['com.llmf.admin.username']),
                        token:(''===$window.sessionStorage['com.llmf.admin.token']?'':$window.sessionStorage['com.llmf.admin.token'])
              };
              return sdo;       
        }])
        .factory('Ajax', ['$http','$timeout', function($http,$timeout){
            return{
                main : function(url ,  method,  params, data, cbs,cbe){
                    $http({ url:url ,params: params ,data :JSON.stringify(data) , method: method })
                        .success(function(data) {
                                cbs(data.data);
                        })
                        .error(function(data, status, headers, config){
                            cbe(data, status, headers, config);
                        });    
                },
                GET  : function(url , params,callback_success,callback_error){
                    this.main(url , 'GET', params ,null, callback_success,callback_error);
                },
                POST : function(url , data, callback_success,callback_error){
                    this.main(url , 'POST',null,  data ,callback_success,callback_error);
                },
                PUT  : function(url , data, callback_success,callback_error){
                    this.main(url , 'PUT', null , data ,callback_success,callback_error);
                },
                DELETE :function(url , params,callback_success,callback_error){
                    this.main(url , 'DELETE', null , null,callback_success,callback_error);  
                }
            };
         }]);
});
