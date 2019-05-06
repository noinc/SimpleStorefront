<?php
namespace App\DataFixtures\ORM;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use App\Entity\Ingredient;
use App\Entity\RecipeIngredient;
use App\Entity\Recipe;

class LoadLemonadeRecipe2 extends Fixture
{

    public function load(ObjectManager $manager)
    {
        $recipe = new Recipe();
        $recipe->setName('Lemonade2');
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