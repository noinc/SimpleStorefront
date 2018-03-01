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
 * @ApiResource(iri="http://schema.org/Thing", collectionOperations={"current"={"route_name"="get_user_current"}, "get"={"normalization_context"={"groups"={"get_user"}}, "denormalization_context"={"groups"={"set_user"}}, "method"="GET"}, "post"={"normalization_context"={"groups"={"get_user"}}, "denormalization_context"={"groups"={"set_user"}}, "method"="POST"}}, itemOperations={"get"={"normalization_context"={"groups"={"get_user"}}, "denormalization_context"={"groups"={"set_user"}}, "method"="GET"}, "put"={"normalization_context"={"groups"={"get_user"}}, "denormalization_context"={"groups"={"set_user"}}, "method"="PUT"}, "delete"={"normalization_context"={"groups"={"get_user"}}, "denormalization_context"={"groups"={"set_user"}}, "method"="DELETE"}})
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
     * @Groups({"get_user", "set_user"})
     *
     * @var float
     *
     * @Assert\NotNull
     */
    protected $currentCapital;

    /**
     * @Groups({"get_user", "set_user"})
     *
     * @var string|null
     */
    protected $username;

    /**
     * @Groups({"get_user", "set_user"})
     *
     * @var string|null
     */
    protected $email;

    /**
     * @Groups({"get_user"})
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
     * @Groups({"set_user"})
     *
     * @var string|null
     */
    protected $plainPassword;

    /**
     * @Groups({"get_user"})
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
