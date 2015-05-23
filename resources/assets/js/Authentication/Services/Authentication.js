module.exports = function(authentication)
{
    authentication.factory('AuthenticationService', function()
    {
        var auth =
        {
            isAuthenticated: false,
            isAdmin: false
        };

        return auth;
    });

    authentication.factory('TokenInterceptor', [ '$q', '$window', '$location', 'API', 'AuthenticationService', function($q, $window, $location, API, AuthenticationService)
    {
        return {
            request: function(config)
            {
                config.headers = config.headers || {};

                if ($window.sessionStorage.access_token)
                {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.access_token;
                }

                config.headers["x-key"] = API.key;

                return config;
            },

            requestError: function(rejection)
            {
                return $q.reject(rejection);
            },

            response: function (response)
            {
                if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated)
                {
                    AuthenticationService.isAuthenticated = true;
                }

                return response || $q.when(response);
            },

            responseError: function(rejection)
            {
                //ALs je wel ingelogd bent maar waarschijnlijk de api tijd is verlopen
                if(rejection != null && rejection.status === 401 && ($window.sessionStorage.access_token || AuthenticationService.isAuthenticated))
                {
                    //TODO: acces_denied pagina aanmaken en naar verwijzen.

                    delete $window.sessionStorage.token;

                    AuthenticationService.isAuthenticated = false;
                    
                    $location.path("/auth/login");
                }

                //Als je nog niet ingelogd bent 
                else if (rejection != null && rejection.status === 401)
                {
                    delete $window.sessionStorage.token;

                    AuthenticationService.isAuthenticated = false;

                    $location.path("/auth/login");
                }

                return $q.reject(rejection);
            }
        };
    }]);
};
