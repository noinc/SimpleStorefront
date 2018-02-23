app.controller('myProfileController', ($scope, $rootScope, $mdToast, usersProvider, $stateParams, $mdDialog) => {
    const emailTaken = fields => $mdDialog.confirm()
        .title(`Chosen ${fields.join(' and ')} taken`)
        .textContent(`A user is already associated with that ${fields.join(' and ')}. Try another ${fields.join(' and ')}.`)
        .ariaLabel('Acknowledge')
        .ok('Ok');

    const showUpdateError = (error) => {
        $rootScope.pendingXHR = false;
        const fields = [];
        error.data.violations.forEach(prop => fields.push(prop.propertyPath));
        $mdDialog.show(emailTaken(fields)).then(() => $scope.loadData());
    };

    // Same save method for all parts of the question.
    $scope.saveUser = () => {
        const updatedUser = {};
        updatedUser.username = $scope.userData.editedName ? $scope.userData.editedName : $scope.userData.username;
        updatedUser.email = $scope.userData.editedEmail ? $scope.userData.editedEmail : $scope.userData.email;

        // Untoggle the appropriate editing section
        $scope.editingEmail = $scope.editingEmail ? !$scope.editingEmail : $scope.editingEmail;
        $scope.editingName = $scope.editingName ? !$scope.editingName : $scope.editingName;

        if ($scope.userData.password && ($scope.userData.password === $scope.userData.confirmPassword)) {
            updatedUser.plainPassword = $scope.userData.password.trim();
        }

        usersProvider.updateUserProfile(updatedUser, $stateParams.userID).then(() => {
            $scope.showNotification('Profile Updated');
            $scope.loadData();
        }).catch(showUpdateError);
    };

    $scope.loadData = () => {
        usersProvider.getUserProfile($stateParams.userID).then((userData) => {
            $scope.userData = userData;
        });
    };

    // Toggle editing sections
    $scope.toggleName = () => {
        $scope.editingName = !$scope.editingName;
        $scope.userData.editedName = $scope.userData.username;
        angular.element(document.getElementById('user-name')).focus();
    };

    $scope.toggleEmail = () => {
        $scope.editingEmail = !$scope.editingEmail;
        $scope.userData.editedEmail = $scope.userData.email;
        angular.element(document.getElementById('user-email')).focus();
    };

    $scope.discardEdits = (section) => {
        // Reset question edit data where appropriate
        if (section === 'name') {
            $scope.userData.editedName = null;
            $scope.editingName = false;
        } else if (section === 'email') {
            $scope.userData.editedEmail = null;
            $scope.editingEmail = false;
        }
    };

    $scope.showNotification = (message, action, delay) => {
        const toast = $mdToast.simple({ hideDelay: delay || 1500 }).textContent(message || 'Saved').action(action || 'Got it');
        $mdToast.show(toast);
    };

    $scope.loadData();
});
