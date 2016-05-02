#!/bin/bash

echo -e "${Gre}!!!!!!!!!!!!! Clearing cache.${RCol}";
php bin/console cache:clear --env=dev
php bin/console cache:clear --env=prod --no-debug
