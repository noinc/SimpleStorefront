app.config(($stateProvider, $locationProvider) => {
    // * * *
    // Auth pages
    // * * *

    // These pages are handled by overriding templates in FOSUserBundle

    // * * *
    // End Auth pages
    // * * *


    // * * *
    // Recipe pages
    // Note: The .html template URLs correspond to the Directory
    // structure of the pug templates. Be sure to also create the corresponding
    // route entry in the ViewBundle/config/routing.yml file.
    // * * *

    // Recipe pages
    const allRecipes = {
        name: 'allRecipes',
        url: '/app/recipes',
        templateUrl: '/recipes/allRecipes.html',
        controller: 'allRecipesController',
        data: { pageTitle: 'All Recipes' },
    };

    // * * *
    // End Dashboard pages
    // * * *


    // * * *
    // Apply the states to make Angular aware of them
    // * * *

    // Dashboard home
    $stateProvider.state(allRecipes);

    // General rules and setup.
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false,
    });
}).run(['$rootScope', '$state', '$stateParams', '$http', '$q', ($rootScope, $state, $stateParams) => {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]);
