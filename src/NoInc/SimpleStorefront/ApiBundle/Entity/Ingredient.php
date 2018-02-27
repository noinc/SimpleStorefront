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
 * @ApiResource(iri="http://schema.org/Thing", collectionOperations={"get"={"method"="GET", "normalization_context"={"groups"={"output"}}, "denormalization_context"={"groups"={"input"}}}, "post"={"method"="POST", "normalization_context"={"groups"={"output"}}, "denormalization_context"={"groups"={"input"}}}}, itemOperations={"get"={"method"="GET", "normalization_context"={"groups"={"output"}}, "denormalization_context"={"groups"={"input"}}}, "put"={"method"="PUT", "normalization_context"={"groups"={"output"}}, "denormalization_context"={"groups"={"input"}}}, "delete"={"method"="DELETE", "normalization_context"={"groups"={"output"}}, "denormalization_context"={"groups"={"input"}}}})
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
     * @Groups({"output", "input"})
     *
     * @var string|null the name of the item
     */
    protected $name;

    /**
     * @ORM\Column(type="float")
     * @Groups({"output", "input"})
     *
     * @var float
     *
     * @Assert\NotNull
     */
    protected $price;

    /**
     * @ORM\Column(type="string", length=180, nullable=false)
     * @Groups({"output", "input"})
     *
     * @var string
     *
     * @Assert\NotNull
     */
    protected $measure;

    /**
     * @ORM\Column(type="float")
     * @Groups({"output", "input"})
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

    public function setStock(float $stock): self
    {
        $this->stock = $stock;

        return $this;
    }

    public function getStock(): float
    {
        return $this->stock;
    }
}
