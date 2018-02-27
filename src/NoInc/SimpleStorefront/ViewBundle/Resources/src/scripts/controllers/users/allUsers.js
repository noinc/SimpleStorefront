app.controller('allUsersController', ($scope, $mdDialog, $mdToast, usersProvider) => {
    $scope.selectedUsers = [];
    $scope.loading = false;

    $scope.totalUsersMatchingFilters = null;

    // For table pagination
    $scope.query = {};
    $scope.query.limit = 10;
    $scope.query.page = 1;

    $scope.loadData = () => {
        $scope.loading = true;

        usersProvider.getUsers().then((users) => {
            $scope.totalUsersMatchingFilters = users.length;
        });

        $scope.allUsersPromise = usersProvider.getUsers().then((users) => {
            $scope.users = users;
            $scope.loading = false;
        });
    };

    $scope.showNotification = (message, action) => {
        const toast = $mdToast.simple({ hideDelay: 1500 }).textContent(message || 'Saved').action(action || 'Got it');
        $mdToast.show(toast).then();
    };

    $scope.resetPassword = (ev) => {
        const confirm = $mdDialog.confirm()
            .title('Would you like to send a password reset email?')
            .textContent(`This action will send ${ev.email} a password reset email with a link to set their new password.`)
            .ariaLabel('Send email')
            .targetEvent(ev)
            .ok('Send Email')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(() => {
            usersProvider.sendResetEmail(ev).then(() => {
                $scope.showNotification('Email sent');
            });
        });
    };

    $scope.saveUser = (updatedUser) => {
        usersProvider.updateUser(updatedUser).then((user) => {
            if (user.id) {
                $scope.showNotification('User updated');
            }
            $scope.loadData();
        });
    };

    $scope.changeUserStatus = (user, status) => {
        const updatedUser = {};
        updatedUser.id = user.id;
        updatedUser.enabled = status;

        usersProvider.updateUser(updatedUser).then(() => {
            if (updatedUser.enabled) {
                $scope.showNotification('User enabled');
            } else {
                $scope.showNotification('User disabled');
            }
            usersProvider.getUsers().then((users) => {
                $scope.users = users;
                $scope.loading = false;
            });
        });
    };

    $scope.activateSelected = () => {
        $scope.selectedUsers.forEach((user) => {
            $scope.changeUserStatus(user, true);
        });
    };

    $scope.deactivateSelected = () => {
        $scope.selectedUsers.forEach((user) => {
            $scope.changeUserStatus(user, false);
        });
    };

    $scope.clearSelected = () => {
        $scope.selectedUsers = [];
    };

    $scope.loadData();
});
