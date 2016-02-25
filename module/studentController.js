mainApp.controller("studentController", function($scope){
	$scope.student = {
		firstname: 'Loki',
		lastname: 'Alice',
		fees:500,

		subjects:[
			{name:'Physics',marks:70},
			{name:'Math',marks:78},
			{name:'English',marks:80},
			{name:'Hindi',marks:90}
		],

		fullName:function(){
			var studentObject;
			studentObject = $scope.student;
			return studentObject.firstname + " " + studentObject.lastname; 
		}

	};

});