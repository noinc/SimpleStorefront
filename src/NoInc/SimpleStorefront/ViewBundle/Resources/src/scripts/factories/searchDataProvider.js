// This should really be a service probably
// but babel currently messes up and thinks that "this" would be undefined
// even though AngularJS internally does a constructor to define "this" within
// the service. So for now, it's a factory. Sorry!
//
app.factory('searchDataProvider', ['$http', '$q', ($http, $q) =>
    ({
        getFeed: () => {
            const promises = [];

            promises.push($http.get('/api/questions').then(questions => questions.data));

            promises.push($http.get('/api/courses').then(courses => courses.data));

            promises.push($http.get('/api/users').then(users => users.data));

            return $q.all(promises);
        },
    }),
]);
