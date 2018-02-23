app.controller('dashboardController', ($scope, $http, $state, $q, usersProvider, coursesProvider, questionsProvider, metaProvider) => {
    $scope.loading = false;

    $scope.users = [];
    $scope.courses = [];

    $scope.goToQuestionStatusState = (status) => {
        $state.go('allQuestionsAdmin', { status });
    };

    $scope.loadData = () => {
        $scope.usersPromise = usersProvider.getUsers().then((users) => {
            $scope.users = users;
        });

        $scope.usersPromise = coursesProvider.getCourses().then((courses) => {
            $scope.courses = courses;
        });

        $scope.questionsPromise = questionsProvider.getQuestions().then((questions) => {
            $scope.questions = questions;
        }).then(() => {
            metaProvider.getStatuses().then((statuses) => {
                const questionsData = {};
                questionsData.items = [];
                questionsData.total = $scope.questions.length;

                statuses.forEach((s) => {
                    questionsData.items.push({
                        name: s.displayName,
                        id: s.id,
                        count: $scope.questions.filter(q => q.status.name === s.name).length,
                    });
                });
                // renderPieChart is included in the utilities file that gulp will prepend to the pla.js file!
                // eslint-disable-next-line no-undef
                window.onresize = () => { renderPieChart('questionsPie', questionsData, 'Questions'); };
                // eslint-disable-next-line no-undef
                renderPieChart('questionsPie', questionsData, 'Questions', null, $scope.goToQuestionStatusState);
            });
        });
    };


    // Initialize.
    $scope.loadData();
});
