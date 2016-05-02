#!/bin/bash

echo -e "${Gre}!!!!!!!!!!!!! Refreshing assets.${RCol}";
php bin/console assets:install
php bin/console assetic:dump