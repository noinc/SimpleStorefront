<?php

declare(strict_types=1);

namespace NoInc\SimpleStorefront\ApiBundle\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ApiResource(iri="http://schema.org/Thing", collectionOperations={"get"={"normalization_context"={"groups"={"get_ingredient"}}, "denormalization_context"={"groups"={"set_ingredient"}}, "method"="GET"}, "post"={"normalization_context"={"groups"={"get_ingredient"}}, "denormalization_context"={"groups"={"set_ingredient"}}, "method"="POST"}}, itemOperations={"purchase"={"route_name"="put_ingredient_purchase"}, "get"={"normalization_context"={"groups"={"get_ingredient"}}, "denormalization_context"={"groups"={"set_ingredient"}}, "method"="GET"}, "put"={"normalization_context"={"groups"={"get_ingredient"}}, "denormalization_context"={"groups"={"set_ingredient"}}, "method"="PUT"}, "delete"={"normalization_context"={"groups"={"get_ingredient"}}, "denormalization_context"={"groups"={"set_ingredient"}}, "method"="DELETE"}})
 * The most generic type of item.
 *
 * @see http://schema.org/Thing Documentation on Schema.org
 */
class Ingredient
{
    const MEASURE_CUP = 'Cup';
    const MEASURE_EACH = 'Each';

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
     * @Groups({"get_ingredient", "set_ingredient", "get_recipe", "get_recipe_ingredient", "get_product"})
     *
     * @var string|null the name of the item
     */
    protected $name;

    /**
     * @ORM\Column(type="float")
     * @Groups({"get_ingredient", "set_ingredient", "get_recipe", "set_recipe", "get_recipe_ingredient", "get_product"})
     *
     * @var float
     *
     * @Assert\NotNull
     */
    protected $price;

    /**
     * @ORM\Column(type="string", length=180, nullable=false)
     * @Groups({"get_ingredient", "set_ingredient", "get_recipe", "get_recipe_ingredient", "get_product"})
     *
     * @var string
     *
     * @Assert\NotNull
     */
    protected $measure;

    /**
     * @ORM\Column(type="float")
     * @Groups({"get_ingredient", "set_ingredient"})
     *
     * @var float
     *
     * @Assert\NotNull
     */
    protected $stock;

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

    public function setMeasure(string $measure): self
    {
        $this->measure = $measure;

        return $this;
    }

    public function getMeasure(): string
    {
        return $this->measure;
    }

    /**
     * @param float $stock
     */
    public function setStock($stock): self
    {
        $this->stock = $stock;

        return $this;
    }

    /**
     * @return float
     */
    public function getStock()
    {
        return $this->stock;
    }
}
