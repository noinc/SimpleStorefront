<?php
namespace NoInc\SimpleStorefront\ApiBundle\DataFixtures\ORM;

use NoInc\SimpleStorefront\ApiBundle\Entity\User;

class LoadUsers extends AbstractLoadEntity
{

    protected function newEntity()
    {
        $userManager = $this->container->get('fos_user.user_manager');

        $user = $userManager->createUser();

        return $user;
    }

    protected function getData()
    {
        return [
            [
                'username' => 'admin',
                'plainPassword' => 'password',
                'enabled' => true,
                'email' => 'admin@noinc.com',
                'currentCapital' => 100,
                'setRoles' => [ User::ROLE_SUPER_ADMIN, User::ROLE_DEFAULT ]
            ]
        ];
    }

    protected function toString($entity)
    {
        return $entity->getEmail();
    }

}

?>