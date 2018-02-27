app.controller('allRecipesController', ($scope, recipeProvider) => {
    $scope.recipes = [];

    recipeProvider.getRecipes().then((res) => {
        $scope.recipes = res;
    });
});
