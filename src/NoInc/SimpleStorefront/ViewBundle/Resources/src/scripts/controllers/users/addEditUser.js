app.controller('addEditUserController', ($scope, $rootScope, $state, $stateParams, $mdToast, $mdDialog, usersProvider, coursesProvider) => {
    $scope.userId = $stateParams.userID;

    $scope.userData = {};
    $scope.userCourses = [];
    $scope.selectedCourses = [];

    $scope.addCourse = {};
    $scope.addCourse.ids = [];
    $scope.addCourse.role = null;
    $scope.totalNumberOfCourses = 0;

    $scope.editingName = false;
    $scope.editingEmail = false;

    $scope.allCourses = [];

    const emailTaken = fields => $mdDialog.confirm()
        .title(`Chosen ${fields.join(' and ')} taken`)
        .textContent(`A user is already associated with that ${fields.join(' and ')}. Try another ${fields.join(' and ')}.`)
        .ariaLabel('Acknowledge')
        .ok('Ok');

    const showUpdateError = (error) => {
        $rootScope.pendingXHR = false;
        const fields = [];
        error.data.violations.forEach(prop => fields.push(prop.propertyPath));
        $mdDialog.show(emailTaken(fields)).then(() => $scope.loadData());
    };

    $scope.showPasswordNotification = (user) => {
        usersProvider.sendResetEmail($scope.userData);
        const confirm = $mdDialog.confirm()
            .title('Password')
            .textContent(`Because no initial password was set, ${user.username} will recieve an email to set their own password to login at ${user.email}`)
            .ariaLabel('Acknowledge')
            .ok('Ok');

        $mdDialog.show(confirm).then(() => {
            $state.go('addEditUser', { userID: user.id });
        }, () => {
            $state.go('addEditUser', { userID: user.id });
        });
    };

    $scope.showNotification = (message, action, delay) => {
        const toast = $mdToast.simple({ hideDelay: delay || 1500 }).textContent(message || 'Saved').action(action || 'Got it');
        $mdToast.show(toast);
    };

    $scope.sendPasswordReset = () => {
        usersProvider.sendResetEmail($scope.userData).then(() => {
            $scope.showNotification(`Password reset email sent to ${$scope.userData.email}`, null, 2000);
        });
    };

    $scope.loadData = (doNotRefreshCourseList) => {
        // If this is an existing question, and not a new one.
        if ($scope.userId !== 'new') {
            usersProvider.getUserProfile($scope.userId).then((userData) => {
                $scope.userData = userData;
            }).then(() => {
                // Hack to keep the course list data from duplicating since i'm not watching
                // the promises properly. sorry.
                if (doNotRefreshCourseList !== true) {
                    usersProvider.getCourses($scope.userId).then((userCourses) => {
                        $scope.allCourses = [];
                        $scope.userCourses = userCourses;

                        $scope.userCoursesPromise = coursesProvider.getCourses().then((courses) => {
                            $scope.totalNumberOfCourses = courses.length;
                        });

                        $scope.userCoursesPromise = coursesProvider.getCourses($scope.query).then((courses) => {
                            // Filter out courses the user already belongs to.
                            courses.forEach((course) => {
                                let isFound = false;
                                userCourses.forEach((userCourse) => {
                                    if (userCourse.course.id === course.id) {
                                        isFound = true;
                                    }
                                });

                                if (!isFound) $scope.allCourses.push(course);
                            });
                        });
                    });
                }
            });
        }
    };

    // Toggle editing sections
    $scope.toggleName = () => {
        $scope.userData.editedName = $scope.userData.username;
        $scope.editingName = !$scope.editingName;
    };

    $scope.toggleEmail = () => {
        $scope.userData.editedEmail = $scope.userData.email;
        $scope.editingEmail = !$scope.editingEmail;
    };

    $scope.toggleActiveStatus = () => {
        // This is called after the model updates.
        const updatedUser = {};

        updatedUser.id = $scope.userId;
        updatedUser.enabled = $scope.userData.enabled;

        usersProvider.updateUser(updatedUser).then(() => {
            if ($scope.userData.enabled) {
                $scope.showNotification('User enabled');
            } else {
                $scope.showNotification('User disabled');
            }
            $scope.loadData();
        });
    };

    // Edit methods for the user.
    $scope.saveUser = () => {
        const updatedUser = {};

        // Untoggle the appropriate editing section
        $scope.editingEmail = $scope.editingEmail ? !$scope.editingEmail : $scope.editingEmail;
        $scope.editingName = $scope.editingName ? !$scope.editingName : $scope.editingName;

        if ($scope.userData.editedName) {
            updatedUser.username = $scope.userData.editedName.toLowerCase().trim();
        }

        if ($scope.userData.editedEmail) {
            updatedUser.email = $scope.userData.editedEmail.toLowerCase().trim();
        }

        if ($scope.userData.password && ($scope.userData.password === $scope.userData.confirmPassword)) {
            updatedUser.plainPassword = $scope.userData.password.trim();
        }

        if ($scope.userId !== 'new') {
            updatedUser.id = $scope.userId;
            usersProvider.updateUser(updatedUser).then((user) => {
                if (user.id) {
                    $scope.showNotification('User updated');
                }
                $scope.loadData();
            }).catch(showUpdateError);
        } else {
            usersProvider.createUser(updatedUser).then((user) => {
                if (user.id) {
                    $scope.showNotification('User created');
                    if (!updatedUser.plainPassword) {
                        $scope.showPasswordNotification(user);
                    } else {
                        $state.go('addEditUser', { userID: user.id });
                    }
                }
                $scope.loadData();
            }).catch(showUpdateError);
        }
    };

    $scope.discardEdits = (section) => {
        // Reset question edit data where appropriate
        if (section === 'name') {
            $scope.userData.editedName = null;
            $scope.editingName = false;
        } else if (section === 'email') {
            $scope.userData.editedEmail = null;
            $scope.editingEmail = false;
        }
    };

    $scope.deactivateUser = () => {
        $scope.userData.enabled = false;
        $scope.saveUser();
    };

    $scope.activateUser = () => {
        $scope.userData.enabled = true;
        $scope.saveUser();
    };

    // Functions for managing course relationships.
    $scope.clearSelected = () => {
        $scope.selectedCourses = [];
    };

    $scope.removeFromSelectedCourses = () => {
        $scope.selectedCourses.forEach((usersCourse) => {
            $scope.removeUserFromCourse(usersCourse.id, true);
        });
        $scope.loadData();
    };

    $scope.changeRoleSelected = (role) => {
        $scope.selectedUsers.forEach((user) => {
            $scope.changeRole(user.id, role);
        });
    };

    $scope.changeRole = (userCoursesId, role) => {
        usersProvider.changeRoleForCourse(userCoursesId, role).then(() => {
            $scope.loadData();
        });
    };

    $scope.addUserToCourse = () => {
        $scope.addCourse.ids.forEach((course) => {
            usersProvider.addUserToCourse(parseInt($scope.userId, 0), course, $scope.addCourse.role).then(() => {
                $scope.loadData();
            });
        });
        $scope.addCourse.ids = [];
        $scope.addCourse.role = null;
    };

    $scope.removeUserFromCourse = (usersCourseId, doNotRefreshCourseList = false) => {
        usersProvider.removeUserFromCourse(usersCourseId).then(() => {
            $scope.loadData(doNotRefreshCourseList);
        });
    };

    // Initialize the data
    $scope.loadData();
});
