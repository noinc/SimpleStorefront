app.controller('forgotPasswordController', ($scope, $mdDialog, $http) => {
    $scope.user = () => {};

    $scope.requestPasswordReset = () => $http.post('/resetting/send-email', { username: $scope.user.username.toLowerCase().trim() })
        .then($scope.resetRequested, $scope.resetRequested);

    // Regardless of success or failure, we want to just show a message that a reset
    // was sent to that email if it exists.
    $scope.resetRequested = (ev) => {
        const confirm = $mdDialog.confirm()
            .title('Reset Requested')
            .textContent('Check your email for a link to reset your password. You may only request a reset once every 2 hours.')
            .targetEvent(ev)
            .ok('Go back to login');

        $mdDialog.show(confirm).then(() => {
            window.location = '/login';
        });
    };
});
