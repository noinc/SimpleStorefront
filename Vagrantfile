# -*- mode: ruby -*-
# vi: set ft=ruby :

# Begin Script
$script = <<SCRIPT

echo "Provisioning virtual machine..."
echo "Updating aptitude"
apt-get update -y

echo "Installing Git"
apt-get install git -y > /dev/null

echo "Installing Apache"
apt-get install apache2 -y > /dev/null
echo "export APACHE_RUN_USER=vagrant" >> /etc/apache2/envvars
echo "export APACHE_RUN_GROUP=vagrant" >> /etc/apache2/envvars

echo "Installing Java"
apt-get install -y default-jre

echo "Installing Redis"
apt-get -y install redis-server
chmod -R aou+rw /etc/redis
chmod -R aou+rw /var/log/redis

echo "Installing PHP7"
add-apt-repository -y ppa:ondrej/php
apt-get update
apt-get install -y php7.0
apt-get install -y php7.0-mcrypt
apt-get install -y php7.0-gd
apt-get install -y libapache2-mod-php7.0
apt-get install -y php7.0-curl
apt-get install -y php7.0-common
apt-get install -y php7.0-cli
apt-get install -y php7.0-mysql
apt-get install -y php7.0-mysqlnd
apt-get install -y php7.0-readline
apt-get install -y php-redis
apt-get install -y php7.0-xml
apt-get install -y php7.0-zip

echo "Installing Composer"
curl -sS https://getcomposer.org/installer | /usr/bin/php -- --install-dir=/usr/bin --filename=composer

echo "Installing mysql-server"
apt-get install debconf-utils -y > /dev/null
debconf-set-selections <<< 'mysql-server mysql-server/root_password password toor'
debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password toor'
apt-get install mysql-server-5.6 -y > /dev/null
mysql -uroot -ptoor -e "create database simple_storefront"
mysql -uroot -ptoor -e "SET PASSWORD = PASSWORD('');"

echo "Installing node and npm"
apt-get install -y npm nodejs-legacy
ln -s /usr/bin/nodejs /usr/bin/node

echo "Installing bower"
apt-get install nodejs-legacy npm
npm install -g bower

echo "Installing PHPUnit"
wget https://phar.phpunit.de/phpunit.phar
chmod +x phpunit.phar
mv phpunit.phar /usr/local/bin/phpunit

echo "Restarting Apache"
mkdir /home/vagrant/logs
apache2ctl restart

echo "Enabling mod-rewrite"
a2enmod rewrite

echo "Enabling headers"
a2enmod headers

echo "Creating vagrant/public_html"
mkdir /home/vagrant/public_html
mkdir /home/vagrant/public_html/web

echo "Creating index.html landing"
echo "<?php echo 'Hello World!';" > /home/vagrant/public_html/web/index.php

chown -R vagrant.vagrant /home/vagrant/public_html

echo "Configuring Apache"
perl -p -i -e 's/www-data/vagrant/ge;' /etc/apache2/envvars

cat <<EOF > /etc/apache2/sites-available/000-default.conf
<VirtualHost *:80>
        DocumentRoot /home/vagrant/public_html/web

        <Directory /home/vagrant/public_html/web>
                # enable the .htaccess rewrites
                AllowOverride All
                Require all granted
        </Directory>

        ServerAdmin webmaster@localhost

        ErrorLog /home/vagrant/logs/error.log
        CustomLog /home/vagrant/logs/access.log combined

</VirtualHost>
EOF

echo "Restarting Apache2"
service apache2 restart

echo "Adding Helper Aliases"
echo "source ~/SimpleStorefront/.bash_aliases" >> .bashrc

SCRIPT
# End Script

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = "ubuntu/trusty64"
  config.vm.box_url = "https://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box"

  config.vm.network :private_network, ip: "192.168.33.10"

  config.vm.provider :virtualbox do |vb|
    vb.customize ["modifyvm", :id, "--memory", "4096"]
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    vb.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
    vb.customize ["modifyvm", :id, "--cpus", 2]
    # vb.gui = true
  end

  # Copy over SimpleStorefront code to vagrant
  config.vm.synced_folder ".", "/home/vagrant/SimpleStorefront", type: "rsync", rsync__auto: false, rsync__exclude: [
   	".git/",
   	".vagrant/",
   	"var/cache/",
   	"vendor/"
  ]

  # Copy over ssh keys to vagrant
  # Note: If you do not have ssh keys for github set up on your local machine, then check out https://help.github.com/articles/generating-an-ssh-key/
  config.vm.provision "file", source: "~/.ssh/id_rsa", destination: "/home/vagrant/.ssh/id_rsa"
  config.vm.provision "file", source: "~/.ssh/id_rsa.pub", destination: "/home/vagrant/.ssh/id_rsa.pub"

  # Run the shell script
  config.vm.provision "shell", inline: $script

end
