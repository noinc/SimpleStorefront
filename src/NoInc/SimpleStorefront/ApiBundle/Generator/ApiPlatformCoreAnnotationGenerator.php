<?php
/*
 * This file is part of the API Platform project.
 *
 * (c) Kévin Dunglas <dunglas@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
declare(strict_types = 1);
namespace NoInc\SimpleStorefront\ApiBundle\Generator;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use ApiPlatform\SchemaGenerator\TypesGenerator;
use ApiPlatform\SchemaGenerator\AnnotationGenerator\AbstractAnnotationGenerator;
/**
 * Generates API Platform core annotations.
 *
 * @author Kévin Dunglas <dunglas@gmail.com>
 *
 * @see https://github.com/api-platform/core
 */
final class ApiPlatformCoreAnnotationGenerator extends AbstractAnnotationGenerator
{
    
    /**
     *
     * {@inheritdoc}
     *
     */
    public function generateClassAnnotations(string $className): array
    {
        $resources = [
            'iri' => '"' . $this->classes[$className]['resource'] . '"'
        ];
        
        if (isset($this->config['types'][$className]['resourceEnabled']) && $this->config['types'][$className]['resourceEnabled'] === false) {
            return [];
        }
        
        $operationsStrings = [
            'item' => [],
            'collection' => []
        ];
        
        $operationMapping = [
            'itemOperations' => 'item',
            'collectionOperations' => 'collection',
            'defaultOperations' => null
        ];
        
        foreach ( $operationMapping as $operationGrouping => $type ) {
            if (isset($this->config['types'][$className][$operationGrouping])) {
                
                $operations = $this->config['types'][$className][$operationGrouping];
                
                foreach ($operations as $operationName => $operationDefinitionConfig) {
                    $once = 1;
                    $trueOperationName = $operationName;
                    if ( $type === null ) {
                        if ( strpos($operationName, 'collection_') === 0 ) {
                            $methodType = 'collection';
                            $trueOperationName = str_replace('collection_', '', $operationName, $once);
                        } elseif ( strpos($operationName, 'item_') === 0 ) {
                            $methodType = 'item';
                            $trueOperationName = str_replace('item_', '', $operationName, $once);
                        } else {
                            echo 'IS NONE!!!!' . PHP_EOL;
                            //invalid type
                            continue;
                        }
                    } else {
                        $methodType = $type;
                    }
                    
                    $operationDefinition = [];
                    
                    //Skip if not enabled
                    if ( isset($operationDefinitionConfig['enabled']) && $operationDefinitionConfig['enabled'] !== true )
                    {
                        continue;
                    }
                    
                    foreach ($operationDefinitionConfig as $key => $value) {
                        
                        if ($key === 'enabled') {
                            continue;
                        }
                        
                        if (is_array($value)) {
                            $valueStrings = [];
                            foreach ( $value as $subKey => $subValue ) {
                                if ( is_array ($subValue) ) {
                                    $valueStrings []= sprintf('"%s"={"%s"}', $subKey, implode('", "', $subValue));
                                } else {
                                    $valueStrings []= sprintf('"%s"="%s"', $subKey, $subValue);
                                }
                            }
                            
                            if ( !empty($valueStrings) )
                            {
                                $operationDefinition[] = sprintf('"%s"={%s}', $key, implode('", "', $valueStrings));
                            }
                        } else {
                            if ( !empty($value) )
                            {
                                $operationDefinition[] = sprintf('"%s"="%s"', $key, $value);
                            }
                        }
                    }
                    
                    if (! empty($operationDefinition)) {
                        $operationsStrings[$methodType] []= sprintf('"%s"={%s}', $trueOperationName, implode(', ', $operationDefinition));
                    }
                }
                
            }
        }
        
        
        if (! empty($operationsStrings['collection'])) {
            $resources['collectionOperations'] = sprintf("{%s}", implode(", ", $operationsStrings['collection']));
        }
        
        if (! empty($operationsStrings['item'])) {
            $resources['itemOperations'] = sprintf("{%s}", implode(", ", $operationsStrings['item']));
        }
        
        if (isset($this->config['types'][$className]['attributes'])) {
            
            $attributes = $this->config['types'][$className]['attributes'];
            
            $attributesStrings = [];
            
            foreach ($attributes as $attributeName => $attributeGroups) {
                switch ($attributeName) {
                    case 'normalization_context':
                    case 'denormalization_context':
                        $attributesStrings[] = sprintf('"%s"={"groups"={"%s"}}', $attributeName, implode('", "', $attributeGroups));
                        break;
                    default:
                        $attributesStrings[] = sprintf('"%s"={"%s"}', $attributeName, implode('", "', $attributeGroups));
                        break;
                }
            }
            
            if (! empty($attributesStrings)) {
                $resources['attributes'] = sprintf("{%s}", implode(", ", $attributesStrings));
            }
        }
        
        
        $resourceStrings = [];
        foreach ($resources as $resourceName => $resourceString) {
            $resourceStrings[] = sprintf("%s=%s", $resourceName, $resourceString);
        }
        
        return [
            sprintf('@ApiResource(%s)', implode(", ", $resourceStrings))
        ];
    }
    
    /**
     *
     * {@inheritdoc}
     *
     */
    public function generateFieldAnnotations(string $className, string $fieldName): array
    {
        
        $annotations = [];
        
        if (!$this->classes[$className]['fields'][$fieldName]['isCustom']) {
            $annotations []= sprintf('@ApiProperty(iri="http://schema.org/%s")', $fieldName);
        }
        
        if (isset($this->config['types'][$className]['properties'][$fieldName]['subresource']) && $this->config['types'][$className]['properties'][$fieldName]['subresource'] === true) {
            $annotations []= '@ApiSubresource';
        }
        
        return $annotations;
    }
    
    /**
     *
     * {@inheritdoc}
     *
     */
    public function generateUses(string $className): array
    {
        $resource = $this->classes[$className]['resource'];
        
        $subClassOf = $resource->get('rdfs:subClassOf');
        $typeIsEnum = $subClassOf && $subClassOf->getUri() === TypesGenerator::SCHEMA_ORG_ENUMERATION;
        
        return $typeIsEnum ? [] : [
            ApiResource::class,
            ApiSubresource::class,
            ApiProperty::class
        ];
    }
}