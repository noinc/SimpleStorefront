app.controller('loginController', ($scope, $http) => {
    $scope.user = () => {};

    $scope.login = () => $http.post('/login_check', {
        _username: $scope.user.username.toLowerCase().trim(),
        _password: $scope.user.password.trim(),
        _csrf_token: document.getElementById('csrf').value,
    }).then(() => window.location.reload());
});
