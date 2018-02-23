<?php

namespace NoInc\SimpleStorefront\ViewBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class NoIncSimpleStorefrontViewBundle extends Bundle
{
    public function getParent()
    {
        return 'FOSUserBundle';
    }
}
