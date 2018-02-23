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
use ApiPlatform\SchemaGenerator\AnnotationGenerator\ApiPlatformCoreAnnotationGenerator;
use ApiPlatform\SchemaGenerator\AnnotationGenerator\ConstraintAnnotationGenerator;
use ApiPlatform\SchemaGenerator\AnnotationGenerator\DoctrineOrmAnnotationGenerator;
use ApiPlatform\SchemaGenerator\AnnotationGenerator\PhpDocAnnotationGenerator;
use ApiPlatform\SchemaGenerator\AnnotationGenerator\SerializerGroupsAnnotationGenerator;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;
use ApiPlatform\SchemaGenerator\CardinalitiesExtractor;
/**
 * Types Generator Configuration.
 *
 * @author Kévin Dunglas <dunglas@gmail.com>
 */
final class TypesGeneratorConfiguration implements ConfigurationInterface
{
    public const SCHEMA_ORG_RDFA_URL = 'https://schema.org/docs/schema_org_rdfa.html';
    public const GOOD_RELATIONS_OWL_URL = 'https://purl.org/goodrelations/v1.owl';
    public const SCHEMA_ORG_NAMESPACE = 'http://schema.org/';
    /**
     * {@inheritdoc}
     */
    public function getConfigTreeBuilder(): TreeBuilder
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('config');
        $rootNode
            ->children()
                ->arrayNode('rdfa')
                    ->info('RDFa files')
                    ->defaultValue([
                        ['uri' => self::SCHEMA_ORG_RDFA_URL, 'format' => null],
                    ])
                    ->beforeNormalization()
                        ->ifArray()
                        ->then(function (array $v) {
                            return array_map(
                                function ($rdfa) {
                                    return is_scalar($rdfa) ? ['uri' => $rdfa, 'format' => null] : $rdfa;
                                },
                                $v
                            );
                        })
                    ->end()
                    ->prototype('array')
                        ->children()
                            ->scalarNode('uri')->defaultValue(self::SCHEMA_ORG_RDFA_URL)->info('RDFa URI to use')->example(self::SCHEMA_ORG_RDFA_URL)->end()
                            ->scalarNode('format')->defaultNull()->info('RDFa URI data format')->example('rdfxml')->end()
                        ->end()
                    ->end()
                ->end()
                ->arrayNode('relations')
                    ->info('OWL relation files to use')
                    ->defaultValue([self::GOOD_RELATIONS_OWL_URL])
                    ->prototype('scalar')->end()
                ->end()
                ->booleanNode('debug')->defaultFalse()->info('Debug mode')->end()
                ->arrayNode('id')
                    ->addDefaultsIfNotSet()
                    ->info('IDs configuration')
                    ->children()
                        ->booleanNode('generate')->defaultTrue()->info('Automatically add an id field to entities')->end()
                        ->enumNode('generationStrategy')->defaultValue('auto')->values(['auto', 'none', 'uuid', 'mongoid'])->info('The ID generation strategy to use ("none" to not let the database generate IDs).')->end()
                        ->booleanNode('writable')->defaultFalse()->info('Is the ID writable? Only applicable if "generationStrategy" is "uuid".')->end()
                        ->arrayNode('groups')
                            ->info('Symfony Serialization Groups for ids')
                            ->prototype('scalar')->end()
                        ->end()
                    ->end()
                ->end()
                ->booleanNode('useInterface')->defaultFalse()->info('Generate interfaces and use Doctrine\'s Resolve Target Entity feature')->end()
                ->booleanNode('checkIsGoodRelations')->defaultFalse()->info('Emit a warning if a property is not derived from GoodRelations')->end()
                ->scalarNode('header')->defaultFalse()->info('A license or any text to use as header of generated files')->example('// (c) Kévin Dunglas <dunglas@gmail.com>')->end()
                ->arrayNode('folders')
                    ->info('Extra folders for loading yaml')
                    ->prototype('scalar')->end()
                ->end()
                ->arrayNode('namespaces')
                    ->addDefaultsIfNotSet()
                    ->info('PHP namespaces')
                    ->children()
                        ->scalarNode('entity')->defaultValue('AppBundle\Entity')->info('The namespace of the generated entities')->example('Acme\Entity')->end()
                        ->scalarNode('enum')->defaultValue('AppBundle\Enum')->info('The namespace of the generated enumerations')->example('Acme\Enum')->end()
                        ->scalarNode('interface')->defaultValue('AppBundle\Model')->info('The namespace of the generated interfaces')->example('Acme\Model')->end()
                    ->end()
                ->end()
                ->arrayNode('doctrine')
                    ->addDefaultsIfNotSet()
                    ->info('Doctrine')
                    ->children()
                        ->booleanNode('useCollection')->defaultTrue()->info('Use Doctrine\'s ArrayCollection instead of standard arrays')->end()
                        ->scalarNode('resolveTargetEntityConfigPath')->defaultNull()->info('The Resolve Target Entity Listener config file pass')->end()
                    ->end()
                ->end()
                ->arrayNode('validator')
                    ->addDefaultsIfNotSet()
                    ->info('Symfony Validator Component')
                    ->children()
                        ->booleanNode('assertType')->defaultFalse()->info('Generate @Assert\Type annotation')->end()
                    ->end()
                ->end()
                ->scalarNode('author')->defaultFalse()->info('The value of the phpDoc\'s @author annotation')->example('Kévin Dunglas <dunglas@gmail.com>')->end()
                ->enumNode('fieldVisibility')->values(['private', 'protected', 'public'])->defaultValue('private')->cannotBeEmpty()->info('Visibility of entities fields')->end()
                ->booleanNode('accessorMethods')->defaultTrue()->info('Set this flag to false to not generate getter, setter, adder and remover methods')->end()
                ->booleanNode('fluentMutatorMethods')->defaultFalse()->info('Set this flag to true to generate fluent setter, adder and remover methods')->end()
                ->arrayNode('types')
                    ->beforeNormalization()
                        ->always()
                        ->then(function ($v) {
                            foreach ($v as $key => $type) {
                                if (!isset($type['properties'])) {
                                    $v[$key]['allProperties'] = true;
                                }
                            }
                            return $v;
                        })
                    ->end()
                    ->info('Schema.org\'s types to use')
                    ->useAttributeAsKey('id')
                    ->prototype('array')
                        ->children()
                            ->arrayNode('constants')
                                ->info('Constants for the Entity')
                                ->useAttributeAsKey('id')
                                ->prototype('scalar')->end()
                            ->end()
                            ->scalarNode('vocabularyNamespace')->defaultValue(self::SCHEMA_ORG_NAMESPACE)->info('Namespace of the vocabulary the type belongs to.')->end()
                            ->booleanNode('abstract')->defaultNull()->info('Is the class abstract? (null to guess)')->end()
                            ->booleanNode('embeddable')->defaultFalse()->info('Is the class embeddable?')->end()
                            ->arrayNode('namespaces')
                                ->addDefaultsIfNotSet()
                                ->info('Type namespaces')
                                ->children()
                                    ->scalarNode('class')->defaultNull()->info('The namespace for the generated class (override any other defined namespace)')->end()
                                    ->scalarNode('interface')->defaultNull()->info('The namespace for the generated interface (override any other defined namespace)')->end()
                                ->end()
                            ->end()
                            ->arrayNode('doctrine')
                                ->addDefaultsIfNotSet()
                                ->children()
                                    ->arrayNode('inheritanceMapping')
                                        ->info('The Doctrine inheritance mapping types (override the guessed one)')
                                        ->prototype('scalar')->end()
                                    ->end()
                                ->end()
                            ->end()
                            ->scalarNode('parent')->defaultFalse()->info('The parent class, set to false for a top level class')->end()
                            ->scalarNode('forceParentConstructor')->defaultFalse()->info('Force the parent class constructor to be called')->end()
                            ->scalarNode('tableName')->defaultNull()->info('Give entity a specified table name')->end()
                            ->scalarNode('guessFrom')->defaultValue('Thing')->info('If declaring a custom class, this will be the class from which properties type will be guessed')->end()
                            ->arrayNode('uniqueEntity')
                                ->info('The fields for the uniqueEntity constraint')
                                ->prototype('scalar')->info('The field to uniquely identify upon')->end()
                                ->beforeNormalization()
                                    ->ifArray()
                                    ->then(function($value) { return array_map( function($item) { return is_array($item) ? implode('", "', $item) : $item; }, $value); } )
                                ->end()
                            ->end()
                            ->booleanNode('allProperties')->defaultFalse()->info('Import all existing properties')->end()
                            ->booleanNode('resourceEnabled')->defaultTrue()->info('Whether this should be an ApiResource')->end()
                            ->arrayNode('defaultOperations')
                                ->info('APIResource Item Operations')
                                ->addDefaultsIfNotSet()
                                ->children()
                                    ->arrayNode('collection_get')
                                        ->info('Get a list of items')
                                        ->addDefaultsIfNotSet()
                                        ->children()
                                            ->booleanNode('enabled')->defaultTrue()->info('Whether or not this operation is enabled')->end()
                                            ->scalarNode('method')->defaultValue('GET')->info('The method for request (GET, POST, PUT, etc.)')->end()
                                            ->scalarNode('access_control')->defaultNull()->info('The access control logic for the route')->end()
                                            ->arrayNode('normalization_context')->addDefaultsIfNotSet()->children()->arrayNode('groups')->prototype('scalar')->end()->defaultValue(['output'])->end()->end()->end()
                                            ->arrayNode('denormalization_context')->addDefaultsIfNotSet()->children()->arrayNode('groups')->prototype('scalar')->end()->defaultValue(['input'])->end()->end()->end()
                                        ->end()
                                    ->end()
                                    ->arrayNode('collection_post')
                                        ->info('Create a new item')
                                        ->addDefaultsIfNotSet()
                                        ->children()
                                            ->booleanNode('enabled')->defaultTrue()->info('Whether or not this operation is enabled')->end()
                                            ->scalarNode('method')->defaultValue('POST')->info('The method for request (GET, POST, PUT, etc.)')->end()
                                            ->scalarNode('access_control')->defaultNull()->info('The access control logic for the route')->end()
                                            ->arrayNode('normalization_context')->addDefaultsIfNotSet()->children()->arrayNode('groups')->prototype('scalar')->end()->defaultValue(['output'])->end()->end()->end()
                                            ->arrayNode('denormalization_context')->addDefaultsIfNotSet()->children()->arrayNode('groups')->prototype('scalar')->end()->defaultValue(['input'])->end()->end()->end()
                                        ->end()
                                    ->end()
                                    ->arrayNode('item_get')
                                        ->info('Get a single item')
                                        ->addDefaultsIfNotSet()
                                        ->children()
                                            ->booleanNode('enabled')->defaultTrue()->info('Whether or not this operation is enabled')->end()
                                            ->scalarNode('method')->defaultValue('GET')->info('The method for request (GET, POST, PUT, etc.)')->end()
                                            ->scalarNode('access_control')->defaultNull()->info('The access control logic for the route')->end()
                                            ->arrayNode('normalization_context')->addDefaultsIfNotSet()->children()->arrayNode('groups')->prototype('scalar')->end()->defaultValue(['output'])->end()->end()->end()
                                            ->arrayNode('denormalization_context')->addDefaultsIfNotSet()->children()->arrayNode('groups')->prototype('scalar')->end()->defaultValue(['input'])->end()->end()->end()
                                        ->end()
                                    ->end()
                                    ->arrayNode('item_put')
                                        ->info('Update a single item')
                                        ->addDefaultsIfNotSet()
                                        ->children()
                                            ->booleanNode('enabled')->defaultTrue()->info('Whether or not this operation is enabled')->end()
                                            ->scalarNode('method')->defaultValue('PUT')->info('The method for request (GET, POST, PUT, etc.)')->end()
                                            ->scalarNode('access_control')->defaultNull()->info('The access control logic for the route')->end()
                                            ->arrayNode('normalization_context')->addDefaultsIfNotSet()->children()->arrayNode('groups')->prototype('scalar')->end()->defaultValue(['output'])->end()->end()->end()
                                            ->arrayNode('denormalization_context')->addDefaultsIfNotSet()->children()->arrayNode('groups')->prototype('scalar')->end()->defaultValue(['input'])->end()->end()->end()
                                        ->end()
                                    ->end()
                                    ->arrayNode('item_delete')
                                        ->info('Delete a single item')
                                        ->addDefaultsIfNotSet()
                                        ->children()
                                            ->booleanNode('enabled')->defaultTrue()->info('Whether or not this operation is enabled')->end()
                                            ->scalarNode('method')->defaultValue('DELETE')->info('The method for request (GET, POST, PUT, etc.)')->end()
                                            ->scalarNode('access_control')->defaultNull()->info('The access control logic for the route')->end()
                                            ->arrayNode('normalization_context')->addDefaultsIfNotSet()->children()->arrayNode('groups')->prototype('scalar')->end()->defaultValue(['output'])->end()->end()->end()
                                            ->arrayNode('denormalization_context')->addDefaultsIfNotSet()->children()->arrayNode('groups')->prototype('scalar')->end()->defaultValue(['input'])->end()->end()->end()
                                        ->end()
                                    ->end()
                                ->end()
                            ->end()
                            ->arrayNode('itemOperations')
                                ->info('Special APIResource Item Operations')
                                ->useAttributeAsKey('id')
                                ->prototype('array')
                                    ->children()
                                        ->scalarNode('route_name')->defaultNull()->info('The route_name for the route')->end()
                                    ->end()
                                ->end()
                            ->end()
                            ->arrayNode('collectionOperations')
                                ->info('Special APIResource Collection Operations')
                                ->useAttributeAsKey('id')
                                ->prototype('array')
                                    ->children()
                                        ->scalarNode('route_name')->defaultNull()->info('The route_name for the route')->end()
                                    ->end()
                                ->end()
                            ->end()
                            ->arrayNode('attributes')
                                ->info('APIResource attributes')
                                ->children()
                                    ->arrayNode('normalization_context')
                                        ->info('Symfony Serialization Groups for Normalization context')
                                        ->prototype('scalar')->end()
                                    ->end()
                                    ->arrayNode('denormalization_context')
                                        ->info('Symfony Serialization Groups for Denormalization context')
                                        ->prototype('scalar')->end()
                                    ->end()
                                    ->arrayNode('filters')
                                        ->info('Filters')
                                        ->prototype('scalar')->end()
                                    ->end()
                                ->end()
                            ->end()
                            ->arrayNode('properties')
                                ->info('Properties of this type to use')
                                ->useAttributeAsKey('id')
                                ->prototype('array')
                                    ->addDefaultsIfNotSet()
                                    ->children()
                                        ->scalarNode('range')->defaultNull()->info('The property range')->example('Offer')->end()
                                        ->scalarNode('typeHint')->defaultTrue()->info('Whether to type hint this field')->end()
                                        ->scalarNode('skipOrm')->defaultFalse()->info('Whether to type skip ORM column generation')->end()
                                        ->scalarNode('mappedBy')->defaultNull()->info('The mappedBy parameter for a ManytoOne')->end()
                                        ->scalarNode('inversedBy')->defaultNull()->info('The inversedBy parameter for a OneToMany')->end()
                                        ->scalarNode('relationTableName')->defaultNull()->info('The relation table name')->example('organization_member')->end()
                                        ->booleanNode('subresource')->defaultFalse()->info('Whether the field is a subresource')->end()
                                        ->enumNode('cardinality')->defaultValue(CardinalitiesExtractor::CARDINALITY_UNKNOWN)->values([
                                            CardinalitiesExtractor::CARDINALITY_0_1,
                                            CardinalitiesExtractor::CARDINALITY_0_N,
                                            CardinalitiesExtractor::CARDINALITY_1_1,
                                            CardinalitiesExtractor::CARDINALITY_1_N,
                                            CardinalitiesExtractor::CARDINALITY_N_0,
                                            CardinalitiesExtractor::CARDINALITY_N_1,
                                            CardinalitiesExtractor::CARDINALITY_N_N,
                                            CardinalitiesExtractor::CARDINALITY_UNKNOWN,
                                        ])->end()
                                        ->scalarNode('ormColumn')->defaultNull()->info('The doctrine column annotation content')->example('type="decimal", precision=5, scale=1, options={"comment" = "my comment"}')->end()
                                        ->arrayNode('groups')
                                            ->info('Symfony Serialization Groups')
                                            ->prototype('scalar')->end()
                                        ->end()
                                        ->booleanNode('readable')->defaultTrue()->info('Is the property readable?')->end()
                                        ->booleanNode('writable')->defaultTrue()->info('Is the property writable?')->end()
                                        ->booleanNode('nullable')->defaultTrue()->info('Is the property nullable?')->end()
                                        ->booleanNode('unique')->defaultFalse()->info('The property unique')->end()
                                        ->booleanNode('embedded')->defaultFalse()->info('Is the property embedded?')->end()
                                        ->booleanNode('columnPrefix')->defaultFalse()->info('The property columnPrefix')->end()
                                    ->end()
                                ->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()
                ->arrayNode('annotationGenerators')
                    ->info('Annotation generators to use')
                    ->defaultValue([
                        PhpDocAnnotationGenerator::class,
                        DoctrineOrmAnnotationGenerator::class,
                        ApiPlatformCoreAnnotationGenerator::class,
                        ConstraintAnnotationGenerator::class,
                        SerializerGroupsAnnotationGenerator::class,
                    ])
                    ->prototype('scalar')->end()
                ->end()
            ->end();
        return $treeBuilder;
    }
}