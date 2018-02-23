<?php

use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Config\Loader\LoaderInterface;
use NoInc\SimpleStorefront\ApiBundle\NoIncSimpleStorefrontApiBundle;
use NoInc\SimpleStorefront\ViewBundle\NoIncSimpleStorefrontViewBundle;

class AppKernel extends Kernel
{
    public function registerBundles()
    {
        $bundles = [
            new Symfony\Bundle\FrameworkBundle\FrameworkBundle(),
            new Symfony\Bundle\SecurityBundle\SecurityBundle(),
            new Symfony\Bundle\TwigBundle\TwigBundle(),
            new Symfony\Bundle\MonologBundle\MonologBundle(),
            new Symfony\Bundle\SwiftmailerBundle\SwiftmailerBundle(),
            new Doctrine\Bundle\DoctrineBundle\DoctrineBundle(),
            new Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle(),
            new ApiPlatform\Core\Bridge\Symfony\Bundle\ApiPlatformBundle(),
            new Nelmio\CorsBundle\NelmioCorsBundle(),
            new FOS\RestBundle\FOSRestBundle(),
            new FOS\UserBundle\FOSUserBundle(),
            new Sensio\Bundle\GeneratorBundle\SensioGeneratorBundle(),

            new NoIncSimpleStorefrontApiBundle(),
            new NoIncSimpleStorefrontViewBundle(),
        ];

        if (in_array($this->getEnvironment(), ['dev', 'qa'], true)) {
            $bundles []= new Symfony\Bundle\DebugBundle\DebugBundle();
            $bundles []= new Symfony\Bundle\WebProfilerBundle\WebProfilerBundle();
            $bundles []= new Sensio\Bundle\DistributionBundle\SensioDistributionBundle();
            $bundles []= new Doctrine\Bundle\FixturesBundle\DoctrineFixturesBundle();
        }

        return $bundles;
    }

    public function getRootDir()
    {
        return __DIR__;
    }

    public function getCacheDir()
    {
        return dirname(__DIR__).'/var/cache/'.$this->getEnvironment();
    }

    public function getLogDir()
    {
        return dirname(__DIR__).'/var/logs';
    }

    public function registerContainerConfiguration(LoaderInterface $loader)
    {
        $loader->load($this->getRootDir().'/config/config_'.$this->getEnvironment().'.yml');
    }
}
