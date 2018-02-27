app.controller('addEditCourseController', ($scope, $state, $stateParams, $mdToast, $mdDialog, coursesProvider, usersProvider) => {
    $scope.courseData = {};
    $scope.courseId = $stateParams.courseID;
    $scope.users = [];
    $scope.allUsers = [];
    $scope.selectedUsers = [];
    $scope.cssfile = null;

    $scope.addUser = {
        ids: [],
        role: null,
    };

    const mapValues = (course) => {
        const cssfile = course.metas.filter(meta => meta.metaField === 'cssfile')[0];
        if (cssfile) {
            $scope.cssfile = cssfile.value;
        } else {
            $scope.cssfile = '';
        }

        return course;
    };

    $scope.loadData = () => {
        if ($scope.courseId !== 'new') {
            coursesProvider.getCourseById($scope.courseId).then((course) => {
                $scope.courseData = mapValues(course);
            });

            $scope.userDataPromise = coursesProvider.getUsers($scope.courseId).then((users) => {
                $scope.users = users;
            });

            $scope.userDataPromise = usersProvider.getUsers().then((users) => {
                $scope.allUsers = users;
            });
        }
    };

    $scope.clearSelected = () => {
        $scope.selectedUsers = [];
    };

    $scope.togglePublishStatus = () => {
        $scope.saveCourse();
    };

    $scope.removeFromSelectedCourses = () => {
        $scope.selectedUsers.forEach((user) => {
            $scope.removeUserFromCourse(user.id);
        });
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

    $scope.addToCourse = () => {
        $scope.addUser.ids.forEach((user) => {
            usersProvider.addUserToCourse(parseInt(user, 0), parseInt($scope.courseId, 0), $scope.addUser.role).then(() => {
                $scope.loadData();
            });
        });
    };

    $scope.removeUserFromCourse = (userCoursesId) => {
        usersProvider.removeUserFromCourse(userCoursesId).then(() => {
            $scope.loadData();
        });
    };

    $scope.saveCourse = () => {
        const updatedCourse = {};

        updatedCourse.metas = {};
        updatedCourse.metas.cssfile = $scope.cssfile;
        updatedCourse.displayName = $scope.courseData.editedName ? $scope.courseData.editedName : $scope.courseData.displayName;
        updatedCourse.name = $scope.courseData.name;
        updatedCourse.isPublished = $scope.courseData.isPublished;

        if ($scope.courseId === 'new') {
            coursesProvider.createCourse(updatedCourse).then((course) => {
                if (course.id) {
                    $scope.showNotification('Course saved');
                    $state.go('addEditCourse', { courseID: course.id });
                } else {
                    $scope.showNotification('Error saving course');
                }
            });
        } else {
            updatedCourse.id = $scope.courseId;
            coursesProvider.updateCourse(updatedCourse).then(() => {
                $scope.loadData();
                $scope.showNotification('Course updated');
            });
        }
        $scope.editingName = false;
    };

    $scope.editingName = false;

    // Toggle editing sections
    $scope.toggleName = () => {
        $scope.courseData.editedName = $scope.courseData.displayName;
        $scope.editingName = !$scope.editingName;
        angular.element(document.getElementById('course-name')).focus();
    };

    $scope.discardEdits = (section) => {
        // Reset question edit data where appropriate
        if (section === 'name') {
            $scope.courseData.editedName = null;
            $scope.editingName = false;
        }
    };

    $scope.loadData();

    $scope.showConfirmDelete = (ev) => {
        const confirm = $mdDialog.confirm()
            .title('Would you like to delete this course?')
            .textContent('This action will permanently delete the course. You may consider deactivating the course instead to temporarily disable it.')
            .ariaLabel('Confirm deleting course')
            .targetEvent(ev)
            .ok('Delete Course')
            .cancel('Keep Course');

        $mdDialog.show(confirm).then(() => {
            coursesProvider.deleteCourse($scope.courseData).then(() => {
                $scope.showNotification('Course deleted');
                $state.go('allCourses');
            });
        });
    };

    $scope.showNotification = (message, action, delay) => {
        const toast = $mdToast.simple({ hideDelay: delay || 1500 }).textContent(message || 'Saved').action(action || 'Got it');
        $mdToast.show(toast);
    };
});
