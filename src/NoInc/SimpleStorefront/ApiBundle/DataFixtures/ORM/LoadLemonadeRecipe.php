<?php
namespace NoInc\SimpleStorefront\ApiBundle\DataFixtures\ORM;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use NoInc\SimpleStorefront\ApiBundle\Entity\Ingredient;
use NoInc\SimpleStorefront\ApiBundle\Entity\RecipeIngredient;
use NoInc\SimpleStorefront\ApiBundle\Entity\Recipe;

class LoadLemonadeRecipe extends Fixture
{

    public function load(ObjectManager $manager)
    {
        $recipe = new Recipe();
        $recipe->setName('Lemonade');
        $recipe->setPrice(1.00);

        $recipeIngredients = [
            [
                'ingredient' => $this->getReference(Ingredient::class . ':Sugar'),
                'quantity' => 1
            ],
            [
                'ingredient' => $this->getReference(Ingredient::class . ':Lemon'),
                'quantity' => 2
            ],
            [
                'ingredient' => $this->getReference(Ingredient::class . ':Water'),
                'quantity' => 3
            ]
        ];

        foreach ( $recipeIngredients as $recipeIngredientData ) {
            $recipeIngredient = new RecipeIngredient();

            $recipeIngredient->setIngredient($recipeIngredientData['ingredient']);
            $recipeIngredient->setQuantity($recipeIngredientData['quantity']);

            $manager->persist($recipeIngredient);

            $recipe->addRecipeIngredient($recipeIngredient);
        }

        $manager->persist($recipe);
        $manager->flush();
    }

}

?>