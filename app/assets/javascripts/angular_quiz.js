var app = angular.module('MusicQuiz', ['ngResource']);

app.factory('Quiz', function($resource) {
    var Quiz = $resource('/api/quizzes/:id', {id: '@id'});
    Quiz.question = $resource(
        '/api/quizzes/:quiz_id/questions/:id', 
        {quiz_id: '@id', id: '@id'}
    );
    return Quiz;
});

app.controller("MainCtrl", function($scope, session, $http) {
    $scope.session = session;
    session.getStatus();
});

app.controller("QuizCtrl", function($scope) {
    $scope.status = {
        question: 4,
        totalQuestions: 6
    };
    $scope.quiz = {
        question: "Where am I?",
        options: [
            "Jimi Hendrix",
            "Eminem",
            "Porcupine tree",
            "Demian"
        ]
    }
});

app.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i++)
            input.push(i);
        return input;
    };
});