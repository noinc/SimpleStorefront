app.factory('recipeProvider', ['$http', ($http) => {
    const getRecipes = $http.get('/api/recipes')
        .then(response => response.data);

    return {
        getRecipes,
    };
}]);
