<?php
// if/else etc
// app/config/parameters.php
$connstr = getenv('SQLAZURECONNSTR_defaultConnection');

#hostname
preg_match('/Data\sSource=(?:tcp:)?([^:,]+)/', $connstr, $matches);
$container->setParameter('database_host', $matches[1]);
#port
preg_match('/Data\sSource=(?:tcp:)?[^:,]+[:,](\d+)/', $connstr, $matches);
$container->setParameter('database_port', $matches[1]);
#username
preg_match('/User\sId=([^;]+)/', $connstr, $matches);
$container->setParameter('database_user', $matches[1]);
#password
preg_match('/Password=([^;]+)/', $connstr, $matches);
$container->setParameter('database_password', $matches[1]);
#db_name
preg_match('/Database=([^;]+)/', $connstr, $matches);
$container->setParameter('database_name', $matches[1]);

$container->setParameter('secret','ThisTokenIsNotSoSecretChangeIt');
$container->setParameter('sql_driver','sqlsrv');
$container->setParameter('sql_charset','UTF-8');

#mail
preg_match('/(smtp):\/\/([A-Z0-9]+):([a-zA-z0-9]+)@([^:]+):([0-9]+)/',getenv('SERVICEBUSCONNSTR_MAIL'),$matches);
$container->setParameter('mailer_transport',$matches[1]);
$container->setParameter('mailer_host',$matches[4]);
$container->setParameter('mailer_user',$matches[2]);
$container->setParameter('mailer_password',$matches[3]);
$container->setParameter('mailer_port', $matches[5]);

?>
