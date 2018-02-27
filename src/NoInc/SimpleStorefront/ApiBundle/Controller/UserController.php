<?php
namespace NoInc\SimpleStorefront\ApiBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class UserController extends Controller
{
    /**
     * @Route("/users/current", name="get_user_current")
     * @Method("GET")
     */
    public function currentAction(Request $request)
    {
        $user = $this->getUser();

        return $user;
    }
}