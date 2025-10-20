<?php
/**
 * WordPress Configuration for LGD Map Plugin
 */

// ** Database settings ** //
define( 'DB_NAME', getenv('WORDPRESS_DB_NAME') ?: 'wordpress' );
define( 'DB_USER', getenv('WORDPRESS_DB_USER') ?: 'wordpress' );
define( 'DB_PASSWORD', getenv('WORDPRESS_DB_PASSWORD') ?: 'wordpress' );
define( 'DB_HOST', getenv('WORDPRESS_DB_HOST') ?: 'mysql:3306' );
define( 'DB_CHARSET', 'utf8mb4' );
define( 'DB_COLLATE', '' );

// ** Authentication Unique Keys and Salts ** //
define( 'AUTH_KEY',         'your-auth-key-here' );
define( 'SECURE_AUTH_KEY',  'your-secure-auth-key-here' );
define( 'LOGGED_IN_KEY',    'your-logged-in-key-here' );
define( 'NONCE_KEY',        'your-nonce-key-here' );
define( 'AUTH_SALT',        'your-auth-salt-here' );
define( 'SECURE_AUTH_SALT', 'your-secure-auth-salt-here' );
define( 'LOGGED_IN_SALT',   'your-logged-in-salt-here' );
define( 'NONCE_SALT',       'your-nonce-salt-here' );

// ** WordPress Database Table prefix ** //
$table_prefix = 'wp_';

// ** WordPress Debug Mode ** //
define( 'WP_DEBUG', false );
define( 'WP_DEBUG_LOG', false );
define( 'WP_DEBUG_DISPLAY', false );

// ** WordPress URLs ** //
define( 'WP_HOME', getenv('WORDPRESS_HOME') ?: 'http://localhost' );
define( 'WP_SITEURL', getenv('WORDPRESS_SITEURL') ?: 'http://localhost' );

// ** Memory Limit ** //
define( 'WP_MEMORY_LIMIT', '256M' );

// ** File Permissions ** //
define( 'FS_METHOD', 'direct' );

// ** Security ** //
define( 'DISALLOW_FILE_EDIT', true );
define( 'DISALLOW_FILE_MODS', false ); // Allow plugin updates

// ** Plugin Auto-Activation ** //
define( 'WP_AUTO_UPDATE_CORE', false );

// ** That's all, stop editing! Happy publishing. ** //

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
    define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
