<?php
namespace NoInc\SimpleStorefront\ApiBundle\DataFixtures\ORM;

use NoInc\SimpleStorefront\ApiBundle\Entity\User;
use NoInc\SimpleStorefront\ApiBundle\Entity\Ingredient;

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