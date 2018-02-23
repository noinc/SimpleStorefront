app.controller('sidebarController', ($scope, $rootScope, $state, $http, $timeout, $mdSidenav, $log, questionsProvider) => {
    $scope.logout = () => {
        $http.post('/api/logout').then((res) => {
            if (res.data.logoutSuccess) {
                window.location = '/login';
            }
        });
    };

    // Get the total number of questions that match, for data-table pagination.
    // Request up to Javascript Number.MAX_SAFE_INTEGER.
    questionsProvider.getQuestions($scope.filters, { page: 1, limit: 9007199254740991 }).then((questions) => {
        // Figure out the first unanaswered question for the quick workflow.
        $rootScope.newQuestions = questions.filter(question => question.status.name === 'NEW');
        $rootScope.firstNewQuestionId = $rootScope.newQuestions && $rootScope.newQuestions[0] ? $rootScope.newQuestions[0].id : null;

        $rootScope.needsApprovalQuestions = questions.filter(question => question.status.name === 'NEEDS_APPROVAL' && question.permission === 'EDITOR');
        $rootScope.firstNeedsApprovalQuestionId = $rootScope.needsApprovalQuestions && $rootScope.needsApprovalQuestions[0] ? $rootScope.needsApprovalQuestions[0].id : null;
    });

    $scope.startWorkflow = () => {
        $state.go('unansweredWorkflow', { questionID: $rootScope.firstNewQuestionId });
    };

    $scope.startWorkflow = (type) => {
        if (type === 'unanswered') {
            $state.go('unansweredWorkflow', { questionID: $rootScope.firstNewQuestionId });
        } else if (type === 'needsApproval') {
            $state.go('needsApprovalWorkflow', { questionID: $rootScope.firstNeedsApprovalQuestionId });
        }
    };
});
