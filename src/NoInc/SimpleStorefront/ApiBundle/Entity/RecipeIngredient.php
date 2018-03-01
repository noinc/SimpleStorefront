<?php

declare(strict_types=1);

namespace NoInc\SimpleStorefront\ApiBundle\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ApiResource(iri="http://schema.org/Thing", collectionOperations={"get"={"normalization_context"={"groups"={"get_recipe_ingredient"}}, "denormalization_context"={"groups"={"set_recipe_ingredient"}}, "method"="GET"}, "post"={"normalization_context"={"groups"={"get_recipe_ingredient"}}, "denormalization_context"={"groups"={"set_recipe_ingredient"}}, "method"="POST"}}, itemOperations={"get"={"normalization_context"={"groups"={"get_recipe_ingredient"}}, "denormalization_context"={"groups"={"set_recipe_ingredient"}}, "method"="GET"}, "put"={"normalization_context"={"groups"={"get_recipe_ingredient"}}, "denormalization_context"={"groups"={"set_recipe_ingredient"}}, "method"="PUT"}, "delete"={"normalization_context"={"groups"={"get_recipe_ingredient"}}, "denormalization_context"={"groups"={"set_recipe_ingredient"}}, "method"="DELETE"}})
 * The most generic type of item.
 *
 * @see http://schema.org/Thing Documentation on Schema.org
 */
class RecipeIngredient
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     * @Groups({"output"})
     *
     * @var int|null
     */
    protected $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"get_recipe_ingredient", "set_recipe_ingredient", "get_recipe", "set_recipe", "get_product"})
     *
     * @var float
     *
     * @Assert\NotNull
     */
    protected $quantity;

    /**
     * @ORM\ManyToOne(targetEntity="NoInc\SimpleStorefront\ApiBundle\Entity\Ingredient")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"get_recipe_ingredient", "set_recipe_ingredient", "get_recipe", "set_recipe", "get_product"})
     *
     * @var Ingredient|null
     */
    protected $ingredient;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setQuantity(float $quantity): self
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getQuantity(): float
    {
        return $this->quantity;
    }

    public function setIngredient(?Ingredient $ingredient): self
    {
        $this->ingredient = $ingredient;

        return $this;
    }

    public function getIngredient(): ?Ingredient
    {
        return $this->ingredient;
    }
}
