app.factory('recipeProvider', ($http) => {
    // eslint-disable-next-line arrow-body-style
    const getRecipes = () => {
        return $http.get('/api/recipes').then(response => response.data);
    };

    return {
        getRecipes,
    };
});
