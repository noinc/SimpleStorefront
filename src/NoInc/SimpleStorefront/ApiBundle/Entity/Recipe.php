<?php

declare(strict_types=1);

namespace NoInc\SimpleStorefront\ApiBundle\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ApiResource(iri="http://schema.org/Recipe", collectionOperations={"get"={"normalization_context"={"groups"={"get_recipe"}}, "denormalization_context"={"groups"={"set_recipe"}}, "method"="GET"}}, itemOperations={"get"={"normalization_context"={"groups"={"get_recipe"}}, "denormalization_context"={"groups"={"set_recipe"}}, "method"="GET"}})
 * A recipe. For dietary restrictions covered by the recipe, a few common restrictions are enumerated via \[\[suitableForDiet\]\]. The \[\[keywords\]\] property can also be used to add more detail.
 *
 * @see http://schema.org/Recipe Documentation on Schema.org
 */
class Recipe
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
     * @ORM\Column(type="string", length=180, nullable=false)
     * @ApiProperty(iri="http://schema.org/name")
     * @Groups({"get_recipe", "set_recipe"})
     *
     * @var string|null the name of the item
     */
    protected $name;

    /**
     * @ORM\Column(type="float")
     * @Groups({"get_recipe", "set_recipe", "get_product"})
     *
     * @var float
     *
     * @Assert\NotNull
     */
    protected $price;

    /**
     * @ORM\ManyToMany(targetEntity="NoInc\SimpleStorefront\ApiBundle\Entity\RecipeIngredient")
     * @ORM\JoinTable(inverseJoinColumns={@ORM\JoinColumn(unique=true)})
     * @ApiProperty(iri="http://schema.org/recipeIngredient")
     * @Groups({"get_recipe", "set_recipe", "get_product"})
     *
     * @var Collection<RecipeIngredient>|null A single ingredient used in the recipe, e.g. sugar, flour or garlic.
     */
    protected $recipeIngredients;

    public function __construct()
    {
        $this->recipeIngredients = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getPrice(): float
    {
        return $this->price;
    }

    public function addRecipeIngredient(RecipeIngredient $recipeIngredient): self
    {
        $this->recipeIngredients[] = $recipeIngredient;

        return $this;
    }

    public function removeRecipeIngredient(RecipeIngredient $recipeIngredient): self
    {
        $this->recipeIngredients->removeElement($recipeIngredient);

        return $this;
    }

    public function getRecipeIngredients(): Collection
    {
        return $this->recipeIngredients;
    }
}
