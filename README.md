# My Simple Storefront
--------------------
The goal of this training project is to provide a very basic storefront layout for someone selling something.
The project has been scaffolded using Symfony and API Platform 2.1.0.

## System Requirements:

1. Vagrant- https://www.vagrantup.com/docs/installation/
2. Git- https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

## Recommended Tools:

1. Zend Studio- http://www.zend.com/en/products/studio/downloads (IDE for developing PHP)
2. Scipteden Bootstrap Builder- http://scripteden.com/builder/bootstrap/# (For quickly building sample templates)

Note: You may use whichever tools you would like.

## Some high level requirements are as follows:

* System should represent a simple business
* System should allow for Admin to log in to maintain the inventory and product recipes
* System should keep track of the business' current capital
* System should maintain prices for inventory bought and products sold
* System should allow guest users to buy products

## Instructions for running the API:

1. Navigate to the api folder: ``cd api``
2. Start the vagrant box using the provided Vagrantfile: ``vagrant up``
3. After the vagrant box starts, ssh into it: ``vagrant ssh``
4. Inside the vagrant, cd into the SimpleStorefront: ``cd SimpleStorefront``
5. Inside the vagrant, run the install script: ``composer update``
6. Inside the vagrant, initialize the database with fixtures: ``composer generate-fixtures``
6. Inside the vagrant, install assets needed for API Platform: ``php bin/console assets:install``
7. Open up a browser to view the API documentation: ``http://192.168.33.25/api``

## Backend Structure:

The backend source files are contained in the ``api/src/`` directory.

The sub-directories contained within this directory are as follows:
* Controller - Contains controllers defining custom API endpoints.
* DataFixtures - Contains default fixture data that is loaded with the ``composer generate-fixtures`` command.
* Entity - Contains the Entity classes used to define the database schema.
* Repository - Contains custom EntityRepository definitions.


## Frontend Structure:

The frontend source files are contained in the ``client/src/`` directory.
* actions - Contains scaffolded actions based on the API schema.
* components - Contains scaffolded components based on the API schema.
* config - Contains entrypoint.js which defines the API entrypoint.
* images - Contains any images used for the application.
* reducers - Contains the reducers for different components of the application.
* routes - Contains the route definitions for different components of the application.
* utils - Contains dataAccess.js which defines the basic method for interacting with the API.


## This project is not finished!

The following is a list of tasks that should be completed. They are in three levels, beginner, intermediate and advanced, and broken into frontend and backend components. You don't need to complete all the tasks define, but complete as many as you are comfortable and able to do. We are paying attention to completeness, code style, and architecture of your work.

### Beginner

#### Frontend challenges
* Add a header with a login/logout button
* Create an interface for viewing ingredients
* Create different interfaces for administrators and customers viewing the storefront
* Use AJAX calls to the API layer to display recipes and their ingredients.

### Intermediate
#### Frontend challenges
* Add a UI library (such as Materialize, Bootstrap or Angular Material) and style all pages using this library
* Allow administrators to create and modify recipes using AJAX calls to the API layer.
* Allow administrators to buy ingredients using AJAX calls to the API layer.
* Make sure to implement front-end checks for quantities (i.e. if you have no sugar in stock, you can't make lemonade!)
* Add static product images (can be hard-coded image files)
* Create an admin dashboard to show sales and revenue (minimally, in a textual format)

### Advanced
#### Frontend challenges
* Add a shopping cart/checkout interface
* Modify the admin dashboard to show graphical charts (using a charting library of your choosing)
* Create custom styles and design extending a UI library, or write your own UI without a library.
* Make sure the interface is WCAG 2.0 AA-level compliant [use the WAVE tool to help verify compliance](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh?hl=en-US)
* Make sure the interface is mobile-friendly targeting screen sizes as small as an iPhone 5.
* Optionally, modify the frontend build chain to be more efficient.
