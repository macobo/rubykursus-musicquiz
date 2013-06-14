app.factory("session", function($q, $rootScope, $http) {
    var user = null;
    var fbPromise = function(method_name) {
        console.log("FB_called", method_name);
        var deferred = $q.defer();
        FB[method_name](function(response) {
            deferred.resolve(response);
            console.log("FB_resolved", method_name, response);
            // since this might not get immediate response, enter
            // into a new digest cycle to continue processing.
            if(!$rootScope.$$phase) $rootScope.$apply();
        });
        return deferred.promise;
    };

    var login = function() {
        var auth_callback = function() {
            console.log("auth_callback");
            return $http.get('/auth/facebook/callback');
        };
        fbPromise("login").
            then(checkFBStatus).
            then(auth_callback).
            then(getStatus);
    };

    var checkFBStatus = function(response) {
      var deferred = $q.defer();
      if (response.authResponse !== null)
        deferred.resolve(response);
      else
        deferred.reject(response);
      return deferred.promise;
    };

    var getStatus = function() {
        console.log("getting status");
        var deferred = $q.defer();
        $http.get("/loginstatus").
            success(function(data) {
                console.log("got status", data);
                if (data.logged_in) {
                    user = data.user;
                    deferred.resolve(data);
                } else {
                    user = null;
                    deferred.reject(data);
                }
            }).error(function(data) {
                console.log("didn't get status");
                user = null;
                deferred.reject(data);
            });
        return deferred.promise;
    };

    var logout = function() {
        fbPromise("logout").
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

// props to https://github.com/btford/ngmin/issues/23
app.factory('authFilter', function (session, $location) {
    return function() {
        if (!session.isLoggedIn()) {
            $location.path("/");
            return false;
        }
        return true;
    }
});

app.factory('Quiz', function($resource, $http) {
    var Quiz = $resource('/api/quizzes/:id', {id: '@id'});
    Quiz.question = $resource(
        '/api/quizzes/:quiz_id/questions/:id', 
        {quiz_id: '@id', id: '@id'}
    );
    Quiz.solver = {
        get: function(rp) {
            return $http.get('/api/play/'+rp.id);
        },
        create: function(rp) {
            return $http.post('/api/play', rp);
        },
        submit: function(rp, data) {
            return $http.post('/api/play/'+rp.id+'/answer', data)
        }
    }

    return Quiz;
});
