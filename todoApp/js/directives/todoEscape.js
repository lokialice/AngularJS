/**
- directive that executes an expression when the element it is applied to gets
- an 'escape' keydown event
**/

angular.module('todomvc')
	.directive('todoEscape', function () {
		'use strict';

		var ESCAPE_KEY = 27;

		return function (scope, elem, atrrs) {
			elem.bind('keydown', function(event) {
				if(event.keycode === ESCAPE_KEY) {
					scope.$apply(atrrs.todoEscape);
				}
			});

			scope.$on('$destroy', function (){
				elem.unbind('keydown');
			});
		};
	});