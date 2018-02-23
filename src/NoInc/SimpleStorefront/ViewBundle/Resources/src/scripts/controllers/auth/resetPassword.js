app.controller('resetPasswordController', ($scope, $http, $mdDialog) => {
    $scope.userData = {};

    $scope.saveNewPassword = () => $http.post(`/resetting/reset/${document.getElementById('token').value}`, {
        plainPassword: $scope.userData.password.trim(),
    }).then($scope.resetSuccess, $scope.resetFailure);

    $scope.resetSuccess = (ev) => {
        const confirm = $mdDialog.confirm()
            .title('Password Set')
            .textContent('Your new password has been set.')
            .targetEvent(ev)
            .ok('Go to the FLVS Application');

        $mdDialog.show(confirm).then(() => {
            window.location = '/login';
        });
    };

    $scope.resetFailure = (ev) => {
        const confirm = $mdDialog.confirm()
            .title('Error Saving Password')
            .textContent('We couldn\'t save your new password. Please try again. If you continue to experience issues, contact the administrator to manually set a new password for you.')
            .targetEvent(ev)
            .ok('Try again');

        $mdDialog.show(confirm).then(() => {
            window.location = '/login';
        });
    };
});
