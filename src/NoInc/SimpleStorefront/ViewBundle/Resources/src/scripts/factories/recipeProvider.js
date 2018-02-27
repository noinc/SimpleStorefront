app.factory('recipeProvider', ($http) => {
    const getRecipes = () => {
        return $http.get('/api/recipes')
            .then((response) => {
                return response.data;
            });
    };

    return {
        getRecipes,
    };
});
