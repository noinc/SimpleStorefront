#!/bin/bash

echo -e "Refreshing database schema.";
php bin/console doctrine:database:drop --force
php bin/console doctrine:database:create
php bin/console doctrine:schema:update --force

echo -e "Loading Fixtures.";
php bin/console doctrine:fixtures:load --append
