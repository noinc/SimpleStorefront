<?php
namespace App\DataFixtures\ORM;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\PropertyAccess\PropertyAccess;

abstract class AbstractLoadEntity extends Fixture implements ContainerAwareInterface
{

    protected $container;

    protected $accessor;

    protected $manager;

    abstract protected function newEntity();

    abstract protected function getData();

    abstract protected function toString($entity);

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    public function load(ObjectManager $manager)
    {
        $this->manager = $manager;

        $this->accessor = PropertyAccess::createPropertyAccessor();

        foreach ($this->getData() as $data) {
            $this->update($this->newEntity(), $data);
        }

        $this->manager->flush();
    }

    protected function update($entity, array $data)
    {
        foreach ($data as $property => $value) {

            try {
                $this->accessor->setValue($entity, $property, $value);
            } catch (\Symfony\Component\PropertyAccess\Exception\NoSuchPropertyException $ex) {
                $entity->{$property} = $value;
            } catch (\Exception $ex) {
                throw new \Exception("Error at property $property: " . $ex->getMessage());
            }
        }

        $this->manager->persist($entity);

        $toString = $this->toString($entity);
        if ($toString) {
            $reference = get_class($entity) . ':' . $toString;
            $this->setReference($reference, $entity);
        }
    }
}
