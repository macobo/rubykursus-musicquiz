app.factory("session", function($q, $http) {
    var user = null;
    var fbPromise = function(method_name) {
        console.log("FB_called", method_name);
        var deferred = $q.defer();
        FB[method_name](function(response) {
            deferred.resolve(response);
            console.log("FB_resolved", method_name, response, deferred);
        });
        return deferred.promise;
    };

    var login = function() {
        var auth_callback = function() {
            console.log("auth_callback");
            return $http.get('/auth/facebook/callback');
        }
        fbPromise("login").
            then(auth_callback).
            then(getStatus);
    };

    var getStatus = function() {
        console.log("getting status");
        var deferred = $q.defer();
        $http.get("/loginstatus").
            success(function(data) {
                console.log("got status", data);
                user = data;
                deferred.resolve(data);
            }).error(function(data) {
                console.log("didn't get status");
                user = null;
                deferred.reject(data);
            });
        return deferred.promise;
    };

    var logout = function() {
        fbPromise("getLoginStatus").
            then(function(response) {
                if (response.status == "connected") 
                    return;
                console.log("logging out", response)
                return fbPromise("logout");
                //return $q.all([fbPromise("logout"), $http.get('/signout')]);
            }).
            then(function() { window.location = '/signout' });
    };

    return {
        login: login,
        logout: logout,
        getStatus: getStatus,
        isLoggedIn: function() { return user != null; },
        getUser: function() { return user; }
    };
});

app.factory('Quiz', function($resource) {
    var Quiz = $resource('/api/quizzes/:id', {id: '@id'});
    Quiz.question = $resource(
        '/api/quizzes/:quiz_id/questions/:id', 
        {quiz_id: '@id', id: '@id'}
    );
    return Quiz;
});