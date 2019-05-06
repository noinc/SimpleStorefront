<?php
namespace App\DataFixtures\ORM;

use App\Entity\User;
use App\Entity\Ingredient;

class LoadIngredients extends AbstractLoadEntity
{

    protected function newEntity()
    {
        return new Ingredient();
    }

    protected function getData()
    {
        return [
            [
                'measure' => Ingredient::MEASURE_EACH,
                'name' => 'Lemon',
                'price' => 0.10,
                'stock' => 12
            ],
            [
                'measure' => Ingredient::MEASURE_CUP,
                'name' => 'Sugar',
                'price' => 0.10,
                'stock' => 6
            ],
            [
                'measure' => Ingredient::MEASURE_CUP,
                'name' => 'Water',
                'price' => 0.00,
                'stock' => 18
            ]
        ];
    }

    protected function toString($entity)
    {
        return $entity->getName();
    }

}

?>