app.controller('myCoursesController', ($scope, coursesProvider) => {
    $scope.courses = [];
    $scope.loading = true;
    $scope.totalCourses = null;

    // For table pagination
    $scope.query = {};
    $scope.query.limit = 10;
    $scope.query.page = 1;

    $scope.loadData = () => {
        coursesProvider.getCourses().then((courses) => {
            $scope.totalCourses = courses.length;
        });

        $scope.myCoursesPromise = coursesProvider.getCourses(null, $scope.query).then((courses) => {
            $scope.courses = courses;
            $scope.loading = false;
        });
    };

    $scope.loadData();
});
