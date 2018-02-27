// This should really be a service probably
// but babel currently messes up and thinks that "this" would be undefined
// even though AngularJS internally does a constructor to define "this" within
// the service. So for now, it's a factory. Sorry!
//
app.factory('metaProvider', ['$http', '$q', '$rootScope', ($http, $q, $rootScope) =>
    ({
        getStatuses: () => {
            $rootScope.pendingXHR = true;
            return $http.get('/api/statuses').then((response) => {
                $rootScope.pendingXHR = false;
                return response.data;
            });
        },
    }),
]);
