app.config(($stateProvider, $locationProvider) => {
    // * * *
    // Auth pages
    // * * *

    // These pages are handled by overriding templates in FOSUserBundle

    // * * *
    // End Auth pages
    // * * *


    // * * *
    // Dashboard pages
    // * * *

    // Dashboard for everyone.
    const dashboard = {
        name: 'dashboard',
        url: '/app/dashboard',
        templateUrl: '/dashboard/home.html',
        controller: 'dashboardController',
        data: { pageTitle: 'Admin Dashboard' },
    };

    // Course pages
    const allCourses = {
        name: 'allCourses',
        url: '/app/courses',
        templateUrl: '/courses/allCourses.html',
        controller: 'allCoursesController',
        data: { pageTitle: 'Manage Courses' },
    };

    const myCourses = {
        name: 'myCourses',
        url: '/app/my-courses',
        templateUrl: '/courses/myCourses.html',
        controller: 'myCoursesController',
        data: { pageTitle: 'My Courses' },
    };

    const addEditCourse = {
        name: 'addEditCourse',
        url: '/app/course/edit/{courseID}',
        templateUrl: '/courses/addEditCourse.html',
        controller: 'addEditCourseController',
        data: { pageTitle: 'Edit Course' },
    };

    const viewMyCourse = {
        name: 'viewMyCourse',
        url: '/app/course/{courseID}',
        templateUrl: '/courses/viewMyCourse.html',
        controller: 'viewMyCourseController',
        data: { pageTitle: 'View Course' },
    };

    // User pages
    const allUsers = {
        name: 'allUsers',
        url: '/app/users',
        templateUrl: '/users/allUsers.html',
        controller: 'allUsersController',
        data: { pageTitle: 'Manage Users' },
    };

    const addEditUser = {
        name: 'addEditUser',
        url: '/app/user/{userID}',
        templateUrl: '/users/addEditUser.html',
        controller: 'addEditUserController',
        data: { pageTitle: 'Edit User' },
    };

    const myProfile = {
        name: 'myProfile',
        url: '/app/profile/{userID}',
        templateUrl: '/users/myProfile.html',
        controller: 'myProfileController',
        data: { pageTitle: 'My Profile' },
    };

    // Questions pages
    const questions = {
        name: 'allQuestions',
        url: '/app/questions?status',
        templateUrl: '/questions/allQuestions.html',
        controller: 'questionsController',
        data: { pageTitle: 'My Questions' },
    };

    const questionsAdmin = {
        name: 'allQuestionsAdmin',
        url: '/app/questions?status',
        templateUrl: '/questions/allQuestions.html',
        controller: 'questionsController',
        data: { pageTitle: 'Manage Questions' },
    };

    const addEditQuestion = {
        name: 'addEditQuestion',
        url: '/app/question/{questionID}',
        templateUrl: '/questions/addEditQuestion.html',
        controller: 'addEditQuestionController',
        data: { pageTitle: 'Edit Question' },
    };

    const unansweredWorkflow = {
        name: 'unansweredWorkflow',
        url: '/app/workflow/unanaswered/{questionID}',
        templateUrl: '/questions/addEditQuestion.html',
        controller: 'addEditQuestionController',
        data: {
            pageTitle: 'Questions Workflow',
            workflow: true,
            workflowType: 'Unanswered Questions',
            questionState: 'NEW',
        },
    };

    const needsApprovalWorkflow = {
        name: 'needsApprovalWorkflow',
        url: '/app/workflow/needs-approval/{questionID}',
        templateUrl: '/questions/addEditQuestion.html',
        controller: 'addEditQuestionController',
        data: {
            pageTitle: 'Questions Workflow',
            workflow: true,
            workflowType: 'Questions Needing Approval',
            questionState: 'NEEDS_APPROVAL',
        },
    };
    // * * *
    // End Dashboard pages
    // * * *


    // * * *
    // Apply the states to make Angular aware of them
    // * * *

    // Dashboard home
    $stateProvider.state(dashboard);

    // Courses
    $stateProvider.state(allCourses);
    $stateProvider.state(myCourses);
    $stateProvider.state(addEditCourse);
    $stateProvider.state(viewMyCourse);

    // Users
    $stateProvider.state(allUsers);
    $stateProvider.state(addEditUser);
    $stateProvider.state(myProfile);

    // Questions
    $stateProvider.state(questions);
    $stateProvider.state(questionsAdmin);
    $stateProvider.state(addEditQuestion);
    $stateProvider.state(unansweredWorkflow);
    $stateProvider.state(needsApprovalWorkflow);

    // General rules and setup.
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false,
    });
}).run(['$rootScope', '$state', '$stateParams', '$http', '$q', ($rootScope, $state, $stateParams) => {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]);
