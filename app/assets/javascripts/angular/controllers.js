app.controller("MainCtrl", function($scope, session, $http) {
    $scope.session = session;
    session.getStatus();
});


app.controller("QuizCtrl", function($scope, $routeParams, Quiz) {
    var Quiz = Quiz.get($routeParams);
});


// CRUD stuff

app.controller("ListQuizCtrl", function($scope, Quiz) {
    $scope.quizzes = Quiz.query();
});


app.controller("EditQuizCtrl", function($scope, $routeParams, $location, Quiz) {
    var self = this;
    if ($routeParams.id) {
        Quiz.get($routeParams, function(quiz){
            self.original = quiz;
            $scope.quiz = angular.copy(quiz);
            $scope.questions = Quiz.question.query({quiz_id: quiz.id});
        });
    } else {
        self.original = new Quiz();
        $scope.quiz = new Quiz();
    }

    $scope.isClean = function() {
        return angular.equals(self.original, $scope.quiz);
    }

    $scope.destroy = function() {
        self.original.$delete(function() {
            $location.path('/crud');
        });
    };

    $scope.save = function() {
        self.original = $scope.quiz;
        $scope.quiz.$save(function() {
            $location.path('/crud');
        });
    };
});


app.controller("EditQuestionCtrl", function($scope, $routeParams, $location, Quiz) {
    var self = this;
    $scope.quiz_id = $routeParams.quiz_id;
    $scope.options = ["Multiple choice", "Word answer"];

    if ($routeParams.id) {
        Quiz.question.get($routeParams, function(question){
            self.original = question;
            $scope.question = angular.copy(question);
            $scope.data = $scope.data = $scope.question.data;
        });
    } else {
        $scope.question = new Quiz.question({
            data: { type: $scope.options[0] }
        });
        self.original = angular.copy($scope.question);
        $scope.data = $scope.question.data;
    }

    $scope.isClean = function() {
        return angular.equals(self.original, $scope.question);
    }

    $scope.destroy = function() {
        self.original.$delete(function() {
            $location.path('/crud/{{$routeParams.quiz_id}}');
        });
    };

    $scope.save = function() {
        if ($scope.question.answer instanceof Array)
            $scope.question.answer = $scope.question.answer.join(", ");
        self.original = $scope.question;
        $scope.question.$save({quiz_id: $routeParams.quiz_id}, function() {
            $location.path('/crud/{{$routeParams.quiz_id}}');
        });
    };

    $scope.addOption = function() {
        $scope.data.options || ($scope.data.options = []);
        $scope.data.options.push({});
    }

    $scope.remove = function(index, array) {
        array.splice(index, 1);
    }
});