app.directive("progressbar", function() {
    return {
        restrict: 'E',
        replace: true,
        template: '' +
            '<ul class="progressbar clearfix">' +
                '<li ng-repeat="_ in [] | range:done" class="done"></li>' +
                '<li ng-repeat="_ in [] | range:todo"></li>' +
            '</ul>',
        scope: { done: '=', total: '=' },
        link: function(scope) {
            scope.todo = parseInt(scope.total) - parseInt(scope.done);
        }
    }
});