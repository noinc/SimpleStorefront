<?php

declare(strict_types=1);

namespace NoInc\SimpleStorefront\ApiBundle\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ApiResource(iri="http://schema.org/Product", collectionOperations={"get"={"normalization_context"={"groups"={"get_product"}}, "denormalization_context"={"groups"={"set_product"}}, "method"="GET"}, "post"={"normalization_context"={"groups"={"get_product"}}, "denormalization_context"={"groups"={"set_product"}}, "method"="POST"}}, itemOperations={"get"={"normalization_context"={"groups"={"get_product"}}, "denormalization_context"={"groups"={"set_product"}}, "method"="GET"}, "put"={"normalization_context"={"groups"={"get_product"}}, "denormalization_context"={"groups"={"set_product"}}, "method"="PUT"}, "delete"={"normalization_context"={"groups"={"get_product"}}, "denormalization_context"={"groups"={"set_product"}}, "method"="DELETE"}}, attributes={"filters"={"product.recipe_filter"}, "normalization_context"={"groups"={""}}, "denormalization_context"={"groups"={""}}})
 * Any offered product or service. For example: a pair of shoes; a concert ticket; the rental of a car; a haircut; or an episode of a TV show streamed online.
 *
 * @see http://schema.org/Product Documentation on Schema.org
 */
class Product
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
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"get_product", "set_product"})
     *
     * @var \DateTimeInterface|null
     *
     * @Assert\DateTime
     */
    protected $createdAt;

    /**
     * @ORM\ManyToOne(targetEntity="NoInc\SimpleStorefront\ApiBundle\Entity\Recipe")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"get_product", "set_product"})
     *
     * @var Recipe|null
     */
    protected $recipe;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setCreatedAt(?\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setRecipe(?Recipe $recipe): self
    {
        $this->recipe = $recipe;

        return $this;
    }

    public function getRecipe(): ?Recipe
    {
        return $this->recipe;
    }
}
