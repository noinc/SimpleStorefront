<?php
namespace NoInc\SimpleStorefront\ApiBundle\Controller;

use NoInc\SimpleStorefront\ApiBundle\Entity\User;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class UserController extends Controller
{
    /**
     * @Route(
     *     path="/user.{_format}",
     *     name="get_user_current",
     *     defaults={"_api_resource_class"=User::class, "_api_collection_operation_name"="current", "_api_receive"=false}
     * )
     * @Method("GET")
     */
    public function currentAction(Request $request)
    {
        $user = $this->getUser();

        return $user ?: new JsonResponse((object)[]);
    }
}