// This should really be a service probably
// but babel currently messes up and thinks that "this" would be undefined
// even though AngularJS internally does a constructor to define "this" within
// the service. So for now, it's a factory. Sorry!
//
app.factory('coursesProvider', ['$http', '$q', '$rootScope', ($http, $q, $rootScope) =>
    ({
        getCourses: (filters, query) => {
            $rootScope.pendingXHR = true;
            const filterQueries = [];

            if (filters) {
                // A good clear isn't built into angular-material, so even though the published filter is a boolean
                // we are going to treat it as a multi-select. This means that if both true and false are provided,
                // it is functionally the same as no filtering. So only filter on isPublished if the array.length === 1.
                if (filters.isPublished && filters.isPublished.length === 1) {
                    filterQueries.push(`isPublished=[${filters.isPublished[0]}]`);
                }
            }

            if (filterQueries.length) {
                return $http.get(`/api/courses?${filterQueries.join('&')}&limit=${query.limit}&page=${query.page}`).then((response) => {
                    $rootScope.pendingXHR = false;
                    return response.data;
                });
            } else if (query) {
                return $http.get(`/api/courses?limit=${query.limit}&page=${query.page}`).then((response) => {
                    $rootScope.pendingXHR = false;
                    return response.data;
                });
            }

            return $http.get('/api/courses').then((response) => {
                $rootScope.pendingXHR = false;
                return response.data;
            });
        },

        getCourseById: (id) => {
            $rootScope.pendingXHR = true;
            return $http.get(`/api/courses/${id}`).then((response) => {
                $rootScope.pendingXHR = false;
                return response.data;
            });
        },

        updateCourse: (course) => {
            $rootScope.pendingXHR = true;

            return $http.put(`/api/courses/${course.id}`, course).then((response) => {
                $rootScope.pendingXHR = false;
                return response.data;
            });
        },

        getUsers: (course) => {
            $rootScope.pendingXHR = true;
            return $http.get(`/api/user_courses?course=${course}`).then((response) => {
                $rootScope.pendingXHR = false;
                return response.data;
            });
        },

        createCourse: (course) => {
            $rootScope.pendingXHR = true;
            return $http.post('/api/courses', course).then((response) => {
                $rootScope.pendingXHR = false;
                return response.data;
            });
        },

        deleteCourse: (course) => {
            $rootScope.pendingXHR = true;
            return $http.delete(`/api/courses/${course.id}`).then((data) => {
                $rootScope.pendingXHR = false;
                return data;
            });
        },
    }),
]);
