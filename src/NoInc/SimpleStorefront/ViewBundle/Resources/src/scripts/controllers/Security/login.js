app.controller('loginController', ($scope, $http) => {
    $scope.user = {
        username: null,
        password: null,
    };

    $scope.login = () => $http.post('/login', {
        _username: $scope.user.username.toLowerCase().trim(),
        _password: $scope.user.password.trim(),
    }).then(window.location.reload());
});
