echo -e "Removing existing *.orm.yml definitions.";
find src -iname "*.orm.yml" | xargs rm -f

echo -e "Removing existing models while preserving existing repositories.";
rm -rf src/NoInc/MySimpleStorefrontBundle/Entity/*

echo -e "Exporting orm.yml files from workbench";
php vendor/bin/mysql-workbench-schema-export --config=workbench/export-settings.json workbench/mysimplestorefront.mwb

echo -e "Generating doctrine entities.";
php bin/console doctrine:generate:entities NoIncSimpleStorefrontBundle --no-backup

echo -e "Modifying User.php entity to extend FOSUserBundle.";
perl -p -i -e 's/class\ User\h*\r?\n?/class\ User\ extends\ \\FOS\\UserBundle\\Model\\User\n/g;' src/NoInc/SimpleStorefrontBundle/Entity/User.php
sed -i ' /__construct()/{H;n;;s/$/\n        parent::__construct()\;/}' src/NoInc/SimpleStorefrontBundle/Entity/User.php

perl -p -i -e 's/\(\\DateTime \$(\w+)\)/\(\\DateTime \$$1 = null\)/g;' src/NoInc/SimpleStorefrontBundle/Entity/User.php
perl -p -i -e 's/setRoles\(\$roles\)/setRoles\(array \$roles\)/g;' src/NoInc/SimpleStorefrontBundle/Entity/User.php

