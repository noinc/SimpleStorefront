<?php
/*
 * This file is part of the API Platform project.
 *
 * (c) Kévin Dunglas <dunglas@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
declare(strict_types=1);
namespace NoInc\SimpleStorefront\ApiBundle\Generator;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\SchemaGenerator\AnnotationGenerator\AbstractAnnotationGenerator;
/**
 * Symfony Serializer Groups annotation generator.
 *
 * @author Youssef El Montaser <youssef@elmontaser.com>
 * @author Kévin Dunglas <dunglas@gmail.com>
 *
 * @see https://symfony.com/doc/master/components/serializer.html
 */
final class SerializerGroupsAnnotationGenerator extends AbstractAnnotationGenerator
{
    /**
     * {@inheritdoc}
     */
    public function generateFieldAnnotations(string $className, string $fieldName): array
    {
        if (null === $field = $this->config['types'][$className]['properties'] ?? null) {
            return [];
        }
        if (false === $this->classes[$className]['fields'][$fieldName]['isId'] && $groups = $field[$fieldName]['groups'] ?? false) {
            return [sprintf('@Groups({"%s"})', implode('", "', $groups))];
        } elseif (true === $this->classes[$className]['fields'][$fieldName]['isId']) {
            $groups = $this->config['id']['groups'];
            if ( !empty($groups) ) {
                return [sprintf('@Groups({"%s"})', implode('", "', $groups))];
            }
        }
        return [];
    }
    /**
     * {@inheritdoc}
     */
    public function generateUses(string $className): array
    {
        return [Groups::class];
    }
}