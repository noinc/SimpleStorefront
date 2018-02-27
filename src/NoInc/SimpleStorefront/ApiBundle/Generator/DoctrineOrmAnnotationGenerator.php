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
use ApiPlatform\SchemaGenerator\CardinalitiesExtractor;
use ApiPlatform\SchemaGenerator\TypesGenerator;
use ApiPlatform\SchemaGenerator\AnnotationGenerator\AbstractAnnotationGenerator;
/**
 * Doctrine annotation generator.
 *
 * @author Kévin Dunglas <dunglas@gmail.com>
 */
final class DoctrineOrmAnnotationGenerator extends AbstractAnnotationGenerator
{
    /**
     * {@inheritdoc}
     */
    public function generateClassAnnotations(string $className): array
    {
        $annotations = [''];
        $class = $this->classes[$className];
        if ($class['isEnum']) {
            return [];
        }
        if (isset($class['config']['uniqueEntity']) && !empty($class['config']['uniqueEntity'])) {
            $list = $class['config']['uniqueEntity'];
            foreach ( $list as $listItem ) {
                if ( is_string($listItem) ) {
                    $annotations []= sprintf('@UniqueEntity(fields={"%s"})', $listItem);
                } elseif ( is_array($listItem) ) {
                    $annotations []= sprintf('@UniqueEntity(fields={"%s"})', implode('", "', $listItem));
                }
            }
        }
        if (isset($class['config']['doctrine']['inheritanceMapping']) && !empty($class['config']['doctrine']['inheritanceMapping'])) {
            $inheritanceMapping = $class['config']['doctrine']['inheritanceMapping'];
            $annotations = array_merge($annotations, $inheritanceMapping);
        } else {
            $inheritanceMapping = '@ORM\Entity';
            if ($class['abstract']) {
                $inheritanceMapping = '@ORM\MappedSuperclass';
            }
            if ($class['embeddable']) {
                $inheritanceMapping = '@ORM\Embeddable';
            }
            $annotations []= $inheritanceMapping;
        }
        if (isset($class['config']['tableName']) && !empty($class['config']['tableName'])) {
            $tableName = $class['config']['tableName'];
            $annotations []= sprintf('@ORM\Table(name="%s")', $tableName);
        }
        return $annotations;
    }
    /**
     * {@inheritdoc}
     */
    public function generateFieldAnnotations(string $className, string $fieldName): array
    {
        $field = $this->classes[$className]['fields'][$fieldName];
        if ($field['isId'] || $fieldName == 'id') {
            return $this->generateIdAnnotations();
        }
        if ( isset($this->config['types'][$className]['properties'][$fieldName]['skipOrm']) && $this->config['types'][$className]['properties'][$fieldName]['skipOrm']) {
            return [];
        }
        $annotations = [];
        $field['relationTableName'] = null;
        if (isset($this->config['types'][$className]['properties'][$fieldName])) {
            $field['relationTableName'] = $this->config['types'][$className]['properties'][$fieldName]['relationTableName'];
        }
        if ($field['isEnum']) {
            $type = $field['isArray'] ? 'simple_array' : 'string';
        } else {
            switch ($field['range']) {
                case 'Boolean':
                    $type = 'boolean';
                    break;
                case 'Date':
                    $type = 'date';
                    break;
                case 'DateTime':
                    $type = 'datetime';
                    break;
                case 'Time':
                    $type = 'time';
                    break;
                case 'Number':
                case 'Float':
                    $type = 'float';
                    break;
                case 'Integer':
                    $type = 'integer';
                    break;
                case 'Text':
                case 'URL':
                    $type = 'text';
                    break;
            }
        }
        if (isset($type)) {
            $annotation = '@ORM\Column';
            $isColumnHasProperties = false;
            if ($field['ormColumn']) {
                $annotation .= sprintf('(%s)', $field['ormColumn']);
            } else {
                if ($type !== 'string' || $field['isNullable'] || $field['isUnique']) {
                    $isColumnHasProperties = true;
                }
                if ($field['isArray']) {
                    $type = 'simple_array';
                }
                if ($isColumnHasProperties) {
                    $annotation .= '(';
                }
                if ($type !== 'string') {
                    $annotation .= sprintf('type="%s"', $type);
                }
                if ($type !== 'string' && $field['isNullable']) {
                    $annotation .= ', ';
                }
                if ($field['isNullable']) {
                    $annotation .= 'nullable=true';
                }
                if ($field['isUnique'] && $field['isNullable']) {
                    $annotation .= ', ';
                }
                if ($field['isUnique']) {
                    $annotation .= 'unique=true';
                }
                if ($isColumnHasProperties) {
                    $annotation .= ')';
                }
            }
            $annotations[] = $annotation;
        } elseif ($field['isEmbedded']) {
            $columnPrefix = $field['columnPrefix'] ? ', columnPrefix=true' : ', columnPrefix=false';
            $annotations[] = sprintf('@ORM\Embedded(class="%s"%s)', $this->getRelationName($field['range']), $columnPrefix);
        } else {
            $targetEntity = sprintf('targetEntity="%s"', $this->getRelationName($field['range']));
            $mappedBy = null;
            $inversedBy = null;
            if ( isset($this->config['types'][$className]['properties'][$fieldName]['mappedBy']) ) {
                $mappedBy = sprintf(', mappedBy="%s"', $this->config['types'][$className]['properties'][$fieldName]['mappedBy']);
            }
            if ( isset($this->config['types'][$className]['properties'][$fieldName]['inversedBy']) ) {
                $inversedBy = sprintf(', inversedBy="%s"', $this->config['types'][$className]['properties'][$fieldName]['inversedBy']);
            }
            switch ($field['cardinality']) {
                case CardinalitiesExtractor::CARDINALITY_0_1:
                    $annotations[] = sprintf('@ORM\OneToOne(%s%s%s)', $targetEntity, $mappedBy, $inversedBy);
                    break;
                case CardinalitiesExtractor::CARDINALITY_1_1:
                    $annotations[] = sprintf('@ORM\OneToOne(%s%s%s)', $targetEntity, $mappedBy, $inversedBy);
                    $annotations[] = '@ORM\JoinColumn(nullable=false)';
                    break;
                case CardinalitiesExtractor::CARDINALITY_UNKNOWN:
                    // No break
                case CardinalitiesExtractor::CARDINALITY_N_0:
                    $annotations[] = sprintf('@ORM\ManyToOne(%s%s%s)', $targetEntity, $mappedBy, $inversedBy);
                    break;
                case CardinalitiesExtractor::CARDINALITY_N_1:
                    $annotations[] = sprintf('@ORM\ManyToOne(%s%s%s)', $targetEntity, $mappedBy, $inversedBy);
                    $annotations[] = '@ORM\JoinColumn(nullable=false)';
                    break;
                case CardinalitiesExtractor::CARDINALITY_0_N:
                    $annotations[] = sprintf('@ORM\ManyToMany(%s%s%s)', $targetEntity, $mappedBy, $inversedBy);
                    $name = $field['relationTableName'] ? sprintf('name="%s", ', $field['relationTableName']) : '';
                    $annotations[] = '@ORM\JoinTable('.$name.'inverseJoinColumns={@ORM\JoinColumn(unique=true)})';
                    break;
                case CardinalitiesExtractor::CARDINALITY_1_N:
                    $annotations[] = sprintf('@ORM\OneToMany(%s%s%s)', $targetEntity, $mappedBy, $inversedBy);
                    $name = $field['relationTableName'] ? sprintf('name="%s", ', $field['relationTableName']) : '';
//                     $annotations[] = '@ORM\JoinTable('.$name.'inverseJoinColumns={@ORM\JoinColumn(nullable=false, unique=true)})';
                    $annotations[] = '@ORM\JoinColumn(referencedColumnName="id")';
                    break;
                case CardinalitiesExtractor::CARDINALITY_N_N:
                    $annotations[] = sprintf('@ORM\ManyToMany(%s%s%s)', $targetEntity, $mappedBy, $inversedBy);
                    if ($field['relationTableName']) {
                        $annotations[] = sprintf('@ORM\JoinTable(name="%s")', $field['relationTableName']);
                    }
                    break;
            }
        }
        return $annotations;
    }
    /**
     * {@inheritdoc}
     */
    public function generateUses(string $className): array
    {
        $resource = $this->classes[$className]['resource'];
        $subClassOf = $resource->get('rdfs:subClassOf');
        $typeIsEnum = $subClassOf && $subClassOf->getUri() === TypesGenerator::SCHEMA_ORG_ENUMERATION;
        $output = [];
        return $typeIsEnum ? $output : array_merge($output, ['Doctrine\ORM\Mapping as ORM']);
    }
    private function generateIdAnnotations(): array
    {
        $annotations = ['@ORM\Id'];
        if ('none' !== $this->config['id']['generationStrategy'] && !$this->config['id']['writable']) {
            $annotations[] = sprintf('@ORM\GeneratedValue(strategy="%s")', strtoupper($this->config['id']['generationStrategy']));
        }
        switch ($this->config['id']['generationStrategy']) {
            case 'uuid':
                $type = 'guid';
            break;
            case 'auto':
                $type = 'integer';
            break;
            default:
                $type = 'string';
            break;
        }
        $annotations[] = sprintf('@ORM\Column(type="%s")', $type);
        return $annotations;
    }
    /**
     * Gets class or interface name to use in relations.
     */
    private function getRelationName(string $range): string
    {
        if ($range === "None") {
            return '';
        }
        $class = $this->classes[$range];
        if (isset($class['interfaceName'])) {
            return $class['interfaceName'];
        }
        if (isset($this->config['types'][$class['name']]['namespaces']['class'])) {
            return sprintf('%s\\%s', $this->config['types'][$class['name']]['namespaces']['class'], $class['name']);
        }
        if (isset($this->config['namespaces']['entity'])) {
            return sprintf('%s\\%s', $this->config['namespaces']['entity'], $class['name']);
        }
        return $class['name'];
    }
}