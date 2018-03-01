<?php
namespace NoInc\SimpleStorefront\ViewBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;

class SecurityController extends Controller
{

    /**
     * @Route("/")
     */
    public function homeAction()
    {
        if ( $this->getUser() ) {
            return new RedirectResponse('/app/recipes');
        }

        return new RedirectResponse('/login');
    }

    /**
     * @Route("/login", name="get_login")
     * @Method("GET")
     */
    public function loginAction(Request $request)
    {
        if ( $this->getUser() ) {
            return new RedirectResponse('/app/recipes');
        }

        $error = null;

        return $this->render('NoIncSimpleStorefrontViewBundle::Security/login.html.twig', [
            'error' => null
        ]);
    }

    /**
     * @Route("/logout", name="logout")
     */
    public function logoutAction(Request $request)
    {
        $this->get('security.token_storage')->setToken(null);
        $this->get('request_stack')->getCurrentRequest()->getSession()->invalidate();

        return new RedirectResponse('/login', 307);
    }

    /**
     * @Route("/login", name="post_login")
     * @Method("POST")
     */
    public function loginCheckAction(Request $request)
    {
        $username = $request->request->get('_username');
        $password = $request->request->get('_password');

        $userManager = $this->get('fos_user.user_manager');

        $user = $userManager->findUserByUsername($username);

        if (! $user) {
            $error = 'Username doesnt exists';

            return $this->render('NoIncSimpleStorefrontViewBundle::error.html.twig', [
                'error' => $error
            ]);
        }

        $factory = $this->get('security.encoder_factory');
        $encoder = $factory->getEncoder($user);
        $salt = $user->getSalt();

        if (! $encoder->isPasswordValid($user->getPassword(), $password, $salt)) {
            $error = 'Username or password is not valid';

            return $this->render('NoIncSimpleStorefrontViewBundle::error.html.twig', [
                'error' => $error
            ]);
        }

        $token = new UsernamePasswordToken($user, null, 'main', $user->getRoles());
        $this->get('security.token_storage')->setToken($token);
        $this->get('session')->set('_security_main', serialize($token));

        $event = new InteractiveLoginEvent($request, $token);
        $this->get("event_dispatcher")->dispatch("security.interactive_login", $event);

        return new RedirectResponse('/app/recipes');
    }
}
