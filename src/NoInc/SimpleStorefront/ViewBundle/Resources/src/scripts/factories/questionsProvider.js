// This should really be a service probably
// but babel currently messes up and thinks that "this" would be undefined
// even though AngularJS internally does a constructor to define "this" within
// the service. So for now, it's a factory. Sorry!
//
app.factory('questionsProvider', ['$http', '$q', '$rootScope', ($http, $q, $rootScope) =>
    ({
        getQuestions: (filters, query) => {
            $rootScope.pendingXHR = true;

            const filterQueries = [];

            if (filters) {
                // API Accepts arrays of IDs to filter
                if (filters.courses && filters.courses.length) {
                    filterQueries.push(`course=[${filters.courses.toString()}]`);
                }

                if (filters.statuses && filters.statuses.length) {
                    filterQueries.push(`status=[${filters.statuses.toString()}]`);
                }

                // A good clear isn't built into angular-material, so even though the published filter is a boolean
                // we are going to treat it as a multi-select. This means that if both true and false are provided,
                // it is functionally the same as no filtering. So only filter on isPublished if the array.length === 1.
                if (filters.isPublished && filters.isPublished.length === 1) {
                    filterQueries.push(`isPublished=${filters.isPublished[0]}`);
                }
            }

            if (filterQueries.length) {
                return $http.get(`/api/questions?${filterQueries.join('&')}&limit=${query.limit}&page=${query.page}`).then((response) => {
                    $rootScope.pendingXHR = false;
                    return response.data;
                });
            } else if (query) {
                return $http.get(`/api/questions?limit=${query.limit}&page=${query.page}`).then((response) => {
                    $rootScope.pendingXHR = false;
                    return response.data;
                });
            }

            return $http.get('/api/questions').then((response) => {
                $rootScope.pendingXHR = false;
                return response.data;
            });
        },

        getQuestionbyId: (id) => {
            $rootScope.pendingXHR = true;
            return $http.get(`/api/questions/${id}`).then((response) => {
                $rootScope.pendingXHR = false;
                return response.data;
            });
        },

        saveQuestion: (data, questionId) => {
            $rootScope.pendingXHR = true;
            // If the question is new, POST a new one. If it's existing, PUT and update.

            if (questionId === 'new') {
                return $http.post('/api/questions', data);
            } else if (questionId) {
                return $http.put(`/api/questions/${questionId}`, data);
            }

            throw new Error('No valid question ID provided.');
        },

        deleteQuestion: (data) => {
            $rootScope.pendingXHR = true;
            if (data.id && data.id !== 'new') {
                $rootScope.pendingXHR = false;
                return $http.delete(`/api/questions/${data.id}`, data);
            }

            throw new Error('No valid question ID provided.');
        },
    }),
]);
