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

app.directive("location", function($location) {
    var linker = function(scope, element) {
        
        var updateLocation = function() {
            var pattern = new RegExp('^' + scope.path + '$', ['i']);
            scope.active = pattern.test($location.path())
        }
        updateLocation();
        scope.$watch(function() { 
            return $location.path(); 
        }, updateLocation);
    };
    return {
        restrict: "E",
        transclude: true,
        replace: true,
        template: '<li ng-class="{active: active}"><a href="#{{path}}" ng-transclude></a></li>',
        scope: { path: "@", name: "@" },
        link: linker
    }
});

app.directive("loggedin", function(session) {
    return {
        restrict: 'A',
        replace: true,
        link: function(scope, element) {
            var update = function() {
                element.css("display", session.isLoggedIn() ? '' : 'none');
            }
            scope.$watch(session.isLoggedIn, update)
        }
    };
});

app.directive("checkbox", function() {
    return {
        restrict: 'E',
        template: '<label class="checkbox"><input type="checkbox" value="{{option.value}}" ng-model="option.checked">{{option.value}}</label>'
    };
});