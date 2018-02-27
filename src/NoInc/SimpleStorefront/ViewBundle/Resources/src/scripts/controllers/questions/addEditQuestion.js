// These are commonly used words to remove from the keyword generation
// from http://99webtools.com/blog/list-of-english-stop-words/
// eslint-disable-next-line max-len
const STOPWORDS = ['a', 'able', 'about', 'across', 'after', 'all', 'almost', 'also', 'am', 'among', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'because', 'been', 'but', 'by', 'can', 'cannot', 'could', 'dear', 'did', 'do', 'does', 'either', 'else', 'ever', 'every', 'for', 'from', 'get', 'got', 'had', 'has', 'have', 'he', 'her', 'hers', 'him', 'his', 'how', 'however', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'just', 'least', 'let', 'like', 'likely', 'may', 'me', 'might', 'most', 'must', 'my', 'neither', 'no', 'nor', 'not', 'of', 'off', 'often', 'on', 'only', 'or', 'other', 'our', 'own', 'rather', 'said', 'say', 'says', 'she', 'should', 'since', 'so', 'some', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'tis', 'to', 'too', 'twas', 'us', 'wants', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'yet', 'you', 'your', 'ain\'t', 'aren\'t', 'can\'t', 'could\'ve', 'couldn\'t', 'didn\'t', 'doesn\'t', 'don\'t', 'hasn\'t', 'he\'d', 'he\'ll', 'he\'s', 'how\'d', 'how\'ll', 'how\'s', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'isn\'t', 'it\'s', 'might\'ve', 'mightn\'t', 'must\'ve', 'mustn\'t', 'shan\'t', 'she\'d', 'she\'ll', 'she\'s', 'should\'ve', 'shouldn\'t', 'that\'ll', 'that\'s', 'there\'s', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'wasn\'t', 'we\'d', 'we\'ll', 'we\'re', 'weren\'t', 'what\'d', 'what\'s', 'when\'d', 'when\'ll', 'when\'s', 'where\'d', 'where\'ll', 'where\'s', 'who\'d', 'who\'ll', 'who\'s', 'why\'d', 'why\'ll', 'why\'s', 'won\'t', 'would\'ve', 'wouldn\'t', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve'];


app.controller('addEditQuestionController', ($scope, $rootScope, $state, $stateParams, $mdToast, $mdDialog, $timeout, coursesProvider, questionsProvider, metaProvider) => {
    $scope.loading = true;

    // Initialize an empty question data object with all the properties
    // that will be filled in by the loadData method.
    $scope.questionData = {};

    // Possible question statuses for approving and rejecting.
    $scope.questionStatuses = [];
    $scope.courses = [];

    // This will be useful for comparing the saved values to the original question values,
    // especially when changing courses in a way that affects user permissions- so that we
    // can manage status and answers seamlessly to the user when they save many changes at once.
    let originalQuestionData = {};

    // Flags for the UI
    $scope.editingQuestion = false;
    $scope.editingCurrentAnswer = false;
    $scope.editingPendingAnswer = false;

    $scope.showQuestionPreview = false;
    $scope.showCurrentAnswerPreview = false;
    $scope.showPendingAnswerPreview = false;

    const confirmDeleteDialog = ev => $mdDialog.confirm(ev)
        .title('Would you like to delete this question?')
        .textContent('This action will permanently delete the question. You may consider unpublishing the question instead to hide it from the student portal.')
        .ariaLabel('Confirm deleting question')
        .targetEvent(ev)
        .ok('Delete Question')
        .cancel('Keep Question');

    const getStatusIdByName = (statusName) => {
        const statusArray = $scope.questionStatuses.filter(status => status.name === statusName);

        if (statusArray && statusArray[0]) {
            return statusArray[0].id;
        }

        return null;
    };

    const dateToHumanString = timestamp => moment.unix(timestamp).format('LLL');

    const dateToTimeAgo = timestamp => moment.unix(timestamp).fromNow();

    // Referenced when loading data, map the API object to be a bit easier to work with here.
    const mapQuestionFromAPIToPage = (question) => {
        const mappedQuestion = {};

        // Get human readable timestamps
        mappedQuestion.askedDate = dateToHumanString(question.askedDate);
        mappedQuestion.timeAgo = dateToTimeAgo(question.askedDate);

        // Map out the meta fields of the question
        const keywordString = question.metas.filter(meta => meta.metaField === 'keywords')[0];
        const quicklaunchString = question.metas.filter(meta => meta.metaField === 'quicklaunch')[0];
        mappedQuestion.keywords = keywordString ? keywordString.value.split(',') : [];
        mappedQuestion.quicklaunch = quicklaunchString ? quicklaunchString.value : '';

        // Map out the question and answer
        mappedQuestion.question = question.textEn;
        mappedQuestion.currentAnswer = question.currentAnswer && question.currentAnswer.textEn ? question.currentAnswer.textEn : null;
        mappedQuestion.pendingAnswer = question.pendingAnswer && question.pendingAnswer.textEn ? question.pendingAnswer.textEn : null;

        // Get the queston course and status.
        mappedQuestion.permission = question.permission;
        mappedQuestion.status = question.status.name;
        mappedQuestion.isPublished = question.isPublished;
        mappedQuestion.course = question.questionSet && question.questionSet.id ? question.questionSet.id : null;

        // Set some flags for the UI based on the presence of question elements.
        if (!mappedQuestion.question) $scope.editingQuestion = true;
        if (!mappedQuestion.currentAnswer) $scope.editingCurrentAnswer = true;
        if (!mappedQuestion.pendingAnswer) $scope.editingPendingAnswer = true;

        // Return the massaged question object.
        return mappedQuestion;
    };

    // Referenced when saving data, map our question object to what the API wants.
    // Do not create key/value pairs for properties that do not exist.
    const mapQuestionPageToAPIObject = (question) => {
        const APIQuestion = {};

        if (question.question) APIQuestion.textEn = question.question;
        if (question.course) APIQuestion.course = question.course;

        // Changes to current answer and pending answer and status rely on the permission this user has for the associated course.
        // Luckily, that permission is updated by the updatePermission method, called when courses change.
        // We also should have the updated permission if the course changes, based on the save method calling changeCourse method.

        if (question.permission === 'EDITOR') {
            if (question.currentAnswer) APIQuestion.currentAnswer = question.currentAnswer;
            if (question.pendingAnswer) APIQuestion.pendingAnswer = question.pendingAnswer;

            // If this was a new question and we're just now answering it, mark it as complete.
            if (originalQuestionData.status && originalQuestionData.status.name === 'NEW' && APIQuestion.currentAnswer) {
                APIQuestion.status = getStatusIdByName('COMPLETE');
            }
        }

        if (question.permission === 'TEACHER') {
            if (question.currentAnswer && (!originalQuestionData.currentAnswer || question.currentAnswer !== originalQuestionData.currentAnswer.textEn)) {
                // If the teacher entered an answer that is different than the currently stored answer or is a new answer
                // then it should be a pending answer and status set to needs approval.
                APIQuestion.pendingAnswer = question.currentAnswer;
                APIQuestion.status = getStatusIdByName('NEEDS_APPROVAL');
            } else if (question.pendingAnswer) {
                APIQuestion.pendingAnswer = question.pendingAnswer;
            }

            if (!originalQuestionData.pendingAnswer && APIQuestion.pendingAnswer) {
                APIQuestion.status = getStatusIdByName('NEEDS_APPROVAL');
            }
        }

        if (question.keywords || question.quicklaunch) {
            APIQuestion.metas = {};
        }

        if (question.keywords) APIQuestion.metas.keywords = question.keywords.join(',');
        if (question.quicklaunch) APIQuestion.metas.quicklaunch = question.quicklaunch;

        // Be careful entering a status here. This should only be used for approving and rejecting.
        if (question.status) APIQuestion.status = question.status;

        return APIQuestion;
    };

    const renderMath = (target) => {
        // Trigger MathJax to render any math on the page. Give the ng-model
        // text a moment to render before rendering the math.
        $timeout(() => {
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, target]);
            $scope.loading = false;
        }, 250);
    };

    const showNotification = (message, action) => {
        const toast = $mdToast.simple({ hideDelay: 1500 }).textContent(message || 'Saved').action(action || 'Got it');
        $mdToast.show(toast);
    };

    const loadData = () => {
        // If this is an existing question, and not a new one.
        if ($stateParams.questionID !== 'new') {
            $scope.loading = true;
            questionsProvider.getQuestionbyId($stateParams.questionID).then((question) => {
                // Save all the values of this question.
                originalQuestionData = { ...question };
                $scope.questionData = mapQuestionFromAPIToPage(question);
                $scope.loading = false;
            });
        } else {
            $scope.editingQuestion = true;
            $scope.editingCurrentAnswer = true;
            $scope.editingPendingAnswer = true;
        }

        // Get my courses so that I can typeahead on the courses field.
        coursesProvider.getCourses().then((courses) => {
            $scope.courses = courses;
        });

        metaProvider.getStatuses().then((statuses) => {
            $scope.questionStatuses = statuses;
        });
    };

    const updateCourse = () => questionsProvider.saveQuestion({ course: $scope.questionData.course }, $stateParams.questionID).then((data) => {
        // Update the permission for this question based on the new course permission.
        $scope.questionData.permission = data.data.permission;
    }).catch((error) => {
        showNotification(`Error updating question: ${error}`, 5000);
    });

    const doSave = (updatedQuestion) => {
        // The factory will take care of new questions and decide whether to POST or PUT.
        questionsProvider.saveQuestion(updatedQuestion, $stateParams.questionID).then((data) => {
            showNotification($stateParams.questionID === 'new' ? 'Question saved' : 'Question updated');
            if (data.data.id) {
                if (!$scope.inWorkflow) {
                    $state.go('addEditQuestion', { questionID: data.data.id });
                }
            }
            // Refresh the page!
            loadData();
        }).catch((error) => {
            showNotification(`Error updating question: ${error}`);
        });
    };

    // Stuff to deal with if we're in a workflow.
    if ($state.current.data.workflow) {
        const refreshQuestionsList = () => {
            questionsProvider.getQuestions($scope.filters, { page: 1, limit: 9007199254740991 }).then((questions) => {
                // Figure out the first unanaswered question for the quick workflow.
                $rootScope.newQuestions = questions.filter(question => question.status.name === 'NEW');
                $rootScope.firstNewQuestionId = $rootScope.newQuestions && $rootScope.newQuestions[0] ? $rootScope.newQuestions[0].id : null;

                $rootScope.needsApprovalQuestions = questions.filter(question => question.status.name === 'NEEDS_APPROVAL' && question.permission === 'EDITOR');
                $rootScope.firstNeedsApprovalQuestionId = $rootScope.needsApprovalQuestions && $rootScope.needsApprovalQuestions[0] ? $rootScope.needsApprovalQuestions[0].id : null;

                $scope.nextQuestionId = null;
                if ($state.current.data.questionState === 'NEW') {
                    $rootScope.newQuestions.forEach((question, index) => {
                        if (question.id === parseInt($stateParams.questionID, 0) && $rootScope.newQuestions[index + 1]) {
                            $scope.nextQuestionId = $rootScope.newQuestions[index + 1].id;
                        }
                    });
                } else if ($state.current.data.questionState === 'NEEDS_APPROVAL') {
                    $rootScope.needsApprovalQuestions.forEach((question, index) => {
                        if (question.id === parseInt($stateParams.questionID, 0) && $rootScope.needsApprovalQuestions[index + 1]) {
                            $scope.nextQuestionId = $rootScope.needsApprovalQuestions[index + 1].id;
                        }
                    });
                }
            });
        };

        $scope.nextQuestion = () => {
            $state.go($state.current.name, { questionID: $scope.nextQuestionId });
        };

        $scope.saveAndContinue = () => {
            $scope.saveEdits('answer');
            $state.go($state.current.name, { questionID: $scope.nextQuestionId });
        };

        $scope.saveAndFinish = () => {
            $scope.saveEdits('answer');
            $state.go('allQuestions');
        };

        $scope.inWorkflow = true;
        refreshQuestionsList();
    }

    // Auto generate keywords from the question text.
    $scope.updateKeywords = () => {
        // Empty the keywords.
        $scope.questionData.keywords = [];

        // Perform a variety of operations to remove HTML and Math from
        // the question to get the raw keywords.
        let string = $scope.questionData.question;
        string = string.replace(/[$$].*[$$]/g, ''); // remove TEX
        string = string.replace(/[`].*[`]/g, ''); // remove ASCIIMath
        string = string.replace(/<\/?[^>]+(>|$)/g, ''); // remove HTML and MathML
        string = string.replace(/[&#34;]/g, ''); // remove escaped quotes

        const keywords = string.trim().split(' ');

        // Add new keywords into the list of keywords if they're not there
        // and they are not a stop words
        keywords.forEach((keyword) => {
            keyword = keyword.match(/('\w|\w)/g); // remove punctuation but keep apostrophes
            if (keyword) {
                keyword = keyword.join('').toLowerCase();
                if ($scope.questionData.keywords.indexOf(keyword) === -1 && STOPWORDS.indexOf(keyword) === -1) {
                    $scope.questionData.keywords.push(keyword);
                }
            }
        });
    };

    $scope.showMathHelp = () => {
        $mdDialog.show({
            templateUrl: '/partials/mathHelp.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: true,
            controller: () => {
                setTimeout(() => {
                    renderMath('exampleTex');
                    renderMath('exampleAsciimath');
                }, 250);
                $scope.hide = () => {
                    $mdDialog.hide();
                };
            },
        });
    };

    $scope.updatePermission = () => {
        if ($scope.questionData.course !== null) {
            [$scope.questionData.permission] = $scope.courses.filter(c => c.id === $scope.questionData.course).map(r => r.permission);
        } else {
            $scope.questionData.permission = null;
        }
    };

    $scope.editField = (section) => {
        if (section === 'question') {
            $scope.editingQuestion = true;
            $scope.showQuestionPreview = false;
        } else if (section === 'answer') {
            $scope.editingCurrentAnswer = true;
            $scope.showCurrentAnswerPreview = false;
        } else if (section === 'pending') {
            $scope.editingPendingAnswer = true;
            $scope.showPendingAnswerPreview = false;
        }
    };

    $scope.togglePreview = (section) => {
        if (section === 'question') {
            $scope.showQuestionPreview = !$scope.showQuestionPreview;
        } else if (section === 'answer') {
            $scope.showCurrentAnswerPreview = !$scope.showCurrentAnswerPreview;
        } else if (section === 'pending') {
            $scope.showPendingAnswerPreview = !$scope.showPendingAnswerPreview;
        }
    };

    $scope.discardEdits = (section) => {
        // Reset question edit data where appropriate
        if (section === 'question') {
            $scope.questionData.question = originalQuestionData.textEn;
            $scope.editingQuestion = false;
            $scope.showQuestionPreview = false;
            renderMath('questionText');
        } else if (section === 'answer') {
            $scope.questionData.currentAnswer = originalQuestionData.currentAnswer && originalQuestionData.currentAnswer.textEn ? originalQuestionData.currentAnswer.textEn : null;
            if ($scope.questionData.currentAnswer) $scope.editingCurrentAnswer = false;
            $scope.showCurrentAnswerPreview = false;
            renderMath('answerText');
        } else if (section === 'pending') {
            $scope.questionData.pendingAnswer = originalQuestionData.pendingAnswer && originalQuestionData.pendingAnswer.textEn ? originalQuestionData.pendingAnswer.textEn : null;
            if ($scope.questionData.pendingAnswer) $scope.editingPendingAnswer = false;
            $scope.showPendingAnswerPreview = false;
            renderMath('pendingAnswerText');
        }
    };

    $scope.saveEdits = (section) => {
        if ($stateParams.questionID === 'new') {
            $scope.saveQuestion();
        } else if (section === 'question') {
            $scope.editingQuestion = false;
            $scope.updateKeywords();
            updateCourse().then(() => {
                doSave(mapQuestionPageToAPIObject({ keywords: $scope.questionData.keywords, question: $scope.questionData.question, permission: $scope.questionData.permission }));
            });
        } else if (section === 'answer') {
            $scope.editingCurrentAnswer = false;
            updateCourse().then(() => {
                doSave(mapQuestionPageToAPIObject({ currentAnswer: $scope.questionData.currentAnswer, permission: $scope.questionData.permission }));
            });
        } else if (section === 'pending') {
            $scope.editingPendingAnswer = false;
            updateCourse().then(() => {
                doSave(mapQuestionPageToAPIObject({ pendingAnswer: $scope.questionData.pendingAnswer, permission: $scope.questionData.permission }));
            });
        }
    };

    $scope.togglePublishStatus = () => {
        questionsProvider.saveQuestion({ isPublished: $scope.questionData.isPublished }, $stateParams.questionID).then((data) => {
            if (data.data.isPublished) {
                showNotification('Question published');
            } else {
                showNotification('Question unpublished');
            }
            // Refresh the page!
            loadData();
        }).catch((error) => {
            showNotification(`Error updating question: ${error}`, 5000);
        });
    };

    $scope.showConfirmDeleteDialog = () => {
        $mdDialog.show(confirmDeleteDialog).then(() => {
            questionsProvider.deleteQuestion($scope.questionData).then(() => {
                showNotification('Question deleted');
                $state.go('allQuestions');
            }).catch((error) => {
                showNotification(`Error deleting question: ${error} Try Again?`, 5000);
            });
        });
    };

    // Same save method for all parts of the question.
    $scope.saveQuestion = () => {
        // For new questions, permission should follow the selected course.
        // For existing questions, we need to tell the API to change the course first and then update the rest of the question according to the new permission.
        // The API will reject changes if we change course/permission and all of the other data points in one post.
        $scope.updateKeywords();
        if ($stateParams.questionID === 'new') {
            doSave(mapQuestionPageToAPIObject($scope.questionData));
        } else {
            updateCourse().then(() => {
                doSave(mapQuestionPageToAPIObject($scope.questionData));
            });
        }
    };

    // omg functional programming <3
    $scope.approveAnswer = () => {
        updateCourse().then(() => {
            doSave({ status: getStatusIdByName('COMPLETE'), currentAnswer: $scope.questionData.pendingAnswer });
        });
    };

    $scope.rejectAnswer = () => {
        updateCourse().then(() => {
            doSave({ status: getStatusIdByName('REJECTED') });
        });
    };

    // Initialize the data
    loadData();
});
