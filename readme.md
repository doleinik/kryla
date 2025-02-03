# ABOUT PROJECT BUNDLE

This bundle is created for fast Wordpress + REACT site configure and deploy. It is based on mix of Node.js scripts, Gulp & Webpack modules, that help to:

- compile SCSS/JS for different environments (development|production)
- compress | resize static images and convert them to WebP
- convert TTF fonts to WOFF2
- create/update/backup of DB between local, test & prod servers
- deploy of full app or theme (selective) between local, test & prod servers
  ... more features in process

# SYSTEM REQUIREMENTS:

- Local web-server running (Openserver, WAMP, LAMP etc.)
- PHP >= 7.4
- MySQL 5.7
- Install NODE.js LTS (latest version) with addons (including Python)
- Install npm & yarn
- cMake (https://cmake.org/download/) to fix error in cpu-features module
- Global Node Modules :
  (If you've previously installed Gulp globally, run "npm rm --global gulp" before following these instructions.)
  -- gulp-cli (npm i -g gulp-cli)
  -- Yeoman & Yeoman WP generator (npm i -g yo generator-wordpress)
- Fix https to ssh issue in GIT "git config --global url."https://".insteadOf git://" (optional)

# FOLDER STRUCTURE

- /app/ - core Wordpress folder
- /gulp/ - all gulp tasks
- /src/ - source files folder:
  -- /scss - scss files
  -- /js - js files
  -- /img - images to optimize|convert
  -- /fonts - fonts to convert

# SYSTEM PATH CONFIG (if not configured)

- path to global node_modules in SYSTEM PATH (NODE_PATH: %AppData%\npm\node_modules)
- local ".\node_modules\.bin" in SYSTEM PATH
- path to PHP executives (i.e. X:\Openserver\modules\php\PHP_7.4)
- path to DB executives (i.e. X:\Openserver\modules\database\MySQL-5.7\bin)

# SETUP PROJECT

Local project should be named {_projectName_}.loc due to environment check

## SSH

- Create SSH key in your \.ssh folder, name it {_projectName_}\_rsa,
- Send it to test| production server host

## APP INSTALL & SETUP:

- FIRST setup config.json

- run "yarn app-install"
  it will automatically install all required npm modules and prepare project for Wordpress install:
  -- creates app/.yeopress
  -- setups app/local-config.php
  -- installs Wordpress: (submit all default values, hitting Enter)

- continue Wordpress setup in browser
  -- turn off _site indexing for search engines_
  -- close browser window when Login windows appears
- run "yarn app-setup" to update WP config

## THEME DEVELOPMENT

- use yarn start && yarn build commmands

## DEPLOY TO PRODUCTION

- configure app/config.php db options
- setup config.json prod ssh & db options
