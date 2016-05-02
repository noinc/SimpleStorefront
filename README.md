# My Simple Storefront
--------------------
The goal of this training project is to provide a very basic storefront layout for someone selling something.
The project has been scaffolded using Symfony 3.0 and any additions should follow Symfony styles and standards.

## System Requirements:
	1. Vagrant- https://www.vagrantup.com/docs/installation/
	2. Git- https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
	3. Rsync- https://alanbarber.com/2015/08/11/installing-rsync-on-windows/ (If using Windows)

## Recommended Tools:
	1. Zend Studio 13- http://www.zend.com/en/products/studio/downloads
	2. Scipteden Bootstrap Builder- http://scripteden.com/builder/bootstrap/# (For quickly building sample templates)

## Some high level requirements are as follows:
	System should represent a simple business
	System should allow for Admin to log in in order to maintain the inventory and product recipes
	System should keep track of the business' current capital
	System should maintain prices for inventory bought and products sold
	System should allow guest users to buy products

## Instructions for running the project:
	1. Start the vagrant box using the provided Vagrantfile: vagrant up
	2. After the vagrant box starts, ssh into it: vagrant ssh
	3. Inside the vagrant, run the initialize script: initialize
	4. Inside the vagrant, run the fixtures script: fixtures
	5. Inside the vagrant, run the clean script: clean
	6. Open up a terminal to connect to the vagrant: http://192.168.33.10/

## The project is not finished, however.  The following is a list of tasks that ought to be completed:
	Beginner:
		Add a Header with a Login/Logout button
		Add another Recipe and list of Ingredients through data fixtures
		Check to make sure Ingredients are in Stock before making a Product
	Intermediate:
		Add a Product image
		Add in a stylized Login page
		Add the Buy Ingredients Panel
	Advanced:
		Add in a shopping cart/checkout system
		Add in a CDN or Amazon S3 for image serving
		Add in managers for Ingredients and Recipes