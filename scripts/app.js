define([
        'angular',
        'filters',
        'services',
        'directives',
        'controllers',
        'angularRoute',
        'angularZeroclipboard',
        'angularDatePicker',
       // 'nvd3'
        ], function (angular, filters, services, directives, controllers) {
                'use strict';
                // Declare app level module which depends on filters, and services
                return angular.module('app', [
                        'ngRoute',
                        'app.controllers',
                        'app.filters',
                        'app.services',
                        'app.directives',
                        'zeroclipboard',
                        'datePicker',
                       // 'nvd3'
                ]).config(['uiZeroclipConfigProvider', function(uiZeroclipConfigProvider) {
                    // config ZeroClipboard
                    uiZeroclipConfigProvider.setZcConf({
                      swfPath: '/dist/zeroclipboard/dist/ZeroClipboard.swf'
                    });
                }]);
});