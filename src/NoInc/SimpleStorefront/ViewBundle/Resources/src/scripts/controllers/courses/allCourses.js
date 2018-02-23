app.controller('allCoursesController', ($scope, $mdToast, $mdDialog, coursesProvider) => {
    $scope.selectedCourses = [];
    $scope.loading = true;

    $scope.clearSelected = () => {
        $scope.selectedCourses = [];
    };

    $scope.showNotification = (message, action) => {
        const toast = $mdToast.simple({ hideDelay: 1500 }).textContent(message || 'Saved').action(action || 'Got it');
        $mdToast.show(toast).then();
    };

    $scope.loadData = () => {
        $scope.allCoursesPromise = coursesProvider.getCourses().then((courses) => {
            $scope.courses = courses;
            $scope.loading = false;
        });
    };

    $scope.publishSelected = () => {
        $scope.selectedCourses.forEach((course) => {
            $scope.changeCourseStatus(course, true);
        });
    };

    $scope.unpublishSelected = () => {
        $scope.selectedCourses.forEach((course) => {
            $scope.changeCourseStatus(course, false);
        });
    };

    $scope.changeCourseStatus = (course, status) => {
        const updatedCourse = {};
        updatedCourse.id = course.id;
        updatedCourse.isPublished = status;
        coursesProvider.updateCourse(updatedCourse).then(() => {
            if (updatedCourse.isPublished) {
                $scope.showNotification('Course published');
            } else {
                $scope.showNotification('Course unpublished');
            }
            $scope.loadData();
        });
    };

    $scope.loadData();
});
