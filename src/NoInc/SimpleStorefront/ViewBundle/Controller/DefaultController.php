<?php
namespace NoInc\SimpleStorefront\ViewBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;

class DefaultController extends Controller
{

    /**
     * @Route("/")
     */
    public function homeAction()
    {
        return new Response('<html><body>Home page!</body></html>');
    }

    /**
     * @Route("/login", name="get_login")
     * @Method("GET")
     */
    public function getLoginAction(Request $request)
    {
        if ( $this->getUser() ) {
            return new JsonResponse([
                'success' => true
            ]);
        }

        $error = null;

        return $this->render('NoIncSimpleStorefrontViewBundle::Security/login.html.twig', [
            'error' => null
        ]);
    }

    /**
     * @Route("/login", name="post_login")
     * @Method("POST")
     */
    public function postLoginAction(Request $request)
    {
        $username = $request->request->get('_username');
        $password = $request->request->get('_password');

        $userManager = $this->get('fos_user.user_manager');

        $user = $userManager->findUserByUsername($username);

        if (! $user) {
            return new JsonResponse([
                'error' => 'Username doesnt exists'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $factory = $this->get('security.encoder_factory');
        $encoder = $factory->getEncoder($user);
        $salt = $user->getSalt();

        if (! $encoder->isPasswordValid($user->getPassword(), $password, $salt)) {
            return new JsonResponse([
                'error' => 'Username or password is not valid'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $token = new UsernamePasswordToken($user, null, 'main', $user->getRoles());
        $this->get('security.token_storage')->setToken($token);
        $this->get('session')->set('_security_main', serialize($token));

        $event = new InteractiveLoginEvent($request, $token);
        $this->get("event_dispatcher")->dispatch("security.interactive_login", $event);

        return new JsonResponse([
            'success' => true
        ]);
    }
}
