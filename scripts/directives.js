define(['angular', 'services'], function(angular, services) {
		'use strict';
  /* Directives */
		angular.module('app.directives', ['app.services'])
			.directive('appVersion', ['version', function(version) {
						return function(scope, element, attrs) {
								element.text(version);
				};
		}]).directive('resize', function () {
			return function (scope, element,attrs) {
				var w = $(window);
					
				var heightPerfix=attrs.perfix || 0;
	  
				scope.getWindowDimensions = function () {
					return w.height();
				};
				scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
					scope.windowHeight = newValue;
				  
					scope.style = function (t) {
						return { 
							'min-height': (newValue - heightPerfix)  + 'px'
						};
					};
					
					scope.fixheight =function(t){
						 return { 
							'min-height': ( newValue +20 ) +'px'
						};                   
					}
					
				}, true);

				w.bind('resize', function () {
					scope.$apply();
				});
			};
		}).directive('autoFillSync', function($timeout) {
			return {
			   require: 'ngModel',
			   link: function(scope, elem, attrs, ngModel) {
				   var origVal = elem.val();
				   $timeout(function () {
					   var newVal = elem.val();
					   if(ngModel.$pristine && origVal !== newVal) {
						   ngModel.$setViewValue(newVal);
					   }
				   }, 500);
			   }
			};
		 }).directive('uiSwitch', function($window, $timeout, $log, $parse) {
			function linkSwitchery(scope, elem, attrs, ngModel) {
				if(!ngModel) return false;
				var options = {};
				try {
						options = $parse(attrs.uiSwitch)(scope);
				}
				catch (e) {}
				var switcher;
				var previousDisabledValue;
				// Watch for attribute changes to recreate the switch if the 'disabled' attribute changes
				attrs.$observe('disabled', function(value) {
					if (value == undefined || value == previousDisabledValue) {
						return;
					} else {
						previousDisabledValue = value;
					}
					initializeSwitch();
				});

				function initializeSwitch() {
					$timeout(function() {
						// Remove any old switcher
						if (switcher) {
							angular.element(switcher.switcher).remove();
						}
						// (re)create switcher to reflect latest state of the checkbox element
						switcher = new $window.Switchery(elem[0], options);
						var element = switcher.element;
						element.checked = scope.initValue;
						switcher.setPosition(false);
						element.addEventListener('change',function(evt) {
							scope.$apply(function() {
								ngModel.$setViewValue(element.checked);
							})
						})
					},0);
				}
				scope.$watch('initValue',function(){
					initializeSwitch();
				})
			}
			return {
				require: 'ngModel',
				restrict: 'EA',
				scope : {initValue : '=ngModel'},
				link: linkSwitchery
			}
		 }).directive("fileread", [function () {
			return {    
				scope: {
					fileuploader:   "=",
					filelength:     "=",
					filetypeallow:  "=",
					fileres:        "=",
					filefn:         "=",
					fileprogress:   "="
				},
				link: function (scope, element, attributes) {
					element.bind("change", function (changeEvent) {
						scope.fileprogress(scope.fileres,true);
						var reader = new FileReader();
						reader.onload = function (loadEvent) {
							scope.$apply(function () {
								scope.fileuploader(scope.filelength,scope.filetypeallow,loadEvent.target.result,function(data){
									scope.filefn(scope.fileres,data);
									scope.fileprogress(scope.fileres,false);
								});
							});
						}
						reader.readAsDataURL(changeEvent.target.files[0]);
						//reader.readAsDataURL(changeEvent.target.files[0]);
						//reader.readAsBinaryString(changeEvent.target.files[0]).length();
					});
				}    
			}
		}]).directive('notify',['$timeout',function($timeout){
			return {
				restrict  : 'EA',                    
				replace   : true,
				transclude: true,
				scope     :{
					show: '=',
					icon: '='
				},
				link: function(scope, element, attrs) {
				   var timeout;
				   // clear previous interval
				   scope.$watch('show', function(){
					   if(scope.show){
							timeout;
							timeout =  $timeout(function() {
								scope.show = false;
							}, 2000);   
					   };
				   });
				},                
				template  : '<div class="notify" ng-class="show?\'show\':\'\'">'+
							'   <span class="notify-icon">'+
							'      <span class="{{icon}}"></span>'+
							'   </span>'+
							'   <span class="notify-text" ng-transclude>'+
							'   </span>'+
							'</div>'
			}
		}]).directive('confirm',[function(){
			return {
				restrict  : 'EA',                    
				replace   : true,
				transclude: true,
				scope     :{
					show: '=',
					icon: '=',
					confirmfn: '='
				},
				link: function(scope, element, attrs) {
					scope.confirmIt=function(){
						scope.confirmfn();
					};
					scope.hideconfirm =function(){
						scope.show =false;
					}
				},                
				template  : '<div class="confirm"  ng-class="show?\'show\':\'\'">'+
								'<div class="confirm-mask">'+
								'</div>'+
								'<div class="confirm-main">'+
									'<div class="confirm-text">'+
										'<span class="{{icon}}"></span>'+//confrm-waring-icon batch
										'<span  ng-transclude></span><div></div>'+
									'</div>'+       
									'<div class="confirm-btn">'+
										'<button type="submit" ng-click="hideconfirm()" class="pure-button button-secondary">取消</button>'+
										'<button type="submit" ng-click="confirmIt()" class="pure-button button-error" >确定</button>'+
									'</div>'+
								'</div>'+          
							'</div>'
			}
		}]);

});