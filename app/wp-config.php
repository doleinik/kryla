<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */
 
// Include local configuration
if (file_exists(dirname(__FILE__) . '/local-config.php')) {
	include(dirname(__FILE__) . '/local-config.php');
}

// Global DB config
if (!defined('DB_NAME')) {
	define('DB_NAME', 'kryla');
}
if (!defined('DB_USER')) {
	define('DB_USER', 'root');
}
if (!defined('DB_PASSWORD')) {
	define('DB_PASSWORD', '');
}
if (!defined('DB_HOST')) {
	define('DB_HOST', 'localhost');
}

/** Database Charset to use in creating database tables. */
if (!defined('DB_CHARSET')) {
	define('DB_CHARSET', 'utf8');
}

/** The Database Collate type. Don't change this if in doubt. */
if (!defined('DB_COLLATE')) {
	define('DB_COLLATE', '');
}

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'P+[:(Gjn:$gpU/DJgBeK!%}-GD3wo|XAy-IZW?rm[(?:=8N3Fo2nU+/=&JlF&n]-');
define('SECURE_AUTH_KEY',  '0HX-@?,/uHdF,*tKngbX+;4pF]ir7lDRQ8Gd$FUwnR,ot;-!_<wd2?V/&*WR6%V$');
define('LOGGED_IN_KEY',    'PAfBu,}%KcwnuD#9-)dTvQ7a%GK)%C<-|0{P_cej$upb%S2N(j=vR5i!L88$Oyi#');
define('NONCE_KEY',        'i6CG2k-!)JnwOi/@XcgC=Odw|(rJsM#%#!BLXaF:WR^,u:N|A6m~rs4b{i[Ba@%L');
define('AUTH_SALT',        'z.<dw)MO!9p]d9%L?*=/DVw^T|%2wAKYWV~+|%n@Zj.TYRW?23KrEKz%k`(%Py.a');
define('SECURE_AUTH_SALT', '7]fF>xQ~4@xeX+x+=$2?55c!8bC6;b8_-r*>QoCV[`P=kvS}o]jdPU|{dVRN>vra');
define('LOGGED_IN_SALT',   'W]<$YOqVbSzdHwKr*)7zuv!b$2~=+ }Mv~74D.<I8|lkD*`-Gp-^8J.C_=`hvzg~');
define('NONCE_SALT',       'MYm_e-%hpVgu%O`la2![[<yah1}%5JXE&pnk+cEH3JcHzvBTW1+#)lR-Rge12+4q');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'bb_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
if (!defined('WP_DEBUG')) {
	define('WP_DEBUG', false);
}

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
