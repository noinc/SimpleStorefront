// This should really be a service probably
// but babel currently messes up and thinks that "this" would be undefined
// even though AngularJS internally does a constructor to define "this" within
// the service. So for now, it's a factory. Sorry!
//
app.factory('usersProvider', ['$http', '$q', '$rootScope', ($http, $q, $rootScope) =>
    ({
        getUsers: (query) => {
            $rootScope.pendingXHR = true;
            if (query) {
                return $http.get(`/api/users?limit=${query.limit}&page=${query.page}`).then((response) => {
                    $rootScope.pendingXHR = false;
                    return response.data;
                });
            }

            return $http.get('/api/users').then((response) => {
                $rootScope.pendingXHR = false;
                return response.data;
            });
        },

        getCourses: (user, query) => {
            $rootScope.pendingXHR = true;
            if (query) {
                return $http.get(`/api/user_courses?user=${user}?limit=${query.limit}&page=${query.page}`).then((response) => {
                    $rootScope.pendingXHR = false;
                    return response.data;
                });
            }
            return $http.get(`/api/user_courses?user=${user}`).then((response) => {
                $rootScope.pendingXHR = false;
                return response.data;
            });
        },

        getUserProfile: (userId) => {
            $rootScope.pendingXHR = true;
            return $http.get(`/api/users/${userId}`).then((response) => {
                $rootScope.pendingXHR = false;
                return response.data;
            });
        },

        updateUserProfile: (user, userId) => {
            $rootScope.pendingXHR = true;
            return $http.put(`/api/users/${userId}`, user).then((response) => {
                $rootScope.pendingXHR = false;
                return response.data;
            });
        },

        createUser: (user) => {
            $rootScope.pendingXHR = true;
            const newUser = {};
            newUser.username = user.username;
            newUser.email = user.email;
            if (user.plainPassword) {
                newUser.plainPassword = user.plainPassword;
            } else {
                const rand = Math.floor(Math.random() * 100000);
                newUser.plainPassword = `temp${rand}pass`;
            }
            newUser.enabled = user.enabled;

            return $http.post('/api/users', newUser).then((response) => {
                $rootScope.pendingXHR = false;
                return response.data;
            });
        },

        updateUser: (user) => {
            $rootScope.pendingXHR = true;
            return $http.put(`/api/users/${user.id}`, user).then((response) => {
                $rootScope.pendingXHR = false;
                return response.data;
            });
        },

        sendResetEmail: (user) => {
            $rootScope.pendingXHR = true;
            return $http.post(`/resetting/send-email?username=${user.email}`).then((data) => {
                $rootScope.pendingXHR = false;
                return data;
            });
        },

        removeUserFromCourse: (usersCourseId) => {
            $rootScope.pendingXHR = true;
            return $http.delete(`/api/user_courses/${usersCourseId}`).then((resp) => {
                $rootScope.pendingXHR = false;
                return resp;
            });
        },

        changeRoleForCourse: (usersCourseId, role) => {
            $rootScope.pendingXHR = true;
            return $http.put(`/api/user_courses/${usersCourseId}`, { role }).then((resp) => {
                $rootScope.pendingXHR = false;
                return resp;
            });
        },

        addUserToCourse: (user, course, role) => {
            $rootScope.pendingXHR = true;
            return $http.post('/api/user_courses', { user, course, role }).then((resp) => {
                $rootScope.pendingXHR = false;
                return resp;
            });
        },
    }),
]);
