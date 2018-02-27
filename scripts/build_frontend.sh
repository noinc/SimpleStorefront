#!/bin/bash

# Needed to make the frontend a requirement for composer
# in order to fix the Azure deploy.

# This creates the ViewBundle/Resources/views folder so MUST happen
# before you run cache:clear else the command will fail.

exitWithMessageOnError () {
  if [ ! $? -eq 0 ]; then
    echo "An error has occurred during web site deployment."
    echo $1
    exit 1
  fi
}

echo -e "!!!!!!!!!!!!! Installing yarn dependencies"
(cd src/NoInc/SimpleStorefront/ViewBundle && yarn)
exitWithMessageOnError "yarn dependancy installation failed"

echo -e "!!!!!!!!!!!!! Building frontend"
gulp --gulpfile src/NoInc/SimpleStorefront/ViewBundle/gulpfile.js
exitWithMessageOnError "frontend build failed"

exit 0


