app.controller('viewMyCourseController', ($scope, $state, $stateParams, $mdToast, $mdDialog, coursesProvider) => {
    $scope.courseData = {};
    $scope.courseId = $stateParams.courseID;

    $scope.loadData = () => {
        coursesProvider.getCourseById($scope.courseId).then((course) => {
            $scope.courseData = course;
        });
    };

    $scope.loadData();

    $scope.showNotification = (message, action, delay) => {
        const toast = $mdToast.simple({ hideDelay: delay || 1500 }).textContent(message || 'Saved').action(action || 'Got it');
        $mdToast.show(toast);
    };
});
