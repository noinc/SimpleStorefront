<?php

declare(strict_types=1);

namespace NoInc\SimpleStorefront\ApiBundle\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @UniqueEntity(fields={"email"})
 * @UniqueEntity(fields={"username"})
 * @ORM\Entity
 * @ORM\Table(name="users")
 * @ApiResource(iri="http://schema.org/Thing", collectionOperations={"get"={"method"="GET", "normalization_context"={"groups"={"output"}}, "denormalization_context"={"groups"={"input"}}}, "post"={"method"="POST", "normalization_context"={"groups"={"output"}}, "denormalization_context"={"groups"={"input"}}}}, itemOperations={"current"={"route_name"="get_user_current"}, "get"={"method"="GET", "normalization_context"={"groups"={"output"}}, "denormalization_context"={"groups"={"input"}}}, "put"={"method"="PUT", "normalization_context"={"groups"={"output"}}, "denormalization_context"={"groups"={"input"}}}, "delete"={"method"="DELETE", "normalization_context"={"groups"={"output"}}, "denormalization_context"={"groups"={"input"}}}})
 * The most generic type of item.
 *
 * @see http://schema.org/Thing Documentation on Schema.org
 */
class User extends \FOS\UserBundle\Model\User
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
     * @Groups({"output", "input"})
     *
     * @var float
     *
     * @Assert\NotNull
     */
    protected $currentCapital;

    /**
     * @Groups({"output", "input"})
     *
     * @var string|null
     */
    protected $username;

    /**
     * @Groups({"output", "input"})
     *
     * @var string|null
     */
    protected $email;

    /**
     * @Groups({"output"})
     *
     * @var bool|null
     */
    protected $enabled;

    /**
     * @var string|null
     */
    protected $salt;

    /**
     * @var string|null
     */
    protected $password;

    /**
     * @Groups({"input"})
     *
     * @var string|null
     */
    protected $plainPassword;

    /**
     * @Groups({"output"})
     *
     * @var \DateTimeInterface|null
     *
     * @Assert\DateTime
     */
    protected $lastLogin;

    /**
     * @var string|null
     */
    protected $confirmationToken;

    /**
     * @var string|null
     */
    protected $passwordRequestedAt;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setCurrentCapital(float $currentCapital): self
    {
        $this->currentCapital = $currentCapital;

        return $this;
    }

    public function getCurrentCapital(): float
    {
        return $this->currentCapital;
    }
}
