#!/bin/bash

echo -e "Initializing symbolic link between SimpleStorefront and public_html folders.";
cd /home/vagrant/
rm -rf public_html
ln -s SimpleStorefront public_html
cd /home/vagrant/public_html

echo -e "Setting up SSH.";
chmod 700 ~/.ssh/id_rsa*
eval $(ssh-agent -s)
ssh-add

echo -e "Cleaning scripts in bin.";
chmod +x ./bin/*.sh
perl -p -i -e 's/\r\n$/\n/g' ./bin/*.sh

echo -e "Running composer install and update and bower installs";
composer config --global discard-changes true
composer install
composer update
