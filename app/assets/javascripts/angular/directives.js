app.directive("progressbar", function() {
    return {
        restrict: 'E',
        replace: true,
        template: '' +
            '<ul class="progressbar clearfix">' +
                '<li ng-repeat="_ in [] | range:done" class="done"></li>' +
                '<li ng-repeat="_ in [] | range:(total-done)"></li>' +
            '</ul>',
        scope: { done: '=', total: '=' }
    }
});

app.directive("question", function() {
    var baseURL = "/templates/questionTypes/";
    var templates = {
        "Multiple choice": "multichoice.html"
    }

    return {
        restrict: 'E',
        replace: true,
        template: "<div ng-include='templateUrl()'></div>",
        scope: { question: '=data' },
        link: function(scope) {
            scope.templateUrl = function() {
                if (scope.question)
                    return baseURL + templates[scope.question.type];
            }
        }
    };
});

app.directive("checkbox", function() {
    return {
        restrict: 'E',
        template: '<label class="checkbox"><input type="checkbox" value="{{option.value}}" ng-model="option.checked">{{option.value}}</label>'
    };
});