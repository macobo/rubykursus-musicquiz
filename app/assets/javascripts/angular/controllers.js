app.controller("MainCtrl", function($scope, session, $http) {
    $scope.session = session;
    session.getStatus();
});


app.controller("QuizCtrl", function($scope, $routeParams, $location, $route, Quiz) {
    if ($routeParams.quiz_id) {
        $scope.quiz = Quiz.get({id: $routeParams.quiz_id});
    } else {
        Quiz.solver.get($routeParams).then(function(response) {
            $scope.quiz = response.data.quiz;
            $scope.question = response.data.question;
            if ($scope.quiz.answers_given.length == $scope.quiz.question_count) {
                $location.path('/play/'+$routeParams.id+'/finish');
            }
        });
    }
    $scope.debug = false;

    $scope.correctCount = function() {
        if ($scope.quiz)
            return _.filter($scope.quiz.correct_answers, _.identity).length;
    }

    $scope.start = function() {
        Quiz.solver.create($routeParams).
            then(function(response){
                var id = response.data.id;
                $location.path('/play/'+id);
            });
    };

    var userAnswer = function() {
        var answer = [];
        if ($scope.question.type == "Multiple choice") {
            _.each($scope.question.options, function(option) {
                if (option.checked) answer.push(option.value)
            });
        }
        answer.sort();
        return answer.join(", ");
    }

    $scope.checkAnswer = function() {
        $scope.checked = true;
        $scope.user_answer = userAnswer();
        Quiz.solver.submit($routeParams, {answer: $scope.user_answer}).
            then(function(response) {
                $scope.answer = response.data.expected_answer;
            });
    }

    $scope.route = $route;

});


// CRUD stuff

app.controller("ListQuizCtrl", function($scope, Quiz) {
    $scope.quizzes = Quiz.query();
});


app.controller("EditQuizCtrl", function($scope, $routeParams, $location, Quiz) {
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


app.controller("EditQuestionCtrl", function($scope, $location, question) {
    $scope.optionTypes = [
        "Multiple choice"
        //"Word answer"
    ];

    $scope.question = question;
    if (!_.has(question.data, "type"))
        question.data.type = $scope.optionTypes[0];

    var original = angular.copy(question);

    var ans_array = $scope.question.answer.split(", ");
    $scope.options = _.map(question.data.options, function(o) {
        return {value: o.value, checked: _.contains(ans_array, o.value)};
    });

    $scope.$watch("options", function() {
        var answer = [];
        $scope.question.data.options = _.map($scope.options, function(o) {
            if (o.checked) answer.push(o.value);
            return { value: o.value };
        });
        answer.sort();
        $scope.question.answer = answer.join(", ");
    }, true);

    $scope.isClean = function() {
        return angular.equals(original, $scope.question);
    }

    $scope.destroy = function() {
        original.$delete(function() {
            $location.path('/crud/'+question.quiz_id);
        });
    };

    $scope.save = function() {
        original = $scope.question;
        question.$save({quiz_id: question.quiz_id}, function() {
            $location.path('/crud/'+question.quiz_id);
        });
    };

    $scope.addOption = function() {
        $scope.options || ($scope.options = []);
        $scope.options.push({});
    }

    $scope.remove = function(index, array) {
        array.splice(index, 1);
    }
});