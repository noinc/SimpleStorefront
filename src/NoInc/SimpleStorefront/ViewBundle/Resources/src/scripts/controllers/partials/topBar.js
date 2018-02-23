app.controller('topBarController', ($scope, $http, $timeout, $state, $rootScope, $mdSidenav, $log, $filter, searchDataProvider) => {
    $scope.searchData = {};

    $scope.toggleSideNav = () => {
        $mdSidenav('leftSidebar').toggle();
        angular.element(document.getElementById('sidebar')).toggleClass('close');
    };

    $scope.logout = () => {
        $http.post('/logout').then(() => {
            window.location = '/login';
        });
    };

    $scope.goToPage = (type, id) => {
        setTimeout(() => {
            $scope.closeSearchArea();
            $scope.resultsData = {};
            if (type === 'question') {
                $state.go('addEditQuestion', { questionID: id });
            } else if (type === 'course') {
                $state.go('addEditCourse', { courseID: id });
            } else if (type === 'user') {
                $state.go('addEditUser', { userID: id });
            }
        }, 250);
    };

    $scope.searchIsActive = false;

    $scope.searchTerm = null;
    $scope.resultsData = {};

    $scope.doSearch = () => {
        if (!$scope.searchIsActive) $scope.searchGotFocus();

        if (!$scope.searchTerm) {
            $scope.resultsData = {};
        } else {
            const term = $scope.searchTerm.toLowerCase();

            $scope.resultsData.questions = [];
            $scope.searchData[0].forEach((question) => {
                if (question.textEn.toLowerCase().indexOf(term) > -1) $scope.resultsData.questions.push(question);
            });

            $scope.resultsData.courses = [];
            $scope.searchData[1].forEach((course) => {
                if (course.displayName.toLowerCase().indexOf(term) > -1 || course.name.toLowerCase().indexOf(term) > -1) $scope.resultsData.courses.push(course);
            });

            $scope.resultsData.users = [];
            $scope.searchData[2].forEach((user) => {
                if (user.email.toLowerCase().indexOf(term) > -1 || user.username.toLowerCase().indexOf(term) > -1) $scope.resultsData.users.push(user);
            });
        }
    };

    // When the search is active, we are applying special styling to the page
    // and also showing the search results div. This happens partially in CSS, so
    // that's why we're adding a special class to the body element.
    $scope.searchGotFocus = () => {
        angular.element(document.querySelector('body')).addClass('search');
        $scope.searchIsActive = true;
        searchDataProvider.getFeed().then((data) => {
            $scope.searchData = data;
        });
    };

    $scope.closeSearchArea = () => {
        $scope.searchTerm = null;
        angular.element(document.querySelector('body')).removeClass('search');
        $scope.searchIsActive = false;
        $scope.searchData = {};
        $scope.resultsData = {};
    };
});
