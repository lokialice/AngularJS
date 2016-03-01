
/**
- the main todoMVC app module
@type {angular.module}
**/
angular.module('todomvc',['ngRoute'])
	.config( function ($routeProvider) {
		'use strict';

		var routeConfig = {
			controller: 'TodoCtrl',
			templateUrl:'todomvc-index.html',
			resolve: {
				store: function (todoStorage) {
					//get the correct module (API or localStorage)
					return todoStorage.then( function (module) {
						module.get(); // fetch the todo records in the background
						return module;
					});
				}
			}
		};

		$routeProvider
			.when('/', routeConfig)
			.when('/:status', routeConfig)
			.otherwise({
				redirectTo:'/'
			});
	})