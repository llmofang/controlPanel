require.config({
	baseUrl: '/scripts',
	paths: {
		jquery : '/dist/jquery/jquery.min',
		angular: '/dist/angular/angular_zh-cn.min',
		d3:'/dist/d3/d3.min',
		nv:'/dist/nvd3/build/nv.d3.min',
        nvd3:'/dist/angular-nvd3/dist/angular-nvd3',
        moment:'/dist/moment/min/moment.min',
		angularAnimate: '/dist/angular-animate/angular-animate.min',
		angularResource: '/dist/angular-resource/angular-resource.min',
		angularRoute: '/dist/angular-route/angular-route.min',
        angularZeroclipboard: '/dist/angular-zeroclipboard/src/angular-zeroclipboard',
        angularDatePicker:'/dist/angular-datepicker/dist/index.min',
		lib: '/scripts/lib',
	},
	shim: {
		'angular': {
			exports: 'angular'
		},       
		'angularRoute': ['angular'],
		'angularAnimate': ['angular'],
		'angularResource': ['angular'],
        'angularZeroclipboard':['angular'],
        'angularDatePicker':['angular'],
		'd3' : {
			exports : 'd3'
		},         
		'nv' : {
			deps :['d3'],
			exports :  'nv'
		},  
		'nvd3' : {
			deps :['nv'],
			exports :  'nvd3'
		},
		'moment' : {
			exports : 'moment'
		}
	},
	priority: [
				"angular"
		]
});

window.name = "NG_DEFER_BOOTSTRAP!";

require([
		'angular',
		'app',
		'routes'
], function (angular, app, routes) {
	'use strict';
	var $html = angular.element(document.getElementsByTagName('html')[0]);
	angular.element().ready(function () {
		angular.resumeBootstrap(['app']);
	});
});