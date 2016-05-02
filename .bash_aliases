alias home="cd /home/vagrant/MySimpleStorefront"
alias initialize="perl -p -i -e 's/\r\n$/\n/g' ./bin/*.sh;bash bin/initialize.sh;"
alias clean="perl -p -i -e 's/\r\n$/\n/g' ./bin/*.sh;bash bin/cache.sh;bash bin/assets.sh;"
alias fixtures="perl -p -i -e 's/\r\n$/\n/g' ./bin/*.sh;bash bin/fixtures.sh;"
