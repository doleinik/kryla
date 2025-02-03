<?php

require_once dirname(__FILE__) . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';
use Dotenv\Dotenv as Dotenv;

// Check for environment
$host = explode('.', $_SERVER['HTTP_HOST']);

// Local env
$local = end($host) === 'loc';

// Test env
$test = $host[0] === 'tests';

// Set env
$envDir  = ($local) ? (dirname(dirname(__FILE__))) : __DIR__;
$envFile = ($local) ? '.env.loc' : '.env';

// Load env
$dotenv = Dotenv::createMutable($envDir, $envFile);
$dotenv->safeLoad();

// Local development environment
if ($local) {

    // Environment
    define('WP_ENVIRONMENT_TYPE', 'local');

    // Debug
    define('WP_DEBUG', false);
    define('WP_DEBUG_DISPLAY', true);
    define('WP_DEBUG_LOG', true);
}

// Test server development environment
elseif ($test) {

    // Environment
    define('WP_ENVIRONMENT_TYPE', 'staging');

    // Debug
    define('WP_DEBUG', true);
    define('WP_DEBUG_DISPLAY', false);
    define('WP_DEBUG_LOG', true);
} else {

    // Environment
    define('WP_ENVIRONMENT_TYPE', 'production');

    // Debug
    define('WP_DEBUG', false);
}

// DB Configuration
define('DB_NAME', $_ENV['DB_NAME']);
define('DB_USER', $_ENV['DB_USER']);
define('DB_PASSWORD', $_ENV['DB_PASSWORD']);
define('DB_HOST', $_ENV['DB_HOST']);

/*
 * DEFINE SYSTEM CONSTANTS
 */

define('JWT_AUTH_SECRET_KEY', $_ENV['JWT_SECRET_KEY']);

// Set memory size
define('WP_MEMORY_LIMIT', ini_get('memory_limit'));

// Disable admin scripts concatenation
define('CONCATENATE_SCRIPTS', false);

// Set default theme
define('WP_DEFAULT_THEME', 'bamboo');

// Disable default themes update/download
define('CORE_UPGRADE_SKIP_NEW_BUNDLED', true);

// Disable theme & plugin edit from admin
define('DISALLOW_FILE_EDIT', true);

// No revisions
define('WP_POST_REVISIONS', false);

// Set ACF KEY
define('ACF_PRO_LICENSE', 'b3JkZXJfaWQ9MTM3MTM4fHR5cGU9ZGV2ZWxvcGVyfGRhdGU9MjAxOC0wOC0xMyAxMjowNTo0Mw==');
