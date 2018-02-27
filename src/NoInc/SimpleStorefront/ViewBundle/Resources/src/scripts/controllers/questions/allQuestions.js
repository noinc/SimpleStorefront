app.controller('questionsController', ($scope, $mdToast, $mdDialog, questionsProvider, $state, $stateParams, $timeout, coursesProvider, metaProvider) => {
    $scope.loading = true;
    $scope.refreshing = false;
    $scope.questionCounts = {};
    $scope.courses = [];

    // For table pagination
    $scope.query = {};
    $scope.query.limit = 10;
    $scope.query.page = 1;

    // For the table multi-select
    $scope.selectedQuestions = [];
    $scope.questions = {};

    // User is allowed to filter the table for a few parameters.
    $scope.filters = {};
    $scope.filters.courses = [];
    $scope.filters.statuses = [];
    $scope.filters.isPublished = null;

    $scope.courses = [];

    // If this is being used on a course specific page, hide the courses filter.
    if ($stateParams.courseID) {
        $scope.coursePage = true;
    }

    // If we're looking at a specific status,filter for it initially.
    if ($stateParams.status) {
        $scope.filters.statuses.push($stateParams.status);
    }

    const dateToHumanString = timestamp => moment.unix(timestamp).format('LLL');

    const dateToTimeAgo = timestamp => moment.unix(timestamp).fromNow();

    const mapValues = (questions) => {
        questions.map((question) => {
            question.askedDate = question.createdAt ? dateToHumanString(question.createdAt) : 'No Data';
            question.timeAgo = question.createdAt ? dateToTimeAgo(question.createdAt) : 'No Data';
            question.status = question.status.displayName;
            return question;
        });

        return questions;
    };

    $scope.closeSelect = () => {
        // Hacky way but there's no documented way to programmatically close the md-select
        // except to click the generated md-backdrop element.
        angular.element(document.getElementsByTagName('md-backdrop')).triggerHandler('click');
    };

    $scope.loadData = (filtering) => {
        // In the interest of code re-use, we also can use this controller to display the questions
        // table on a course-specific page. In which case, there's a state param for courseID and we
        // can permanently affix that to the query.
        if ($stateParams.courseID) {
            $scope.filters.courses = [];
            $scope.filters.courses.push($stateParams.courseID);
        }

        // Get the total number of questions that match, for data-table pagination.
        // Request up to Javascript Number.MAX_SAFE_INTEGER.
        questionsProvider.getQuestions($scope.filters, { page: 1, limit: 9007199254740991 }).then((questions) => {
            $scope.totalQuestionsMatchingFilters = questions.length;
        });

        // Get the actual questions we want to show on the table for this particular query.
        $scope.questionsPromise = questionsProvider.getQuestions($scope.filters, $scope.query).then((questions) => {
            $scope.loading = false;
            questions = mapValues(questions);
            $scope.questions = questions;

            // Render any math that might be in the questions/answers.
            $timeout(() => {
                MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'questionsTable']);
            }, 250);
        });

        if (!filtering) {
            // Get my courses so that I can typeahead on the courses filter field.
            $scope.courses = coursesProvider.getCourses().then((courses) => {
                $scope.courses = courses;
            });

            // Get my courses so that I can typeahead on the courses filter field.
            $scope.courses = metaProvider.getStatuses().then((statuses) => {
                $scope.statuses = statuses;
            });
        }
    };

    $scope.clearFilters = () => {
        $scope.filters.courses = [];
        $scope.filters.statuses = [];
        $scope.filters.isPublished = null;
        $scope.loadData(true);
    };

    $scope.showNotification = (message, action) => {
        const toast = $mdToast.simple({ hideDelay: 1500 }).textContent(message || 'Saved').action(action || 'Got it');
        $mdToast.show(toast).then();
    };

    $scope.showConfirmDelete = (ev) => {
        const confirm = $mdDialog.confirm()
            .title('Would you like to delete this question?')
            .textContent('This action will permanently delete the question. You may consider unpublishing the question instead to hide it from the student portal.')
            .ariaLabel('Confirm deleting question')
            .targetEvent(ev)
            .ok('Delete Question')
            .cancel('Keep Question');

        $mdDialog.show(confirm).then(() => {
            $scope.deleteQuestion(ev);
            $scope.loadData();
        });
    };

    // Clear selected on tab change or manually clearing.
    $scope.clearSelected = () => {
        $scope.selectedQuestions = [];
        $scope.loadData();
    };

    $scope.changeQuestionPublishStatus = (question, status) => {
        const newData = {};

        if (status === 'unpublished') {
            newData.isPublished = false;
        } else {
            newData.isPublished = true;
        }

        questionsProvider.saveQuestion(newData, question.id).then(() => {
            $scope.showNotification('Question updated');
            $scope.loadData();
        });
    };

    $scope.deleteQuestion = (question) => {
        questionsProvider.deleteQuestion(question).then(() => {
            $scope.showNotification('Question deleted');
            $scope.loadData();
        });
    };

    // Actions to questions triggered by frontend buttons

    // Delete Actions
    $scope.deleteSelected = (ev) => {
        // Thank goodness for string templates for pluralizing.
        const confirm = $mdDialog.confirm()
            .title(`Would you like to delete ${$scope.selectedQuestions.length} question${$scope.selectedQuestions.length > 1 ? 's' : ''}?`)
            // eslint-disable-next-line max-len
            .textContent(`This action will permanently delete ${$scope.selectedQuestions.length} selected the question${$scope.selectedQuestions.length > 1 ? 's' : ''}. You may consider unpublishing the question${$scope.selectedQuestions.length > 1 ? 's' : ''} instead to hide it from the student portal.`)
            .ariaLabel(`Confirm deleting ${$scope.selectedQuestions.length} question${$scope.selectedQuestions.length > 1 ? 's' : ''}`)
            .targetEvent(ev)
            .ok(`Delete Question${$scope.selectedQuestions.length > 1 ? 's' : ''}`)
            .cancel(`Keep Question${$scope.selectedQuestions.length > 1 ? 's' : ''}`);

        $mdDialog.show(confirm).then(() => {
            $scope.selectedQuestions.forEach((question) => {
                $scope.deleteQuestion(question);
            });
            $scope.loadData();
        });
    };
    $scope.delete = (question) => {
        $scope.showConfirmDelete(question);
    };

    // Approve Actions
    $scope.approveSelected = () => {
        $scope.selectedQuestions.forEach((question) => {
            $scope.changeQuestionStatus(question, 'approved');
        });
        $scope.loadData();
    };
    $scope.approve = (question) => {
        $scope.changeQuestionStatus(question, 'approved');
        $scope.loadData();
    };

    // Reject an answer, making it needs revision by the teacher
    $scope.requestReviewOfSelected = () => {
        $scope.selectedQuestions.forEach((question) => {
            $scope.changeQuestionStatus(question, 'need_revision');
        });
        $scope.loadData();
    };
    $scope.requestReview = (question) => {
        $scope.changeQuestionStatus(question, 'need_revision');
        $scope.loadData();
    };

    // Activate Actions
    $scope.publishSelected = () => {
        $scope.selectedQuestions.forEach((question) => {
            // Can't publish questions with no answers!
            if (question.answer) {
                $scope.changeQuestionPublishStatus(question, 'published');
            }
        });
        $scope.loadData();
    };
    $scope.publish = (question) => {
        if (question.currentAnswer) {
            $scope.changeQuestionPublishStatus(question, 'published');
        }
        $scope.loadData();
    };

    // Deactivate Actions
    $scope.unpublishSelected = () => {
        $scope.selectedQuestions.forEach((question) => {
            $scope.changeQuestionPublishStatus(question, 'unpublished');
        });
        $scope.loadData();
    };
    $scope.unpublish = (question) => {
        $scope.changeQuestionPublishStatus(question, 'unpublished');
        $scope.loadData();
    };

    $scope.loadData();
});
