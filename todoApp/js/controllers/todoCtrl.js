/**
* The main controller for the app. The controller:
- retrieves and presists the model via the todoStorage service
- exposes the model to the template and provides event handlers
**/
angular.module('todomvc')
	.controller('TodoCtrl', function ToDoCtrl($scope, $routeParams, $filter, store){
		'use strict';

		var todos = $scope.todos = store.todos;

		$scope.newTodo = '';
		$scope.editedToDo = null;

		$scope.$watch('todos', function(){
			$scope.remainingCount = $filter('filter')(todos,{ completed:true}).length;
			$scope.completedCount = todos.length -  $scope.remainingCount;
			$scope.allChecked = !$scope.remainingCount;			
		},true);

		//monitor the current route for changes and adjust the filter accordingly
		$scope.$on('$routeChangeSuccess', function () {
			var status = $scope.status = $routeParams.status || '';
			$scope.statusFilter = (status === 'active') ?
				{ completed: false } : (status === 'completed') ?
				{ completed: true } : {};
		});

		$scope.addTodo = function (){
			var newTodo = {
				title:$scope.newTodo.trim(),
				completed:false
			};

			if(!newTodo.title){
				return;
			}

			$scope.saving = true;
			store.insert(newTodo)
					.then(function success(){
						$scope.newTodo = '';						
					})
					.finally(function(){
						$scope.saving = false;
					});
		};

		$scope.editedToDo = function (todo){
			$scope.editedToDo = todo;
			//clone the original todo to restore it on demand
			$scope.originalTodo = angular.extend({}, todo);
		};

		$scope.saveEdits = function(todo, event){
			//blur events are automatically triggered after the form submit envent
			//this does some unfortunate logic handling to prevent saving twice
			if(event === 'blur' && $scope.saveEvent === 'submit') {
				$scope.saveEvent = null;
				return;
			}

			$scope.saveEvent = event;

			if($scope.reverted){
				//todo edits were reverted --don't save
				$scope.reverted = null;
				return;				
			}

			todo.title = todo.title.trim();

			if(todo.title === $scope.originalTodo.title) {
				$scope.editedToDo = null;							
				return;
			}

			store[todo.title ? 'put':'delete'](todo)
				.then(function success() {}, function error(){
					todo.title = $scope.originalTodo.title;
				})
				.finally(function (){
					$scope.editedToDo = null;
				});				
		};

		$scope.revertEdits = function (todo) {
			todos[todos.indexOf(todo)] = $scope.originalTodo;
			$scope.editedToDo = null;
			$scope.originalTodo = null;
			$scope.reverted = true;
		};

		$scope.removeTodo = function (todo) {
			store.delete(todo);
		};

		$scope.saveTodo = function (todo) {
			store.put(todo);
		};

		$scope.toggleCompleted = function (todo, completed) {
			if(angular.isDefined(completed)){
				todo.completed = completed;
			}
			store.put(todo, todos.indexOf(todo))
				.then(function success() {}, function error() {
					todo.completed = !todo.completed;
				});
		};

		$scope.clearCompletedTodos = function (){
			store.clearCompleted();
		};

		$scope.markAll = function (completed) {
			todos.forEach(function (todo){
				if(todo.completed !== completed){
					$scope.toggleCompleted(todo, completed);
				}
			});
		};
	});